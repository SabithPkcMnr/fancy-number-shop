import { autoHighlights } from "./highlights";
import { getNumerology } from "./numerology";
import type { CategorySlug, CheckoutMode, DigitHighlight, NumberStatus, VipNumber } from "./types";

export type { CategorySlug, CheckoutMode, NumberStatus, VipNumber };

export const categories: {
  slug: CategorySlug;
  name: string;
  blurb: string;
  image?: string;
}[] = [
  { slug: "vvip", name: "VVIP Number", blurb: "Ultra-rare, conversation-stopping numbers.", image: "/images/hero-slide-1.png" },
  { slug: "mirror", name: "Mirror Number", blurb: "Palindromes that read the same both ways.", image: "/images/cat-mirror.png" },
  { slug: "penta", name: "Penta Number", blurb: "Five identical digits in a row.", image: "/images/cat-penta.png" },
  { slug: "two-digit", name: "2 Digit Numbers", blurb: "Only two unique digits. Instant recall.", image: "/images/cat-family.png" },
  { slug: "hexa", name: "Hexa Number", blurb: "Six repeating digits — true collector pieces." },
  { slug: "septa", name: "Septa", blurb: "Seven identical digits in a row." },
  { slug: "octa", name: "Octa", blurb: "Eight identical digits — among the rarest holds." },
  { slug: "aaa-bbb", name: "AAA BBB", blurb: "Two stacked triples, like 111 222." },
  { slug: "abc-abc-abc", name: "ABC ABC ABC", blurb: "The same three-digit motif, three times." },
  { slug: "abcd-xy-abcd", name: "ABCD XY ABCD", blurb: "A four-digit block that returns after a pair." },
  { slug: "middle-penta", name: "MIDDLE PENTA", blurb: "Five identical digits sitting in the middle." },
  { slug: "aoo-boo", name: "AOO BOO", blurb: "Rhyming hundreds: 100 200, 300 400." },
  { slug: "lucky-786", name: "786 Special", blurb: "The most requested auspicious sequence.", image: "/images/cat-786.png" },
  { slug: "without-248", name: "Without 2, 4 & 8", blurb: "Numerology-clean numbers, no 2, 4 or 8." },
  { slug: "doubling", name: "Doubling Number", blurb: "Pairs that echo: 100 101, 505 505." },
  { slug: "abc-abc", name: "ABC ABC", blurb: "A triplet that repeats — 970 970." },
  { slug: "xy-xy-xy", name: "XY XY XY", blurb: "A two-digit motif that keeps returning." },
  { slug: "sequential", name: "Counting Number", blurb: "Rising sequences that feel inevitable." },
  { slug: "ending-0000", name: "Ending 0000", blurb: "A silent, powerful close." },
  { slug: "semi-mirror", name: "Semi-Mirror", blurb: "Near-palindromes with a designer twist." },
  { slug: "tetra", name: "Tetra Number", blurb: "Four repeating digits, perfectly placed." },
  { slug: "abcd-abcd", name: "ABCD ABCD", blurb: "An eight-digit rhyme. Rare and expensive." },
  { slug: "three-digit", name: "3 Digit Number", blurb: "Only three unique digits in the whole number." },
  { slug: "unique", name: "Choice Number", blurb: "Curated patterns that simply look right." },
];

type Flag = {
  featured?: boolean;
  offer?: boolean;
  prebook?: boolean;
  prebookDate?: string;
  familyGroup?: string;
  extra?: CategorySlug[];
  checkout?: CheckoutMode;
  status?: NumberStatus;
  highlights?: DigitHighlight[];
  accent?: string[];
  plain?: boolean;
};

type Seed = [string, string, number, number, CategorySlug, Flag?];

