import { categories } from "./catalog";
import { addHighlights, findAllHighlights, HIGHLIGHT_COLORS, type HighlightColor } from "./highlights";
import { matchSeller, OWN_SELLER_ID } from "./sellers";
import { discountFrom, sellingFrom } from "./pricing";
import { formatPattern } from "./site";
import type { CategorySlug, CheckoutMode, DigitHighlight, NumberStatus, NumberVisibility, Seller, VipNumber } from "./types";

export const NUMBER_SHEET_HEADERS = [
  "Digits",
  "Pattern",
  "Dealer Price",
  "Selling Price",
  "Original Price",
  "Discount %",
  "Category",
  "Checkout",
  "Status",
  "Visibility",
  "Seller",
  "Featured",
  "Offer",
  "Prebook",
  "Prebook Date",
  "Family Group",
  "Highlights",
] as const;

export type ImportRow = {
  number: VipNumber;
  sellerName: string;
  newSeller?: Seller;
  action: "create" | "update";
  errors: string[];
  warnings: string[];
};

const categorySlugs = new Set(categories.map((item) => item.slug));

function cell(row: Record<string, string>, ...keys: string[]) {
  for (const key of keys) {
    const value = row[key];
    if (value) return value;
  }
  return "";
}

function yes(value: string) {
  return /^(1|y|yes|true|on)$/i.test(value.trim());
}

function slugHeader(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "");
}

export function highlightsToText(digits: string, highlights?: DigitHighlight[]) {
  if (!highlights?.length) return "";
  return highlights
    .map((range) => `${digits.slice(range.start, range.end)}:${range.color ?? "gold"}`)
    .filter((part) => !part.startsWith(":"))
    .join("; ");
}

export function parseHighlights(digits: string, value: string): DigitHighlight[] {
  const clean = digits.replace(/\D/g, "");
  if (!value.trim() || clean.length !== 10) return [];
  let next: DigitHighlight[] = [];
  for (const part of value.split(/[;|,]/)) {
    const token = part.trim();
    if (!token) continue;
    const [rawNeedle, rawColor] = token.split(":");
    const color = (HIGHLIGHT_COLORS as string[]).includes((rawColor ?? "gold").trim())
      ? ((rawColor ?? "gold").trim() as HighlightColor)
      : "gold";
    const needle = (rawNeedle ?? "").trim();
    const indexMatch = needle.match(/^(\d{1,2})\s*-\s*(\d{1,2})$/);
    if (indexMatch) {
      const start = Number(indexMatch[1]);
      const end = Number(indexMatch[2]);
      if (start >= 0 && end > start && end <= 10) next = addHighlights(next, [{ start, end, color }], 10, color);
      continue;
    }
    next = addHighlights(next, findAllHighlights(clean, needle, color), 10, color);
  }
  return next;
}

function normalizeCheckout(value: string): CheckoutMode {
  return value.toLowerCase().includes("razor") ? "razorpay" : "whatsapp";
}

function normalizeStatus(value: string): NumberStatus {
  const v = value.trim().toLowerCase();
  if (v === "sold") return "sold";
  if (v === "hidden" || v === "draft") return "hidden";
  return "live";
}

function normalizeVisibility(value: string): NumberVisibility {
  const v = value.trim().toLowerCase();
  if (v === "private" || v === "internal") return "private";
  return "public";
}

function normalizeCategory(value: string): CategorySlug {
  const v = value.trim().toLowerCase().replace(/\s+/g, "-");
  const aliases: Record<string, CategorySlug> = {
    "2-digit": "two-digit",
    "2-digit-number": "two-digit",
    "2-digit-numbers": "two-digit",
    septa: "septa",
    octa: "octa",
    "aaa-bbb": "aaa-bbb",
    "abc-abc-abc": "abc-abc-abc",
    "abcd-xy-abcd": "abcd-xy-abcd",
    "middle-penta": "middle-penta",
    "aoo-boo": "aoo-boo",
    "a00-b00": "aoo-boo",
  };
  if (aliases[v]) return aliases[v];
  if (categorySlugs.has(v as CategorySlug)) return v as CategorySlug;
  const named = categories.find((item) => item.name.toLowerCase() === value.trim().toLowerCase());
  return named?.slug ?? "unique";
}

