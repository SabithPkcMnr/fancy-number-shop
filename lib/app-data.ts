import { catalog } from "./catalog";
import { autoHighlights } from "./highlights";
import { defaultSettings, fallbackNav, publicSettings } from "./site";
import type { AppData, Inquiry, MenuItem, Order, PublicPayload, RegisteredUser, Slide, VipNumber } from "./types";

const defaultSlides: Slide[] = [
  {
    id: "slide-1",
    kicker: "India's favourite VIP catalogue",
    title: "Find a number people never forget.",
    text: "Mirrors, 786, repeating digits, and family packs — ready to port to Jio, Airtel, Vi or BSNL.",
    ctaLabel: "Browse VIP numbers",
    ctaHref: "/numbers",
    image: "",
    gradient: "from-neutral-950 via-neutral-900 to-orange-950",
    active: true,
  },
  {
    id: "slide-2",
    kicker: "Pay your way",
    title: "Razorpay checkout or WhatsApp in one tap.",
    text: "Buy instantly with cards and UPI, or chat with our desk about a specific number.",
    ctaLabel: "See offers",
    ctaHref: "/offers",
    image: "",
    gradient: "from-indigo-900 via-violet-800 to-fuchsia-700",
    active: true,
  },
  {
    id: "slide-3",
    kicker: "UPC in 60 minutes",
    title: "Your number. Your name. Any network.",
    text: "Secure UPC on every order. Porting support until the SIM lights up.",
    ctaLabel: "How it works",
    ctaHref: "/how-it-works",
    image: "",
    gradient: "from-neutral-950 via-stone-900 to-amber-950",
    active: true,
  },
];

function defaultMenus(): MenuItem[] {
  return fallbackNav.map((item, index) => ({
    id: `header-${index}`,
    href: item.href,
    label: item.label,
    placement: "header",
    order: index,
    visible: true,
  }));
}

function seedUsers(): RegisteredUser[] {
  return [
    {
      id: "usr_1001",
      name: "Rahul Sharma",
      phone: "9876501234",
      email: "rahul.sharma@gmail.com",
      createdAt: "2026-06-12T10:20:00.000Z",
    },
    {
      id: "usr_1002",
      name: "Priya Nair",
      phone: "9822011122",
      email: "priya.nair@outlook.com",
      createdAt: "2026-07-03T14:05:00.000Z",
    },
    {
      id: "usr_1003",
      name: "Amit Patel",
      phone: "9765412345",
      email: "amit.patel@yahoo.com",
      createdAt: "2026-08-01T09:40:00.000Z",
    },
  ];
}

function seedOrders(): Order[] {
  const first = catalog[10];
  const second = catalog[12];
  return [
    {
      id: "FNS10021",
      items: [{ id: first.id, digits: first.digits, pattern: first.pattern, price: first.price }],
      total: first.price,
      customer: {
        name: "Rahul Sharma",
        phone: "9876501234",
        email: "rahul.sharma@gmail.com",
        city: "Pune",
      },
      payment: "razorpay",
      paymentId: "pay_demo_21",
      status: "completed",
      upc: "482913",
      createdAt: "2026-08-08T11:15:00.000Z",
    },
    {
      id: "FNS10022",
      items: [{ id: second.id, digits: second.digits, pattern: second.pattern, price: second.price }],
      total: second.price,
      customer: {
        name: "Priya Nair",
        phone: "9822011122",
        email: "priya.nair@outlook.com",
        city: "Kochi",
      },
      payment: "whatsapp",
      status: "processing",
      createdAt: "2026-08-18T16:42:00.000Z",
    },
  ];
}

function seedInquiries(): Inquiry[] {
  return [
    {
      id: "inq_1001",
      kind: "choice",
      name: "Vikram Joshi",
      phone: "9988776655",
      message: "Looking for a 786 ending number under ₹25,000",
      status: "new",
      createdAt: "2026-08-20T08:12:00.000Z",
    },
  ];
}

export function seedData(): AppData {
  return {
    settings: defaultSettings,
    numbers: catalog,
    slides: defaultSlides,
    menus: defaultMenus(),
    users: seedUsers(),
    orders: seedOrders(),
    inquiries: seedInquiries(),
  };
}

function mergeNumbers(raw: VipNumber[] | undefined, seedNumbers: VipNumber[]) {
  const list = raw?.length ? raw : seedNumbers;
  const have = new Set(list.map((item) => item.id));
  const extra = seedNumbers.filter((item) => !have.has(item.id));
  const seedMap = new Map(seedNumbers.map((item) => [item.id, item]));
  return [...extra, ...list].map((item) => {
    if (item.highlights?.some((range) => range.color)) return item;
    const seeded = seedMap.get(item.id);
    if (seeded && "highlights" in seeded) return { ...item, highlights: seeded.highlights ?? [] };
    return { ...item, highlights: autoHighlights(item.digits) };
  });
}

export function mergeStore(raw: Partial<AppData>): AppData {
  const seed = seedData();
  return {
    settings: {
      ...seed.settings,
      ...raw.settings,
      trustLine: raw.settings?.trustLine || seed.settings.trustLine,
      onesignalAppId: raw.settings?.onesignalAppId ?? seed.settings.onesignalAppId,
      onesignalRestApiKey: raw.settings?.onesignalRestApiKey ?? seed.settings.onesignalRestApiKey,
      razorpayWebhookSecret: raw.settings?.razorpayWebhookSecret ?? seed.settings.razorpayWebhookSecret,
    },
    numbers: mergeNumbers(raw.numbers, seed.numbers),
    slides: raw.slides?.length ? raw.slides : seed.slides,
    menus: raw.menus?.length ? raw.menus : seed.menus,
    users: raw.users ?? seed.users,
    orders: raw.orders ?? seed.orders,
    inquiries: raw.inquiries ?? seed.inquiries,
  };
}

export function publicFromStore(store: AppData): PublicPayload {
  return {
    settings: publicSettings(store.settings),
    numbers: store.numbers.filter((item) => item.status === "live"),
    slides: store.slides.filter((slide) => slide.active),
    menus: store.menus.filter((item) => item.visible).sort((a, b) => a.order - b.order),
  };
}
