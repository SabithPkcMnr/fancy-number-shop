import { promises as fs } from "fs";
import path from "path";
import { mergeStore, publicFromStore, seedData } from "./app-data";
import type { AppData, PublicPayload, VipNumber } from "./types";

const dataDir = path.join(process.cwd(), "data");
const storePath = path.join(dataDir, "store.json");

let memory: AppData | null = null;
let writeQueue = Promise.resolve();
let loadedRev = 0;
const STORE_REV = 5;

function withLock<T>(fn: () => Promise<T>) {
  const run = writeQueue.then(fn, fn);
  writeQueue = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

async function ensureDir() {
  await fs.mkdir(dataDir, { recursive: true });
}

export async function getStore(): Promise<AppData> {
  if (memory && loadedRev === STORE_REV) return memory;
  try {
    const raw = await fs.readFile(storePath, "utf8");
    memory = mergeStore(JSON.parse(raw) as Partial<AppData>);
    loadedRev = STORE_REV;
    await persist(memory);
    return memory;
  } catch {
    memory = seedData();
    loadedRev = STORE_REV;
    await persist(memory);
    return memory;
  }
}

async function persist(next: AppData) {
  memory = next;
  loadedRev = STORE_REV;
  try {
    await ensureDir();
    await fs.writeFile(storePath, JSON.stringify(next, null, 2), "utf8");
  } catch (error) {
    console.error("Could not persist store.json", error);
  }
}

export async function updateStore(patch: Partial<AppData>) {
  return withLock(async () => {
    const current = await getStore();
    const next = { ...current, ...patch };
    await persist(next);
    return next;
  });
}

export async function mutateStore(fn: (current: AppData) => AppData) {
  return withLock(async () => {
    const current = await getStore();
    const next = fn(current);
    await persist(next);
    return next;
  });
}

export async function getPublicPayload(): Promise<PublicPayload> {
  return publicFromStore(await getStore());
}

export async function findNumber(id: string) {
  const store = await getStore();
  return store.numbers.find((item) => item.id === id);
}

export async function liveNumber(id: string) {
  const item = await findNumber(id);
  return item?.status === "live" ? item : undefined;
}

export function similarFrom(list: VipNumber[], item: VipNumber, limit = 8) {
  return list
    .filter((other) => other.id !== item.id && other.status === "live")
    .map((other) => {
      let score = 0;
      if (other.familyGroup && other.familyGroup === item.familyGroup) score += 8;
      if (other.category === item.category) score += 3;
      if (other.categories.some((cat) => item.categories.includes(cat))) score += 1;
      return { other, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.other);
}

export { nextId, nextOrderId } from "./ids";
