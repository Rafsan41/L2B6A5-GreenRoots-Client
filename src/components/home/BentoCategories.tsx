import Link from "next/link";
import {
  Brain,
  Sparkles,
  Flame,
  Sun,
  ShieldCheck,
  Moon,
  type LucideIcon,
} from "lucide-react";

// ── Category data ────────────────────────────────────────────────────────────
interface SpecimenCategory {
  num:        string;
  slug:       string;
  badge:      string;
  title:      string;
  latin:      string;
  count:      number;
  icon:       LucideIcon;
  iconColor:  string;   /* CSS color for the icon */
  iconBg:     string;   /* CSS background for the icon circle */
  accent:     string;   /* bottom-border accent color */
}

const CATEGORIES: SpecimenCategory[] = [
  {
    num:       "001",
    slug:      "adaptogens",
    badge:     "ADAPTOGENS",
    title:     "Adaptogens Root",
    latin:     "Adaptogena · Nervina",
    count:     4,
    icon:      Brain,
    iconColor: "oklch(0.42 0.14 142)",
    iconBg:    "oklch(0.46 0.14 142 / 0.12)",
    accent:    "var(--moss)",
  },
  {
    num:       "002",
    slug:      "skin-hair",
    badge:     "SKIN & HAIR",
    title:     "Skin & Hair",
    latin:     "Dermatica · Cosmetica",
    count:     4,
    icon:      Sparkles,
    iconColor: "oklch(0.50 0.18 75)",
    iconBg:    "oklch(0.83 0.17 89 / 0.14)",
    accent:    "var(--honey)",
  },
  {
    num:       "003",
    slug:      "digestive",
    badge:     "DIGESTIVE",
    title:     "Digestive Herbs",
    latin:     "Stomachica · Carminativa",
    count:     4,
    icon:      Flame,
    iconColor: "oklch(0.55 0.20 40)",
    iconBg:    "oklch(0.68 0.19 40 / 0.12)",
    accent:    "var(--cta)",
  },
  {
    num:       "004",
    slug:      "vitamins-minerals",
    badge:     "VITAMINS",
    title:     "Vitamins & Minerals",
    latin:     "Nutrientia · Mineralia",
    count:     4,
    icon:      Sun,
    iconColor: "oklch(0.50 0.18 75)",
    iconBg:    "oklch(0.83 0.17 89 / 0.14)",
    accent:    "var(--honey)",
  },
  {
    num:       "005",
    slug:      "immunity-boost",
    badge:     "IMMUNITY",
    title:     "Immunity Boost",
    latin:     "Immunia · Antiviralia",
    count:     4,
    icon:      ShieldCheck,
    iconColor: "oklch(0.42 0.14 142)",
    iconBg:    "oklch(0.46 0.14 142 / 0.12)",
    accent:    "var(--moss)",
  },
  {
    num:       "006",
    slug:      "sleep-calm",
    badge:     "SLEEP & CALM",
    title:     "Sleep & Calm",
    latin:     "Sedativa · Calmantia",
    count:     4,
    icon:      Moon,
    iconColor: "oklch(0.42 0.17 22)",
    iconBg:    "oklch(0.42 0.17 22 / 0.10)",
    accent:    "var(--clay)",
  },
];

