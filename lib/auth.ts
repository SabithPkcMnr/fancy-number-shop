import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { getStore } from "./db";

const COOKIE = "fns_admin";

function secret() {
  return process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD || "fancynumbershop-admin-secret";
}

function sign(value: string) {
  return createHmac("sha256", secret()).update(value).digest("hex");
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export function createAdminToken() {
  const exp = Date.now() + 7 * 24 * 60 * 60 * 1000;
  const payload = `admin.${exp}`;
  return `${payload}.${sign(payload)}`;
}

export function readAdminToken(token?: string | null) {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [role, exp, mac] = parts;
  const payload = `${role}.${exp}`;
  if (!safeEqual(sign(payload), mac)) return false;
  if (role !== "admin") return false;
  if (Number(exp) < Date.now()) return false;
  return true;
}

export async function isAdminRequest(request?: NextRequest) {
  const token = request
    ? request.cookies.get(COOKIE)?.value
    : (await cookies()).get(COOKIE)?.value;
  return readAdminToken(token);
}

export async function verifyAdminCredentials(username: string, password: string) {
  const { settings } = await getStore();
  const user = process.env.ADMIN_USER || settings.adminUser;
  const pass = process.env.ADMIN_PASSWORD || settings.adminPassword;
  return safeEqual(username.trim(), user) && safeEqual(password, pass);
}

export const adminCookie = {
  name: COOKIE,
  options: {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    secure: process.env.NODE_ENV === "production",
  },
};