const seeds: Seed[] = [
  ["9888888888", "98 8888 8888", 1250000, 10, "vvip", { featured: true, extra: ["hexa", "octa"] }],
  ["9008888800", "9 00 88888 00", 275000, 10, "penta", { featured: true, extra: ["tetra", "middle-penta"] }],
  ["9623232323", "96 23 23 23 23", 585000, 10, "xy-xy-xy", { featured: true, extra: ["vvip"], accent: ["23232323"] }],
  ["9822222225", "98 2222222 5", 455000, 10, "vvip", { featured: true, extra: ["hexa", "septa"], accent: ["2222222"] }],
  ["9999990001", "99 9999 0001", 980000, 10, "hexa", { featured: true, extra: ["vvip"], accent: ["9999"] }],
  ["7777777008", "777777 7008", 720000, 12, "hexa", { featured: true, extra: ["vvip"], accent: ["777777"] }],
  ["9090909091", "90 90 90 90 91", 390000, 10, "two-digit", { featured: true, extra: ["vvip"], accent: ["90909090"] }],
  ["8888888123", "888888 8123", 650000, 10, "hexa", { featured: true, accent: ["888888"] }],
  ["7867867860", "786 786 786 0", 185000, 10, "lucky-786", { featured: true, extra: ["abc-abc", "abc-abc-abc"], accent: ["786"] }],
  ["9812343219", "98 1234 3219", 89000, 10, "mirror", { featured: true, accent: ["1234321"] }],
  ["7377937777", "737793 7777", 33999, 10, "penta", { featured: true, extra: ["tetra"], accent: ["7777"] }],
  ["9067100101", "9067 100 101", 16319, 20, "doubling", { offer: true, featured: true, accent: ["100101"] }],
  ["9371505505", "9371 505 505", 16319, 20, "doubling", { offer: true, featured: true, accent: ["505505"] }],
  ["9765501313", "97655 01313", 7019, 25, "penta", { offer: true, featured: true, accent: ["01313"] }],
  ["9888945935", "98 88 94 59 35", 1600, 10, "unique", { offer: true, featured: true }],
  ["9955053595", "9955 053595", 4378, 10, "without-248", { featured: true }],
  ["9709707187", "970 970 7187", 3200, 10, "abc-abc", { featured: true }],
  ["6913300013", "69133 00013", 5760, 10, "ending-0000", { featured: true }],
  ["9096591930", "90 96 59 19 30", 3600, 10, "without-248", { featured: true, familyGroup: "90965" }],
  ["9096595016", "90 96 59 50 16", 3600, 10, "without-248", { featured: true, familyGroup: "90965" }],
  ["9096595593", "90 96 59 55 93", 3600, 10, "without-248", { offer: true, familyGroup: "90965" }],
  ["9096595196", "90 96 59 51 96", 3600, 10, "without-248", { offer: true, familyGroup: "90965" }],
  ["9096591039", "90 96 59 10 39", 3600, 10, "without-248", { familyGroup: "90965" }],
  ["9096605916", "90 96 60 59 16", 3600, 10, "without-248", { familyGroup: "90966" }],
  ["9096611063", "90 96 61 10 63", 3600, 10, "without-248", { offer: true, familyGroup: "90966" }],
  ["9096610335", "90 96 61 03 35", 3600, 10, "without-248", { offer: true, familyGroup: "90966" }],
  ["7070709758", "70 70 70 9758", 9000, 33, "two-digit", { offer: true, extra: ["xy-xy-xy"] }],
  ["7070709745", "70 70 70 9745", 9000, 33, "two-digit", { offer: true, extra: ["xy-xy-xy"] }],
  ["7070709712", "70 70 70 9712", 9000, 33, "two-digit", { offer: true, extra: ["xy-xy-xy"] }],
  ["7070709617", "70 70 70 9617", 9000, 33, "two-digit", { offer: true, extra: ["xy-xy-xy"] }],
  ["7070709586", "70 70 70 9586", 9000, 33, "two-digit", { offer: true, extra: ["xy-xy-xy"] }],
  ["7070709536", "70 70 70 9536", 9000, 33, "two-digit", { offer: true, extra: ["xy-xy-xy"] }],
  ["7070709324", "70 70 70 9324", 9000, 33, "two-digit", { offer: true, extra: ["xy-xy-xy"] }],
  ["7070708304", "70 70 70 8304", 9000, 33, "two-digit", { offer: true, extra: ["xy-xy-xy"] }],
  ["9123432190", "91 234 321 90", 42000, 10, "mirror"],
  ["9876567890", "98 765 678 90", 38000, 10, "mirror", { extra: ["sequential"] }],
  ["9001121109", "9001 121 109", 56000, 12, "mirror"],
  ["9221122119", "92 211 221 19", 47000, 10, "semi-mirror"],
  ["9449944994", "94 499 449 94", 61000, 10, "semi-mirror"],
  ["9555595559", "95555 95559", 88000, 10, "penta"],
  ["9666669011", "9 66666 9011", 128000, 10, "penta", { extra: ["hexa"] }],
  ["9777771452", "9 77777 1452", 99000, 15, "penta"],
  ["9333338008", "9 33333 8008", 112000, 10, "penta"],
  ["8111111234", "8 11111 1234", 76000, 10, "penta"],
  ["8000000123", "8 00000 0123", 145000, 10, "ending-0000", { extra: ["penta"] }],
  ["9000000786", "9 00000 0786", 168000, 10, "ending-0000", { extra: ["lucky-786"] }],
  ["9876543210", "98 7654 3210", 210000, 10, "sequential", { featured: true }],
  ["9123456789", "91 2345 6789", 198000, 10, "sequential"],
  ["8901234567", "890 123 4567", 54000, 10, "sequential"],
  ["7861234567", "786 123 4567", 42000, 10, "lucky-786", { extra: ["sequential"] }],
  ["9087867862", "90 8786 7862", 28000, 10, "lucky-786"],
  ["9878678601", "98 786 786 01", 22000, 15, "lucky-786", { extra: ["abc-abc"] }],
  ["7867861234", "786 786 1234", 31000, 10, "lucky-786", { extra: ["abc-abc"] }],
  ["9178691786", "91 786 91 786", 44000, 10, "lucky-786", { extra: ["abcd-abcd"] }],
  ["9458776776", "9458 776 776", 9800, 10, "doubling", { prebook: true, prebookDate: "2026-09-18" }],
  ["9639636302", "963 963 6302", 4500, 10, "abc-abc", { prebook: true, prebookDate: "2026-09-25" }],
  ["9759753677", "975 975 3677", 4500, 10, "abc-abc", { prebook: true, prebookDate: "2026-09-25" }],
  ["8006800849", "8006 8008 49", 4500, 10, "semi-mirror", { prebook: true, prebookDate: "2026-09-25" }],
  ["7050095500", "70500 95500", 5250, 10, "doubling", { prebook: true, prebookDate: "2026-09-11" }],
  ["7050907003", "70 50 90 70 03", 3750, 10, "unique", { prebook: true, prebookDate: "2026-09-22" }],
  ["7050052005", "70500 52005", 3750, 10, "doubling", { prebook: true, prebookDate: "2026-09-22" }],
  ["7320083009", "73 200 83 009", 3400, 10, "unique", { prebook: true, prebookDate: "2026-09-24" }],
  ["7579999444", "757 9999 444", 24300, 10, "tetra", { prebook: true, prebookDate: "2026-09-17" }],
  ["8317779999", "831 777 9999", 59850, 10, "tetra", { prebook: true, prebookDate: "2026-09-28" }],
  ["9666666835", "9 666666 835", 66500, 10, "hexa", { prebook: true, prebookDate: "2026-09-11" }],
  ["9796979830", "97 96 97 98 30", 5250, 10, "unique", { prebook: true, prebookDate: "2026-09-25" }],
  ["9997771452", "999777 1452", 7500, 10, "hexa", { prebook: true, prebookDate: "2026-09-27", familyGroup: "999777", extra: ["aaa-bbb"] }],
  ["9997774741", "999777 4741", 7500, 10, "hexa", { prebook: true, prebookDate: "2026-09-27", familyGroup: "999777", extra: ["aaa-bbb"] }],
  ["9997773556", "999777 3556", 7500, 10, "hexa", { prebook: true, prebookDate: "2026-09-27", familyGroup: "999777", extra: ["aaa-bbb"] }],
  ["9997770271", "999777 0271", 7500, 10, "hexa", { prebook: true, prebookDate: "2026-09-27", familyGroup: "999777", extra: ["aaa-bbb"] }],
  ["9520705911", "95207 05911", 4500, 10, "unique", { prebook: true, prebookDate: "2026-10-07" }],
  ["9520045005", "95 2004 5005", 5250, 10, "doubling", { prebook: true, prebookDate: "2026-10-07" }],
  ["9760953655", "9760 9536 55", 6000, 10, "without-248", { prebook: true, prebookDate: "2026-10-07" }],
  ["9760661366", "9760 6613 66", 6000, 10, "without-248", { prebook: true, prebookDate: "2026-10-07" }],
  ["7310907955", "7310 9079 55", 6000, 10, "unique", { prebook: true, prebookDate: "2026-10-07" }],
  ["9997661055", "9997 6610 55", 6000, 10, "without-248", { prebook: true, prebookDate: "2026-10-07" }],
  ["9119099599", "91190 99599", 6750, 10, "unique", { prebook: true, prebookDate: "2026-10-07" }],
  ["8123456781", "81 2345 6781", 34000, 10, "sequential"],
  ["9012345678", "90 1234 5678", 76000, 10, "sequential"],
  ["9898989898", "98 98 98 98 98", 275000, 8, "two-digit", { featured: true, extra: ["xy-xy-xy"] }],
  ["9696969696", "96 96 96 96 96", 255000, 8, "two-digit", { extra: ["xy-xy-xy"] }],
  ["8585858585", "85 85 85 85 85", 188000, 10, "two-digit"],
  ["7474747474", "74 74 74 74 74", 164000, 10, "two-digit"],
  ["1212121212", "12 12 12 12 12", 142000, 10, "two-digit"],
  ["9090901234", "90 90 90 1234", 28000, 10, "two-digit", { extra: ["xy-xy-xy"] }],
  ["8080808081", "80 80 80 80 81", 96000, 10, "two-digit"],
  ["7007007007", "700 700 700 7", 48000, 12, "abc-abc"],
  ["6006006006", "600 600 600 6", 41000, 10, "abc-abc"],
  ["1234123412", "1234 1234 12", 87000, 10, "abcd-abcd", { extra: ["sequential"] }],
  ["5678567856", "5678 5678 56", 62000, 10, "abcd-abcd"],
  ["4321432143", "4321 4321 43", 58000, 10, "abcd-abcd"],
  ["1357135713", "1357 1357 13", 39000, 10, "abcd-abcd"],
  ["2468246824", "2468 2468 24", 36000, 10, "abcd-abcd"],
  ["9988776655", "99 88 77 66 55", 72000, 10, "sequential"],
  ["1122334455", "11 22 33 44 55", 68000, 10, "doubling", { extra: ["sequential"] }],
  ["5544332211", "55 44 33 22 11", 54000, 10, "doubling"],
  ["1001001001", "100 100 100 1", 91000, 10, "abc-abc", { extra: ["ending-0000"] }],
  ["2002002002", "200 200 200 2", 44000, 10, "abc-abc"],
  ["9009009009", "900 900 900 9", 88000, 10, "abc-abc"],
  ["8111881181", "8111 881 181", 27000, 10, "semi-mirror"],
  ["9222292229", "9222 292 229", 33000, 10, "semi-mirror"],
  ["9555590000", "95555 90000", 128000, 10, "penta", { extra: ["ending-0000"] }],
  ["9888890000", "98888 90000", 155000, 10, "penta", { extra: ["ending-0000"] }],
  ["9777797779", "97777 97779", 72000, 10, "penta"],
  ["9666696669", "96666 96669", 69000, 10, "penta"],
  ["9444494449", "94444 94449", 51000, 10, "tetra"],
  ["9333393339", "93333 93339", 48000, 10, "tetra"],
  ["9111191119", "91111 91119", 64000, 10, "penta"],
  ["8900000089", "89 000000 89", 118000, 10, "ending-0000", { extra: ["mirror"] }],
  ["7800000087", "78 000000 87", 92000, 10, "ending-0000"],
  ["9990000999", "999 0000 999", 175000, 10, "ending-0000", { extra: ["semi-mirror"] }],
  ["9867531590", "98 67 53 15 90", 2499, 10, "without-248"],
  ["9753159753", "97 53 15 97 53", 8900, 10, "without-248", { extra: ["abcd-abcd"] }],
  ["9315793157", "93 15 79 31 57", 6200, 10, "without-248"],
  ["9013579013", "90 13 57 90 13", 7800, 10, "without-248", { extra: ["abc-abc"] }],
  ["9955113355", "99 55 11 33 55", 19000, 10, "without-248", { extra: ["doubling"] }],
  ["9933551199", "99 33 55 11 99", 17500, 10, "without-248"],
  ["9713597135", "9713 597 135", 5400, 10, "without-248"],
  ["9531795317", "9531 795 317", 4100, 10, "without-248"],
  ["8123456789", "81 2345 6789", 46000, 15, "sequential", { offer: true }],
  ["9876501234", "98765 01234", 8900, 20, "unique", { offer: true }],
  ["9991110000", "999 111 0000", 210000, 10, "three-digit", { extra: ["ending-0000"] }],
  ["8880001111", "888 000 1111", 142000, 10, "three-digit"],
  ["7770001111", "777 000 1111", 128000, 10, "three-digit"],
  ["7000000007", "7 00000000 7", 480000, 8, "vvip", { featured: true, extra: ["ending-0000", "mirror"] }],
  ["9000000009", "9 00000000 9", 520000, 8, "vvip", { extra: ["ending-0000", "mirror"] }],
  ["9898981234", "98 98 98 1234", 22000, 10, "xy-xy-xy"],
  ["9797979797", "97 97 97 97 97", 198000, 10, "two-digit"],
  ["9696961230", "96 96 96 1230", 14500, 10, "xy-xy-xy", { extra: ["without-248"] }],
  ["9090907860", "90 90 90 7860", 36000, 10, "lucky-786", { extra: ["two-digit"] }],
  ["7860000786", "786 0000 786", 88000, 10, "lucky-786", { extra: ["ending-0000"] }],
  ["7861111786", "786 1111 786", 64000, 10, "lucky-786", { extra: ["semi-mirror"] }],
  ["5555551234", "555555 1234", 310000, 10, "hexa", { extra: ["vvip"] }],
  ["4444447890", "444444 7890", 88000, 12, "hexa"],
  ["3333339999", "333333 9999", 265000, 10, "hexa", { extra: ["tetra"] }],
  ["2222228888", "222222 8888", 175000, 10, "hexa"],
  ["1111117860", "111111 7860", 240000, 10, "hexa", { extra: ["lucky-786"] }],
  ["9988771122", "99 88 77 11 22", 28000, 15, "doubling", { offer: true }],
  ["8877665544", "88 77 66 55 44", 24000, 15, "sequential", { offer: true }],
  ["9099887766", "90 99 88 77 66", 18000, 20, "sequential", { offer: true }],
  ["9800112233", "98 00 11 22 33", 16000, 20, "doubling", { offer: true }],
  ["9122112219", "91 2211 2219", 27000, 10, "mirror"],
  ["9344433449", "93 4443 3449", 19000, 10, "semi-mirror"],
  ["9566655669", "95 6665 5669", 21000, 10, "semi-mirror", { extra: ["without-248"] }],
  ["9788877889", "97 8887 7889", 25000, 10, "semi-mirror"],
  ["8901238901", "8901 2389 01", 12000, 10, "unique"],
  ["9012349012", "9012 3490 12", 14000, 10, "unique"],
  ["8123458123", "8123 4581 23", 11000, 10, "unique"],
  ["7001237001", "7001 2370 01", 9800, 10, "unique"],
  ["9998887776", "999 888 7776", 86000, 10, "sequential", { extra: ["three-digit"] }],
  ["8887776665", "888 777 6665", 54000, 10, "sequential", { extra: ["aaa-bbb"] }],
  ["9777777781", "9 7777777 81", 185000, 10, "septa", { extra: ["penta"] }],
  ["9888888881", "9 88888888 1", 420000, 10, "octa", { extra: ["hexa"] }],
  ["9811122233", "98 111 222 33", 28000, 10, "aaa-bbb"],
  ["9709709701", "970 970 970 1", 62000, 10, "abc-abc-abc", { extra: ["abc-abc"] }],
  ["9123491234", "9123 49 1234", 22000, 10, "abcd-xy-abcd"],
  ["9155555123", "91 55555 123", 48000, 10, "middle-penta", { extra: ["penta"] }],
  ["9810020030", "98 100 200 30", 18000, 10, "aoo-boo"],
  ["12344321", "wait", 1, 0, "unique"],
];