// ── Specimen card ────────────────────────────────────────────────────────────
function SpecimenCard({ cat }: { cat: SpecimenCategory }) {
  const [word1, ...rest] = cat.title.split(" ");
  const Icon = cat.icon;

  return (
    <Link
      href={`/categories/${cat.slug}`}
      className="group relative flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1"
      style={{
        background:   "var(--card-surface)",
        border:       "1px solid var(--card-border-color)",
        borderRadius: "12px",
        padding:      "22px 22px 20px",
        boxShadow:    "var(--card-box-shadow)",
      }}
    >
      {/* Inner ruled border */}
      <div
        className="absolute pointer-events-none"
        style={{
          inset: 7, borderRadius: 7,
          border: "1px solid var(--card-inner-border)",
        }}
      />

      {/* Dot texture */}
      <div
        className="absolute inset-0 pointer-events-none rounded-xl"
        style={{
          backgroundImage: "radial-gradient(circle, var(--card-dot-fill) 1px, transparent 1px)",
          backgroundSize:  "22px 22px",
          opacity:         0.35,
        }}
      />

      {/* ── Top row: number + badge ── */}
      <div className="relative z-10 flex justify-between items-start mb-4">
        <span
          className="gr-mono"
          style={{ color: "var(--card-number)", fontSize: 10, letterSpacing: "0.12em" }}
        >
          COLLECTION № {cat.num}
        </span>
        <span
          className="gr-mono"
          style={{ color: "var(--card-category-label)", fontSize: 10, letterSpacing: "0.1em" }}
        >
          · {cat.badge}
        </span>
      </div>

      {/* ── Icon illustration ── */}
      <div className="relative z-10 flex items-center justify-center py-6">
        {/* Outer decorative ring */}
        <div
          className="relative flex items-center justify-center transition-transform duration-400 group-hover:scale-105"
          style={{
            width:        110,
            height:       110,
            borderRadius: "50%",
            background:   cat.iconBg,
            border:       `1px solid ${cat.iconColor}30`,
            boxShadow:    `0 0 0 8px ${cat.iconBg}`,
          }}
        >
          {/* Inner ring */}
          <div
            className="absolute"
            style={{
              inset:        10,
              borderRadius: "50%",
              border:       `1px dashed ${cat.iconColor}40`,
            }}
          />
          {/* Icon */}
          <Icon
            size={46}
            strokeWidth={1.25}
            style={{ color: cat.iconColor }}
          />
          {/* Decorative dot top-right */}
          <div
            className="absolute"
            style={{
              top:          8,
              right:        8,
              width:        8,
              height:       8,
              borderRadius: "50%",
              background:   cat.iconColor,
              opacity:      0.5,
            }}
          />
        </div>
      </div>

      {/* ── Bottom content ── */}
      <div className="relative z-10">
        {/* Category name */}
        <h3
          className="leading-tight mb-0.5"
          style={{
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontWeight: 500,
            fontSize:   "clamp(20px, 2.2vw, 26px)",
            color:      "var(--card-name-primary)",
          }}
        >
          {word1}{" "}
          <em style={{ color: "var(--card-name-secondary)", fontStyle: "italic" }}>
            {rest.join(" ")}
          </em>
        </h3>

        {/* Latin name */}
        <p
          style={{
            fontFamily:   "var(--font-cormorant), Georgia, serif",
            fontStyle:    "italic",
            fontSize:     13,
            color:        "var(--card-subtitle)",
            marginBottom: 14,
          }}
        >
          {cat.latin}
        </p>

        {/* Footer */}
        <div
          className="flex justify-between items-center pt-3"
          style={{ borderTop: `1px solid ${cat.iconColor}25` }}
        >
          <span
            className="gr-mono"
            style={{ color: "var(--card-listing-label)", fontSize: 10 }}
          >
            {cat.count} remedies
          </span>
          <span
            className="transition-transform duration-300 group-hover:translate-x-1 text-base"
            style={{ color: cat.iconColor }}
          >
            →
          </span>
        </div>
      </div>
    </Link>
  );
}

// ── Section ──────────────────────────────────────────────────────────────────
export function BentoCategories() {
  return (
    <section
      className="relative overflow-hidden border-b"
      style={{
        padding:     "clamp(60px, 8vw, 110px) 0",
        borderColor: "var(--rule)",
        zIndex:      2,
        position:    "relative",
      }}
    >
      {/* Ambient light blob */}
      <div
        className="absolute pointer-events-none"
        style={{
          top:          -120,
          right:        -200,
          width:        600,
          height:       500,
          borderRadius: "50%",
          background:   "radial-gradient(ellipse, oklch(0.38 0.08 140 / 0.12) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-[1320px] mx-auto px-4 md:px-8 lg:px-10 relative z-10">

        {/* ── Section header ── */}
        <div
          className="flex flex-col gap-8 md:grid md:gap-16 items-end mb-10 md:mb-16"
          style={{ gridTemplateColumns: "1.2fr 1fr" }}
        >
          <div>
            <span className="gr-index">❦ Chapter II</span>
            <h2
              style={{
                fontFamily:    "var(--font-cormorant), Georgia, serif",
                fontWeight:    500,
                fontSize:      "clamp(36px, 5.5vw, 80px)",
                lineHeight:    1,
                letterSpacing: "-0.02em",
                color:         "var(--ink)",
              }}
            >
              The{" "}
              <em style={{ color: "var(--moss)", fontStyle: "italic" }}>catalog,</em>{" "}
              by category.
            </h2>
          </div>
          <p
            style={{
              fontFamily:    "var(--font-cormorant), Georgia, serif",
              fontStyle:     "italic",
              fontSize:      "clamp(16px, 2vw, 20px)",
              lineHeight:    1.6,
              color:         "var(--bark)",
              maxWidth:      420,
              paddingLeft:   20,
              borderLeft:    "2px solid var(--honey)",
              paddingBottom: 12,
            }}
          >
            We organise the shelf the old way — by what the remedy does, not what
            it contains. Six chapters, three hundred herbs in total.
          </p>
        </div>

        {/* ── Card grid ── */}
        <div className="grid gap-4 md:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((cat) => (
            <SpecimenCard key={cat.slug} cat={cat} />
          ))}
        </div>
      </div>
    </section>
  );
}
