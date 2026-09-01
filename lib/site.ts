import type { PublicSettings, SiteSettings, VipNumber } from "./types";

export const defaultSettings: SiteSettings = {
  name: "Fancy Number Shop",
  legalName: "Fancy Number Shop",
  tagline: "Your lucky number, delivered.",
  description:
    "Buy VIP, fancy, choice, and numerology mobile numbers online in India from Fancy Number Shop, Mukkom, Calicut. Pay with Razorpay or WhatsApp. UPC in 60 minutes. Port to Jio, Airtel, Vi, or BSNL.",
  phone: "97478 88999",
  phoneHref: "tel:9747888999",
  whatsapp: "919747888999",
  email: "hello@fancynumbershop.com",
  gst: "",
  hours: "24/7 customer support",
  since: 2012,
  addressLine1: "Mukkom",
  addressLine2: "Kozhikode (Calicut), Kerala 673602",
  domain: "https://fancynumbershop.com",
  instagram: "https://instagram.com",
  facebook: "https://facebook.com",
  youtube: "https://youtube.com",
  ticker: [
    "Festival offer · extra 10–25% on selected numbers",
    "UPC within 60 minutes",
    "Port to Jio · Airtel · Vi · BSNL",
    "Office · Mukkom, Calicut, Kerala 673602",
    "Pay online or buy on WhatsApp",
  ],
  razorpayKeyId: "",
  razorpayKeySecret: "",
  razorpayWebhookSecret: "",
  onesignalAppId: "",
  onesignalRestApiKey: "",
  adminUser: "admin",
  adminPassword: "FancyShop@2026",
  defaultCheckout: "whatsapp",
  trustLine: "Secure UPC in 60 minutes · All India",
  maintenanceMode: false,
};

export const site = {
  name: defaultSettings.name,
  legalName: defaultSettings.legalName,
  tagline: defaultSettings.tagline,
  description: defaultSettings.description,
  phone: defaultSettings.phone,
  phoneHref: defaultSettings.phoneHref,
  whatsapp: defaultSettings.whatsapp,
  email: defaultSettings.email,
  gst: defaultSettings.gst,
  trustLine: defaultSettings.trustLine,
  hours: defaultSettings.hours,
  since: defaultSettings.since,
  address: {
    line1: defaultSettings.addressLine1,
    line2: defaultSettings.addressLine2,
  },
  stats: {
    customers: "3,20,000+",
    numbers: "48,000+",
    rating: "4.9",
    years: "14",
  },
  social: {
    instagram: defaultSettings.instagram,
    facebook: defaultSettings.facebook,
    youtube: defaultSettings.youtube,
  },
} as const;

export const fallbackNav = [
  { href: "/", label: "Home" },
  { href: "/numbers", label: "VIP Numbers" },
  { href: "/offers", label: "Offers" },
  { href: "/prebook", label: "Pre-Booking" },
  { href: "/numerology", label: "Numerology" },
  { href: "/about", label: "About" },
  { href: "/gallery", label: "Reviews" },
  { href: "/contact", label: "Contact" },
] as const;

export function inr(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function formatDisplayDate(value: string) {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return value;
  const month = months[Number(match[2]) - 1];
  return month ? `${match[3]} ${month} ${match[1]}` : value;
}

export function formatPattern(digits: string) {
  const clean = digits.replace(/\D/g, "");
  if (clean.length !== 10) return digits;
  return `${clean.slice(0, 2)} ${clean.slice(2, 6)} ${clean.slice(6)}`;
}

export function publicSettings(settings: SiteSettings): PublicSettings {
  const {
    razorpayKeySecret: _secret,
    razorpayWebhookSecret: _hook,
    onesignalRestApiKey: _onesignal,
    adminUser: _user,
    adminPassword: _pass,
    ...rest
  } = settings;
  return rest;
}

export function whatsappLink(whatsapp: string, text: string) {
  const phone = whatsapp.replace(/\D/g, "");
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

export function numberEnquiryText(item: VipNumber, shopName: string) {
  return [
    `Hi ${shopName}, I want to buy this VIP number.`,
    "",
    `Number: ${item.pattern}`,
    `Digits: ${item.digits}`,
    `Price: ${inr(item.price)}`,
    item.prebookDate ? `UPC date: ${item.prebookDate}` : "",
    "",
    "Please confirm availability and next steps.",
  ]
    .filter(Boolean)
    .join("\n");
}

export function numberWhatsAppUrl(item: VipNumber, settings: Pick<PublicSettings, "name" | "whatsapp">) {
  return whatsappLink(settings.whatsapp, numberEnquiryText(item, settings.name));
}
