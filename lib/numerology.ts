export type Numerology = {
  total: number;
  steps: number[];
  destiny: number;
  display: string;
};

export function digitSum(value: number | string) {
  return String(value)
    .replace(/\D/g, "")
    .split("")
    .reduce((sum, digit) => sum + Number(digit), 0);
}

export function reduceToSingle(value: number) {
  const steps = [value];
  let current = value;
  while (current > 9) {
    current = digitSum(current);
    steps.push(current);
  }
  return { destiny: current, steps };
}

export function getNumerology(digits: string): Numerology {
  const total = digitSum(digits);
  const { destiny, steps } = reduceToSingle(total);
  return {
    total,
    steps,
    destiny,
    display: `Sum = ${steps.join("-")}`,
  };
}

export const destinyMeanings: Record<number, { title: string; text: string }> = {
  1: {
    title: "The Pioneer",
    text: "Leadership, independence, and a number that announces you before you enter the room.",
  },
  2: {
    title: "The Diplomat",
    text: "Harmony, partnership, and a number that feels gracious in every introduction.",
  },
  3: {
    title: "The Expressionist",
    text: "Creativity, charm, and a number that is effortless to remember and repeat.",
  },
  4: {
    title: "The Builder",
    text: "Stability, trust, and a number that reads as solid for family and business.",
  },
  5: {
    title: "The Visionary",
    text: "Freedom, movement, and a number with kinetic energy — popular with founders.",
  },
  6: {
    title: "The Nurturer",
    text: "Care, beauty, and a number often chosen for homes, clinics, and hospitality.",
  },
  7: {
    title: "The Seeker",
    text: "Depth, intuition, and a quietly powerful number for thinkers and advisors.",
  },
  8: {
    title: "The Magnate",
    text: "Abundance, authority, and the classic prosperity number of Indian numerology.",
  },
  9: {
    title: "The Humanitarian",
    text: "Completion, generosity, and a number with public, magnetic presence.",
  },
};
