export type CheckoutMode = "razorpay" | "whatsapp";
export type NumberStatus = "live" | "sold" | "hidden";
export type NumberVisibility = "public" | "private";
export type OrderStatus = "pending" | "paid" | "processing" | "completed" | "cancelled";
export type InquiryStatus = "new" | "open" | "closed";

export type CategorySlug =
  | "vvip"
  | "mirror"
  | "semi-mirror"
  | "penta"
  | "hexa"
  | "septa"
  | "octa"
  | "tetra"
  | "two-digit"
  | "three-digit"
  | "lucky-786"
  | "without-248"
  | "doubling"
  | "aaa-bbb"
  | "abc-abc"
  | "abc-abc-abc"
  | "abcd-abcd"
  | "abcd-xy-abcd"
  | "middle-penta"
  | "aoo-boo"
  | "xy-xy-xy"
  | "sequential"
  | "ending-0000"
  | "unique";

export type HighlightColor = "gold" | "teal" | "violet";

export type DigitHighlight = {
  start: number;
  end: number;
  color?: HighlightColor;
};

export type VipNumber = {
  id: string;
  digits: string;
  pattern: string;
  price: number;
  originalPrice: number;
  discount: number;
  dealerPrice?: number;
  category: CategorySlug;
  categories: CategorySlug[];
  featured?: boolean;
  offer?: boolean;
  prebook?: boolean;
  prebookDate?: string;
  familyGroup?: string;
  checkout: CheckoutMode;
  status: NumberStatus;
  visibility?: NumberVisibility;
  sellerId?: string;
  highlights?: DigitHighlight[];
};

export type Seller = {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  notes: string;
  isOwn: boolean;
  active: boolean;
  createdAt: string;
};

export type Slide = {
  id: string;
  kicker: string;
  title: string;
  text: string;
  ctaLabel: string;
  ctaHref: string;
  image: string;
  gradient: string;
  active: boolean;
};

export type MenuItem = {
  id: string;
  href: string;
  label: string;
  placement: "header" | "footer";
  order: number;
  visible: boolean;
};

export type RegisteredUser = {
  id: string;
  name: string;
  phone: string;
  email: string;
  createdAt: string;
};

export type OrderItem = {
  id: string;
  digits: string;
  pattern: string;
  price: number;
};

export type Order = {
  id: string;
  items: OrderItem[];
  total: number;
  customer: { name: string; phone: string; email: string; city: string };
  payment: "razorpay" | "whatsapp" | "manual";
  paymentId?: string;
  razorpayOrderId?: string;
  confirmToken?: string;
  paidAt?: string;
  status: OrderStatus;
  upc?: string;
  notes?: string;
  createdAt: string;
};

export type Inquiry = {
  id: string;
  kind: "contact" | "choice";
  name: string;
  phone: string;
  email?: string;
  message: string;
  status: InquiryStatus;
  createdAt: string;
};

export type SiteSettings = {
  name: string;
  legalName: string;
  tagline: string;
  description: string;
  phone: string;
  phoneHref: string;
  whatsapp: string;
  email: string;
  gst: string;
  trustLine: string;
  hours: string;
  since: number;
  addressLine1: string;
  addressLine2: string;
  domain: string;
  instagram: string;
  facebook: string;
  youtube: string;
  ticker: string[];
  razorpayKeyId: string;
  razorpayKeySecret: string;
  razorpayWebhookSecret: string;
  onesignalAppId: string;
  onesignalRestApiKey: string;
  adminUser: string;
  adminPassword: string;
  defaultCheckout: CheckoutMode;
  maintenanceMode: boolean;
};

export type AppData = {
  settings: SiteSettings;
  numbers: VipNumber[];
  sellers: Seller[];
  slides: Slide[];
  menus: MenuItem[];
  users: RegisteredUser[];
  orders: Order[];
  inquiries: Inquiry[];
};

export type PublicSettings = Omit<
  SiteSettings,
  "razorpayKeySecret" | "razorpayWebhookSecret" | "onesignalRestApiKey" | "adminUser" | "adminPassword"
>;

export type PublicPayload = {
  settings: PublicSettings;
  numbers: VipNumber[];
  slides: Slide[];
  menus: MenuItem[];
};