export function numberToSheetRow(item: VipNumber, sellers: Seller[]) {
  const seller = sellers.find((entry) => entry.id === (item.sellerId || OWN_SELLER_ID));
  return [
    item.digits,
    item.pattern,
    item.dealerPrice ?? "",
    item.price,
    item.originalPrice,
    item.discount,
    item.category,
    item.checkout,
    item.status,
    item.visibility ?? "public",
    seller?.name ?? "Fancy Number Shop",
    item.featured ? "yes" : "no",
    item.offer ? "yes" : "no",
    item.prebook ? "yes" : "no",
    item.prebookDate ?? "",
    item.familyGroup ?? "",
    highlightsToText(item.digits, item.highlights),
  ];
}

export function parseNumberSheet(
  rows: Record<string, string>[],
  existing: VipNumber[],
  sellers: Seller[],
): ImportRow[] {
  const have = new Map(existing.map((item) => [item.digits, item]));
  const createdSellers = new Map<string, Seller>();
  const out: ImportRow[] = [];

  for (const raw of rows) {
    const row: Record<string, string> = {};
    for (const [key, value] of Object.entries(raw)) row[slugHeader(key)] = String(value ?? "").trim();

    const digits = cell(row, "digits", "number", "mobile").replace(/\D/g, "");
    if (!digits) continue;

    const errors: string[] = [];
    const warnings: string[] = [];
    if (!/^[6-9]\d{9}$/.test(digits)) errors.push("Digits must be a valid 10-digit Indian mobile number.");

    const dealerPrice = Number(cell(row, "dealerprice", "cost", "dealercost")) || undefined;
    const sellingPrice = Number(cell(row, "sellingprice", "selling", "ourprice", "saleprice"));
    const originalPrice = Number(cell(row, "originalprice", "mrp", "price")) || sellingPrice || 0;
    const discount = Number(cell(row, "discount", "discountpercent")) || 0;
    const price = sellingFrom(originalPrice, discount, sellingPrice);
    const sellerValue = cell(row, "seller", "sellername", "owner");
    let seller = matchSeller(sellers, sellerValue) || createdSellers.get(sellerValue.toLowerCase());
    let newSeller: Seller | undefined;
    if (!seller && sellerValue) {
      newSeller = {
        id: `seller_${sellerValue.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 24) || Date.now().toString(36)}`,
        name: sellerValue,
        phone: "",
        email: "",
        city: "",
        notes: "Created from bulk upload.",
        isOwn: false,
        active: true,
        createdAt: new Date().toISOString(),
      };
      createdSellers.set(sellerValue.toLowerCase(), newSeller);
      seller = newSeller;
      warnings.push(`Will add seller “${sellerValue}”.`);
    }
    if (!seller) seller = matchSeller(sellers, OWN_SELLER_ID)!;

    if (!seller.isOwn && !(dealerPrice && dealerPrice > 0)) {
      errors.push("Dealer numbers need a dealer price and selling price.");
    }
    if (!price) errors.push("Selling price is required.");
    if (dealerPrice && price && dealerPrice > price) warnings.push("Dealer price is higher than selling price.");

    const current = have.get(digits);
    const category = normalizeCategory(cell(row, "category"));
    const item: VipNumber = {
      id: digits,
      digits,
      pattern: cell(row, "pattern", "display") || formatPattern(digits),
      originalPrice: originalPrice || price,
      discount: discount || discountFrom(originalPrice || price, price),
      price,
      dealerPrice,
      category,
      categories: Array.from(new Set([category, ...(current?.categories ?? [])])),
      checkout: normalizeCheckout(cell(row, "checkout", "buybutton", "payment")),
      status: normalizeStatus(cell(row, "status")),
      visibility: normalizeVisibility(cell(row, "visibility", "publicorprivate", "listing")),
      sellerId: seller.id,
      featured: yes(cell(row, "featured")),
      offer: yes(cell(row, "offer")),
      prebook: yes(cell(row, "prebook")),
      prebookDate: cell(row, "prebookdate", "upcdate") || undefined,
      familyGroup: cell(row, "familygroup", "family") || undefined,
      highlights: parseHighlights(digits, cell(row, "highlights", "highlight")),
    };
    if (!item.highlights?.length && digits.length === 10) warnings.push("No highlights set.");

    out.push({
      number: item,
      sellerName: seller.name,
      newSeller,
      action: current ? "update" : "create",
      errors,
      warnings,
    });
  }

  return out;
}

