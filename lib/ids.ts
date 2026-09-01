export function nextId(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

export function nextOrderId() {
  return `FNS${Math.floor(10000 + Math.random() * 90000)}`;
}
