"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useStore } from "@/lib/store";

const fallbackSlides = [
  {
    id: "1",
    kicker: "India's favourite VIP catalogue",
    title: "Find a number people never forget.",
    text: "Mirrors, 786, repeating digits, and family packs — ready to port to any network.",
    ctaLabel: "Browse VIP numbers",
    ctaHref: "/numbers",
    image: "",
    gradient: "from-teal-900 via-cyan-800 to-sky-700",
    active: true,
  },
];

export function Hero() {
  const { slides } = useStore();
  const list = slides.length ? slides : fallbackSlides;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % list.length), 5600);
    return () => clearInterval(id);
  }, [list.length]);

  const slide = list[index] ?? list[0];

  return (
    <section className="relative">
      <div className={`relative overflow-hidden bg-gradient-to-br ${slide.gradient}`}>
        {slide.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}${slide.image}`} alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" />
        ) : null}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_42%)]" />
        <div className="absolute -right-10 top-10 hidden lg:block text-white/10 font-extrabold text-[140px] leading-none select-none pointer-events-none">
          786
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-3 pb-10 sm:pt-20 sm:pb-32 lg:pt-24 lg:pb-36">
          <p className="hidden sm:block text-xs font-bold tracking-[0.22em] uppercase text-amber-200">{slide.kicker}</p>
          <h1 className="font-display text-[1.05rem] leading-snug sm:text-6xl lg:text-7xl max-w-2xl sm:mt-4 text-white sm:leading-[1.12] text-balance">
            {slide.title}
          </h1>
          <p className="hidden sm:block mt-5 max-w-lg text-white/80 text-[15px] sm:text-lg text-pretty">{slide.text}</p>
          <div className="hidden sm:flex mt-8 flex-wrap gap-3">
            <Link href={slide.ctaHref || "/numbers"} className="h-12 px-7 inline-flex items-center rounded-xl bg-white text-navy text-sm font-bold">
              {slide.ctaLabel || "Browse VIP numbers"}
            </Link>
            <Link
              href="/numerology"
              className="h-12 px-7 inline-flex items-center rounded-xl border border-white/30 text-white text-sm font-bold"
            >
              Numerology search
            </Link>
          </div>

          {list.length > 1 ? (
            <div className="mt-4 sm:mt-10 flex items-center justify-between gap-4">
              <div className="flex items-center gap-1.5 sm:gap-2">
                {list.map((item, i) => (
                  <button
                    key={item.id}
                    onClick={() => setIndex(i)}
                    className={`h-1.5 sm:h-2.5 rounded-full transition-all ${i === index ? "w-5 sm:w-8 bg-white" : "w-1.5 sm:w-2.5 bg-white/40"}`}
                    aria-label={`Slide ${i + 1}`}
                  />
                ))}
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <button
                  onClick={() => setIndex((i) => (i - 1 + list.length) % list.length)}
                  className="grid place-items-center h-10 w-10 rounded-full bg-white text-navy shadow-sm hover:bg-white/90"
                  aria-label="Previous"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => setIndex((i) => (i + 1) % list.length)}
                  className="grid place-items-center h-10 w-10 rounded-full bg-white text-navy shadow-sm hover:bg-white/90"
                  aria-label="Next"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
