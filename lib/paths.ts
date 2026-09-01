export function isStaticHost() {
  return process.env.NEXT_PUBLIC_STATIC === "true";
}

export function withBase(path: string) {
  return `${process.env.NEXT_PUBLIC_BASE_PATH || ""}${path}`;
}

export function isAdminLoginPath(path: string | null) {
  return Boolean(path && path.replace(/\/$/, "") === "/admin/login");
}

export function samePath(a: string, b: string) {
  const normalize = (value: string) => value.replace(/\/$/, "") || "/";
  return normalize(a) === normalize(b);
}
