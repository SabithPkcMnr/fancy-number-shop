import { catalog, familyPack, type CategorySlug, type VipNumber } from "./catalog";
import { getNumerology } from "./numerology";

export type SearchQuery = {
  q?: string;
  start?: string;
  anywhere?: string;
  end?: string;
  must?: string;
  not?: string;
  total?: string;
  sum?: string;
  min?: string;
  max?: string;
  category?: string;
  family?: string;
  sort?: string;
  offer?: string;
  prebook?: string;
  featured?: string;
};

function cleanDigits(value?: string) {
  return (value ?? "").replace(/\D/g, "");
}

function parseList(value?: string) {
  if (!value?.trim()) return [];
  return value
    .split(/[,\s]+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

export function matches(item: VipNumber, query: SearchQuery) {
  const digits = item.digits;
  const start = cleanDigits(query.start);
  const anywhere = cleanDigits(query.anywhere ?? query.q);
  const end = cleanDigits(query.end);

  if (start && !digits.startsWith(start)) return false;
  if (end && !digits.endsWith(end)) return false;
  if (anywhere && !digits.includes(anywhere)) return false;

  const mustParts = parseList(query.must);
  for (const part of mustParts) {
    const needle = part.replace(/\D/g, "") || part;
    if (needle && !digits.includes(needle)) return false;
  }

  const notParts = parseList(query.not);
  for (const part of notParts) {
    const needle = part.replace(/\D/g, "") || part;
    if (needle && digits.includes(needle)) return false;
  }

  const numerology = getNumerology(digits);
  if (query.total && numerology.total !== Number(query.total)) return false;
  if (query.sum && numerology.destiny !== Number(query.sum)) return false;

  const min = query.min ? Number(query.min) : undefined;
  const max = query.max ? Number(query.max) : undefined;
  if (min && item.price < min) return false;
  if (max && item.price > max) return false;

  if (query.category && query.category !== "all") {
    if (!item.categories.includes(query.category as CategorySlug)) return false;
  }

  if (query.offer === "1" && !item.offer) return false;
  if (query.prebook === "1" && !item.prebook) return false;
  if (query.featured === "1" && !item.featured) return false;

  return true;
}

export function searchNumbers(query: SearchQuery, items: VipNumber[] = catalog): VipNumber[] {
  const live = items.filter((item) => !item.status || item.status === "live");
  const quantity = query.family ? Number(query.family) : 0;
  if (quantity >= 2) {
    return familyPack(quantity, live);
  }

  const results = live.filter((item) => matches(item, query));
  const sort = query.sort ?? "featured";

  return results.sort((a, b) => {
    if (sort === "price-asc") return a.price - b.price;
    if (sort === "price-desc") return b.price - a.price;
    if (sort === "discount") return b.discount - a.discount;
    if (b.featured && !a.featured) return 1;
    if (a.featured && !b.featured) return -1;
    return b.originalPrice - a.originalPrice;
  });
}

export function toSearchParams(query: SearchQuery) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value) params.set(key, value);
  }
  return params.toString();
}