function toItem(seed: Seed): VipNumber | null {
  const [digits, pattern, originalPrice, discount, category, flags] = seed;
  if (!/^[6-9]\d{9}$/.test(digits)) return null;
  const price = Math.round(originalPrice * (1 - discount / 100));
  const extra = flags?.extra ?? [];
  const checkout =
    flags?.checkout ??
    (flags?.featured || originalPrice >= 50000 ? "razorpay" : "whatsapp");
  return {
    id: digits,
    digits,
    pattern,
    price,
    originalPrice,
    discount,
    category,
    categories: Array.from(new Set([category, ...extra])),
    featured: flags?.featured,
    offer: flags?.offer,
    prebook: flags?.prebook,
    prebookDate: flags?.prebookDate,
    familyGroup: flags?.familyGroup,
    checkout,
    status: flags?.status ?? "live",
    highlights: flags?.plain ? [] : (flags?.highlights ?? autoHighlights(digits)),
  };
}

export const catalog: VipNumber[] = seeds
  .map(toItem)
  .filter((item): item is VipNumber => Boolean(item))
  .map((item, index) => (index % 10 === 9 ? { ...item, highlights: [] } : item));

export function getNumber(id: string) {
  return catalog.find((item) => item.id === id);
}

export function withNumerology(item: VipNumber) {
  return { ...item, numerology: getNumerology(item.digits) };
}

