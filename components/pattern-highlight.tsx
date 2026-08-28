import { clampHighlights, colorAt, highlightClass, type DigitHighlight } from "@/lib/highlights";

export function PatternHighlight({
  pattern,
  digits,
  highlights,
  tone = "light",
}: {
  pattern: string;
  digits: string;
  highlights?: DigitHighlight[];
  tone?: "light" | "dark";
}) {
  const clean = digits.replace(/\D/g, "");
  const ranges = clampHighlights(highlights, clean.length || 10);
  let digitIndex = 0;

  return (
    <>
      {[...pattern].map((char, index) => {
        if (/\d/.test(char) && digitIndex < clean.length) {
          const color = colorAt(digitIndex, ranges);
          digitIndex += 1;
          return (
            <span key={index} className={highlightClass(color, tone)}>
              {char}
            </span>
          );
        }
        return <span key={index}>{char}</span>;
      })}
    </>
  );
}
