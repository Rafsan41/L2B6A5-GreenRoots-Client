"use client";

import { useRef } from "react";
import Link from "next/link";
import { JarCard, JarCardProduct } from "./JarCard";
import { SideFernSVG } from "@/components/icons/botanical";

/* Static featured products — replace with API call in the page */
export const FEATURED_PRODUCTS: JarCardProduct[] = [
  {
    id: "1",
    slug: "turmeric-root",
    number: "№ 047",
    name: "Turmeric",
    partName: "Root",
    genus: "Curcuma",
    species: "longa",
    commonName: "TURMERIC",
    price: 120,
    badge: "Spring Harvest",
  },
  {
    id: "2",
    slug: "ashwagandha-root",
    number: "№ 042",
    name: "Ashwagandha",
    partName: "Root",
    genus: "Withania",
    species: "somnifera",
    commonName: "ASHWAGANDHA",
    price: 480,
    featured: true,
  },
  {
    id: "3",
    slug: "tulsi-leaf",
    number: "№ 038",
    name: "Tulsi",
    partName: "Leaf",
    genus: "Ocimum",
    species: "sanctum",
    commonName: "TULSI",
    price: 320,
  },
  {
    id: "4",
    slug: "ginger-root",
    number: "№ 051",
    name: "Ginger",
    partName: "Root",
    genus: "Zingiber",
    species: "officinale",
    commonName: "GINGER",
    price: 180,
    badge: "Best Seller",
  },
  {
    id: "5",
    slug: "chamomile-flower",
    number: "№ 063",
    name: "Chamomile",
    partName: "Flower",
    genus: "Matricaria",
    species: "chamomilla",
    commonName: "CHAMOMILE",
    price: 260,
  },
  {
    id: "6",
    slug: "valerian-root",
    number: "№ 071",
    name: "Valerian",
    partName: "Root",
    genus: "Valeriana",
    species: "officinalis",
    commonName: "VALERIAN",
    price: 390,
  },
];

interface ProductShelfProps {
  products?: JarCardProduct[];
}

export function ProductShelf({ products = FEATURED_PRODUCTS }: ProductShelfProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: number) => {
    scrollRef.current?.scrollBy({ left: dir * 300, behavior: "smooth" });
  };

  return (
    <section
      className="relative overflow-hidden border-b"
      style={{
        padding: "clamp(60px, 8vw, 110px) 0",
        borderColor: "var(--rule)",
        position: "relative",
        zIndex: 2,
      }}
    >
      {/* Decorative side fern */}
      <SideFernSVG
        className="absolute pointer-events-none hidden lg:block"
        style={{
          bottom: -40,
          left: -60,
          width: 240,
          height: 480,
          color: "var(--moss-mid)",
          opacity: 0.45,
          transform: "rotate(-8deg)",
        }}
        aria-hidden="true"
      />

      {/* Header */}
      <div className="max-w-[1320px] mx-auto px-4 md:px-8 lg:px-10 relative z-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-end mb-10 md:mb-12">
          <div>
            <span className="gr-index">❦ Chapter III · The Shelf</span>
            <h2
              style={{
                fontFamily: "var(--font-cormorant), Georgia, serif",
                fontWeight: 500,
                fontSize: "clamp(36px, 5.5vw, 80px)",
                lineHeight: 1,
                letterSpacing: "-0.02em",
                color: "var(--ink)",
              }}
            >
              This week&apos;s{" "}
              <em style={{ color: "var(--moss)", fontStyle: "italic" }}>selection.</em>
            </h2>
          </div>

          {/* Scroll controls */}
          <div className="flex gap-2.5 shrink-0">
            {[-1, 1].map((dir) => (
              <button
                key={dir}
                onClick={() => scroll(dir)}
                className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-200"
                style={{
                  background: "transparent",
                  border: "1px solid var(--ink)",
                  color: "var(--ink)",
                  cursor: "pointer",
                }}
                aria-label={dir === -1 ? "Previous" : "Next"}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                  {dir === -1
                    ? <><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></>
                    : <><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></>
                  }
                </svg>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Horizontal scroll track */}
      <div
        ref={scrollRef}
        className="flex gap-4 md:gap-5 overflow-x-auto pb-8 md:pb-10 pt-6 md:pt-8"
        style={{
          scrollSnapType: "x mandatory",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {/* Left spacer */}
        <div className="shrink-0" style={{ flex: "0 0 max(16px, calc((100vw - 1320px) / 2 + 16px))" }} />

        {products.map((p) => (
          <JarCard key={p.id} product={p} />
        ))}

        {/* "See all" end card */}
        <div
          className="shrink-0 flex items-center justify-center rounded-2xl"
          style={{
            flex: "0 0 clamp(160px, 40vw, 220px)",
            background: "var(--cream)",
            border: "1px dashed var(--bark)",
            padding: 24,
            scrollSnapAlign: "start",
          }}
        >
          <Link
            href="/medicines"
            style={{
              fontFamily: "var(--font-cormorant), Georgia, serif",
              fontStyle: "italic",
              fontSize: "clamp(20px, 3vw, 26px)",
              color: "var(--moss)",
              textAlign: "center",
              lineHeight: 1.2,
            }}
          >
            See the<br />full shelf →
          </Link>
        </div>

        {/* Right spacer */}
        <div className="shrink-0" style={{ flex: "0 0 max(16px, calc((100vw - 1320px) / 2 + 16px))" }} />
      </div>
    </section>
  );
}
