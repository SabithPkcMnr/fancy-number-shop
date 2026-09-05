import type { Seller, VipNumber } from "./types";

export const OWN_SELLER_ID = "own";

export function defaultSellers(): Seller[] {
  return [
    {
      id: OWN_SELLER_ID,
      name: "Fancy Number Shop",
      phone: "9747888999",
      email: "hello@fancynumbershop.com",
      city: "Mukkom, Calicut",
      notes: "In-house inventory.",
      isOwn: true,
      active: true,
      createdAt: "2012-01-01T00:00:00.000Z",
    },
  ];
}

export function mergeSellers(raw: Seller[] | undefined): Seller[] {
  const seed = defaultSellers();
  const list = raw?.length ? raw : seed;
  const haveOwn = list.some((item) => item.id === OWN_SELLER_ID || item.isOwn);
  const next = haveOwn ? list : [...seed, ...list];
  return next.map((item) => ({
    ...item,
    isOwn: item.id === OWN_SELLER_ID || Boolean(item.isOwn),
    active: item.active !== false,
    notes: item.notes ?? "",
    city: item.city ?? "",
    email: item.email ?? "",
    phone: item.phone ?? "",
  }));
}

export function sellerById(sellers: Seller[], id?: string) {
  return sellers.find((item) => item.id === (id || OWN_SELLER_ID)) ?? sellers.find((item) => item.isOwn) ?? sellers[0];
}

export function matchSeller(sellers: Seller[], value: string) {
  const needle = value.trim().toLowerCase();
  if (!needle) return sellerById(sellers, OWN_SELLER_ID);
  return (
    sellers.find((item) => item.id.toLowerCase() === needle) ||
    sellers.find((item) => item.name.toLowerCase() === needle) ||
    sellers.find((item) => item.name.toLowerCase().includes(needle))
  );
}

export function sellerStats(numbers: VipNumber[], sellerId: string) {
  const list = numbers.filter((item) => (item.sellerId || OWN_SELLER_ID) === sellerId);
  const withDealer = list.filter((item) => (item.dealerPrice ?? 0) > 0);
  return {
    total: list.length,
    live: list.filter((item) => item.status === "live").length,
    sold: list.filter((item) => item.status === "sold").length,
    private: list.filter((item) => item.visibility === "private").length,
    dealerCost: withDealer.reduce((sum, item) => sum + (item.dealerPrice ?? 0), 0),
    sellingValue: list.filter((item) => item.status === "live").reduce((sum, item) => sum + item.price, 0),
    margin: withDealer.reduce((sum, item) => sum + (item.price - (item.dealerPrice ?? 0)), 0),
  };
}