export function applyImport(existing: VipNumber[], rows: ImportRow[]) {
  const next = [...existing];
  for (const row of rows) {
    if (row.errors.length) continue;
    const index = next.findIndex((item) => item.digits === row.number.digits);
    if (index >= 0) next[index] = { ...next[index], ...row.number };
    else next.unshift(row.number);
  }
  return next;
}

export function applyNewSellers(existing: Seller[], rows: ImportRow[]) {
  const next = [...existing];
  for (const row of rows) {
    if (!row.newSeller || row.errors.length) continue;
    if (!next.some((item) => item.id === row.newSeller!.id)) next.push(row.newSeller);
  }
  return next;
}

export async function workbookFromFile(file: File) {
  const XLSX = await import("xlsx");
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  return XLSX.utils.sheet_to_json<Record<string, string>>(sheet, { defval: "" });
}

function notesSheet(XLSX: typeof import("xlsx")) {
  return XLSX.utils.aoa_to_sheet([
    ["How to fill this sheet"],
    ["Digits", "10-digit Indian mobile starting with 6–9. Required."],
    ["Pattern", "Optional display spacing, e.g. 98 8888 8888."],
    ["Category", categories.map((item) => item.slug).join(", ")],
    ["Checkout", "whatsapp or razorpay"],
    ["Status", "live, sold, or hidden"],
    ["Visibility", "public = shoppers can see it. private = admin only."],
    ["Seller", "Use Fancy Number Shop for in-house stock, or another seller name."],
    ["Dealer Price", "What the dealer charges you. Required for partner numbers. Shoppers never see this."],
    ["Selling Price", "Your shop price. Customers pay this amount."],
    ["Original Price", "Optional MRP / crossed-out price. Leave blank to use selling price."],
    ["Highlights", "Digit groups and colours, e.g. 88888888:gold; 98:teal. Colours: gold, teal, violet."],
    ["Featured / Offer / Prebook", "yes or no"],
  ]);
}

function writeNumbersWorkbook(
  XLSX: typeof import("xlsx"),
  rows: unknown[][],
  filename: string,
) {
  const numbers = XLSX.utils.aoa_to_sheet(rows);
  numbers["!cols"] = NUMBER_SHEET_HEADERS.map(() => ({ wch: 18 }));
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, numbers, "Numbers");
  XLSX.utils.book_append_sheet(workbook, notesSheet(XLSX), "Notes");
  XLSX.writeFile(workbook, filename);
}

export function numbersSheetFilename(label = "all") {
  const slug = label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return `fancy-numbers-${slug || "all"}.xlsx`;
}

export async function downloadNumbersSheet(items: VipNumber[], sellers: Seller[], filename = "fancy-numbers.xlsx") {
  const XLSX = await import("xlsx");
  writeNumbersWorkbook(
    XLSX,
    [[...NUMBER_SHEET_HEADERS], ...items.map((item) => numberToSheetRow(item, sellers))],
    filename,
  );
}

export async function downloadNumberTemplate(sample?: VipNumber, sellers: Seller[] = []) {
  const XLSX = await import("xlsx");
  const example =
    sample ??
    ({
      id: "9888888888",
      digits: "9888888888",
      pattern: "98 8888 8888",
      originalPrice: 1250000,
      discount: 10,
      price: 1125000,
      dealerPrice: 980000,
      category: "vvip",
      categories: ["vvip"],
      checkout: "whatsapp",
      status: "live",
      visibility: "public",
      sellerId: OWN_SELLER_ID,
      featured: true,
      offer: false,
      prebook: false,
      familyGroup: "",
      highlights: [{ start: 2, end: 10, color: "gold" }],
    } as VipNumber);
  writeNumbersWorkbook(XLSX, [[...NUMBER_SHEET_HEADERS], numberToSheetRow(example, sellers)], "fancy-number-bulk-upload.xlsx");
}