export function similarNumbers(item: VipNumber, limit = 8) {
  return catalog
    .filter((other) => other.id !== item.id)
    .map((other) => {
      let score = 0;
      if (other.familyGroup && other.familyGroup === item.familyGroup) score += 8;
      if (other.category === item.category) score += 3;
      if (other.categories.some((cat) => item.categories.includes(cat))) score += 1;
      const sharedPrefix = sharedStart(item.digits, other.digits);
      score += sharedPrefix;
      return { other, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.other);
}

function sharedStart(a: string, b: string) {
  let i = 0;
  while (i < a.length && a[i] === b[i]) i += 1;
  return i;
}

export function familyPack(quantity: number, items: VipNumber[] = catalog) {
  const groups = new Map<string, VipNumber[]>();
  for (const item of items) {
    const key = item.familyGroup ?? item.digits.slice(0, 5);
    const list = groups.get(key) ?? [];
    list.push(item);
    groups.set(key, list);
  }
  return [...groups.values()]
    .filter((group) => group.length >= quantity)
    .sort((a, b) => b.length - a.length)[0]
    ?.slice(0, quantity) ?? items.slice(0, quantity);
}

export const categoryCount = Object.fromEntries(
  categories.map((category) => [
    category.slug,
    catalog.filter((item) => item.categories.includes(category.slug)).length,
  ]),
) as Record<CategorySlug, number>;
