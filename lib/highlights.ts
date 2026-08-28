import type { DigitHighlight, HighlightColor } from "./types";

export type { DigitHighlight, HighlightColor };

export const HIGHLIGHT_COLORS: HighlightColor[] = ["gold", "teal", "violet"];

export function highlightClass(color: HighlightColor | null | undefined, surface: "light" | "dark" = "light") {
  if (!color) return undefined;
  return surface === "dark" ? `digit-hl digit-hl-${color} digit-hl-dark` : `digit-hl digit-hl-${color}`;
}

export function highlightsToColors(highlights: DigitHighlight[] | undefined, length = 10): (HighlightColor | null)[] {
  const colors: (HighlightColor | null)[] = Array.from({ length }, () => null);
  for (const range of highlights ?? []) {
    const color = range.color ?? "gold";
    for (let i = Math.max(0, range.start); i < Math.min(length, range.end); i++) colors[i] = color;
  }
  return colors;
}

export function colorsToHighlights(colors: (HighlightColor | null)[]): DigitHighlight[] {
  const ranges: DigitHighlight[] = [];
  for (let i = 0; i < colors.length; i++) {
    const color = colors[i];
    if (!color) continue;
    const last = ranges[ranges.length - 1];
    if (last && last.color === color && last.end === i) last.end = i + 1;
    else ranges.push({ start: i, end: i + 1, color });
  }
  return ranges;
}

export function clampHighlights(highlights: DigitHighlight[] | undefined, length = 10): DigitHighlight[] {
  return colorsToHighlights(highlightsToColors(highlights, length));
}

export function colorAt(index: number, highlights: DigitHighlight[]): HighlightColor | null {
  let color: HighlightColor | null = null;
  for (const range of highlights) {
    if (index >= range.start && index < range.end) color = range.color ?? "gold";
  }
  return color;
}

export function isDigitHighlighted(index: number, highlights: DigitHighlight[]) {
  return colorAt(index, highlights) !== null;
}

export function paintDigit(
  index: number,
  highlights: DigitHighlight[],
  color: HighlightColor | "off",
  length = 10,
): DigitHighlight[] {
  const colors = highlightsToColors(highlights, length);
  if (index < 0 || index >= length) return clampHighlights(highlights, length);
  if (color === "off" || colors[index] === color) colors[index] = null;
  else colors[index] = color;
  return colorsToHighlights(colors);
}

export function findAllHighlights(digits: string, needle: string, color: HighlightColor = "gold"): DigitHighlight[] {
  const part = needle.replace(/\D/g, "");
  if (!part) return [];
  const ranges: DigitHighlight[] = [];
  let from = 0;
  while (from <= digits.length - part.length) {
    const index = digits.indexOf(part, from);
    if (index < 0) break;
    ranges.push({ start: index, end: index + part.length, color });
    from = index + part.length;
  }
  return ranges;
}

export function addHighlights(
  existing: DigitHighlight[] | undefined,
  added: DigitHighlight[],
  length = 10,
  color: HighlightColor = "gold",
) {
  const incoming = added.map((item) => ({ ...item, color: item.color ?? color }));
  return clampHighlights([...(existing ?? []), ...incoming], length);
}

type Group = { start: number; end: number; key: string; score: number };

function repeatingRuns(digits: string): Group[] {
  const groups: Group[] = [];
  let i = 0;
  while (i < digits.length) {
    let j = i;
    while (j < digits.length && digits[j] === digits[i]) j += 1;
    if (j - i >= 2) {
      const key = digits.slice(i, j);
      groups.push({ start: i, end: j, key, score: (j - i) * 12 });
    }
    i = j;
  }
  return groups;
}

function repeatingBlocks(digits: string, size: number, minTimes: number): Group[] {
  const groups: Group[] = [];
  for (let start = 0; start <= digits.length - size * minTimes; start++) {
    const unit = digits.slice(start, start + size);
    let times = 1;
    let pos = start + size;
    while (digits.slice(pos, pos + size) === unit) {
      times += 1;
      pos += size;
    }
    if (times >= minTimes) {
      groups.push({
        start,
        end: start + times * size,
        key: unit,
        score: times * size * 8 + size,
      });
    }
  }
  return groups;
}

function luckyGroups(digits: string): Group[] {
  return findAllHighlights(digits, "786").map((item) => ({
    start: item.start,
    end: item.end,
    key: "786",
    score: 48,
  }));
}

function sequentialGroups(digits: string): Group[] {
  const groups: Group[] = [];
  let seqStart = 0;
  for (let n = 1; n <= digits.length; n++) {
    const rising = n < digits.length && Number(digits[n]) === (Number(digits[n - 1]) + 1) % 10;
    const falling = n < digits.length && Number(digits[n]) === (Number(digits[n - 1]) + 9) % 10;
    if (!rising && !falling) {
      if (n - seqStart >= 4) {
        groups.push({
          start: seqStart,
          end: n,
          key: digits.slice(seqStart, n),
          score: (n - seqStart) * 9,
        });
      }
      seqStart = n;
    }
  }
  return groups;
}

function pickGroups(digits: string): Group[] {
  const candidates = [
    ...repeatingRuns(digits),
    ...repeatingBlocks(digits, 2, 2),
    ...repeatingBlocks(digits, 3, 2),
    ...luckyGroups(digits),
    ...sequentialGroups(digits),
  ].sort((a, b) => b.score - a.score || a.start - b.start);

  const taken: Group[] = [];
  for (const group of candidates) {
    const overlaps = taken.some((item) => group.start < item.end && group.end > item.start);
    if (!overlaps) taken.push(group);
  }
  return taken.sort((a, b) => a.start - b.start);
}

export function autoHighlights(digits: string): DigitHighlight[] {
  const clean = digits.replace(/\D/g, "");
  const groups = pickGroups(clean);
  if (!groups.length) return [];

  const keyScore = new Map<string, number>();
  for (const group of groups) {
    keyScore.set(group.key, Math.max(keyScore.get(group.key) ?? 0, group.score));
  }
  const keys = [...keyScore.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([key]) => key);
  const colorFor = new Map<string, HighlightColor>(keys.map((key, index) => [key, HIGHLIGHT_COLORS[index % HIGHLIGHT_COLORS.length]]));

  return groups.map((group) => ({
    start: group.start,
    end: group.end,
    color: colorFor.get(group.key) ?? "gold",
  }));
}

export function suggestHighlights(digits: string): DigitHighlight[] {
  return autoHighlights(digits);
}
