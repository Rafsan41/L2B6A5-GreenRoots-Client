import Link from "next/link";
import { JarSVG } from "@/components/icons/botanical/JarSVG";

// ── Category data ────────────────────────────────────────────────────────────
interface SpecimenCategory {
  num: string;
  slug: string;
  badge: string;
  seal: string;
  genus: string;
  species: string;
  commonName: string;
  title: string;
  latin: string;
  count: number;
}

const CATEGORIES: SpecimenCategory[] = [
  {
    num: "001",
    slug: "adaptogens",
    badge: "ADAPTOGENS",
    seal: "WILD CRAFT",
    genus: "Withania",
    species: "somnifera",
    commonName: "ASHWAGANDHA",
    title: "Adaptogens Root",
    latin: "Adaptogena · Nervina",
    count: 4,
  },
  {
    num: "002",
    slug: "skin-hair",
    badge: "SKIN & HAIR",
    seal: "COLD PRESS",
    genus: "Rosa",
    species: "canina",
    commonName: "ROSEHIP OIL",
    title: "Skin & Hair",
    latin: "Dermatica · Cosmetica",
    count: 4,
  },
  {
    num: "003",
    slug: "digestive",
    badge: "DIGESTIVE",
    seal: "RAW HERB",
    genus: "Zingiber",
    species: "officinale",
    commonName: "GINGER ROOT",
    title: "Digestive Herbs",
    latin: "Stomachica · Carminativa",
    count: 4,
  },
  {
    num: "004",
    slug: "vitamins-minerals",
    badge: "VITAMINS",
    seal: "ORGANIC",
    genus: "Moringa",
    species: "oleifera",
    commonName: "MORINGA LEAF",
    title: "Vitamins & Minerals",
    latin: "Nutrientia · Mineralia",
    count: 4,
  },
  {
    num: "005",
    slug: "immunity-boost",
    badge: "IMMUNITY",
    seal: "WILD BERRY",
    genus: "Sambucus",
    species: "nigra",
    commonName: "ELDERBERRY",
    title: "Immunity Boost",
    latin: "Immunia · Antiviralia",
    count: 4,
  },
  {
    num: "006",
    slug: "sleep-calm",
    badge: "SLEEP & CALM",
    seal: "NIGHT HERB",
    genus: "Valeriana",
    species: "officinalis",
    commonName: "VALERIAN",
    title: "Sleep & Calm",
    latin: "Sedativa · Calmantia",
    count: 4,
  },
];

// ── Specimen card ────────────────────────────────────────────────────────────
function SpecimenCard({ cat }: { cat: SpecimenCategory }) {
  const [word1, ...rest] = cat.title.split(" ");

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
          inset: 7,
          borderRadius: 7,
          border: "1px solid var(--card-inner-border)",
        }}
      />

      {/* Subtle dot texture */}
      <div
        className="absolute inset-0 pointer-events-none rounded-xl"
        style={{
          backgroundImage: "radial-gradient(circle, var(--card-dot-fill) 1px, transparent 1px)",
          backgroundSize:  "22px 22px",
          opacity:         0.35,
        }}
      />

      {/* ── Top row ── */}
      <div className="relative z-10 flex justify-between items-start mb-1">
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


{/* ── Jar illustration ── */}
      <div className="relative z-10 flex-1 flex items-center justify-center py-3">
        <div
          style={{
            width:      110,
            color:      "var(--card-jar-tint)",
            filter:     "var(--card-jar-drop-shadow)",
            transition: "transform 0.4s ease",
          }}
          className="group-hover:scale-105"
        >
          <JarSVG genus={cat.genus} species={cat.species} commonName={cat.commonName} />
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
            fontSize:   "clamp(20px, 2.2vw, 28px)",
            color:      "var(--card-name-primary)",
          }}
        >
          {word1}{" "}
          <em style={{ color: "var(--card-number)", fontStyle: "italic" }}>
            {rest.join(" ")}
          </em>
        </h3>

        {/* Latin name */}
        <p
          style={{
            fontFamily:  "var(--font-cormorant), Georgia, serif",
            fontStyle:   "italic",
            fontSize:    13,
            color:       "var(--card-subtitle)",
            marginBottom: 14,
          }}
        >
          {cat.latin}
        </p>

        {/* Footer rule */}
        <div
          className="flex justify-between items-center pt-3"
          style={{ borderTop: "1px solid var(--card-divider)" }}
        >
          <span
            className="gr-mono"
            style={{ color: "var(--card-listing-label)", fontSize: 10 }}
          >
            {cat.count} remedies
          </span>
          <span
            className="transition-transform duration-300 group-hover:translate-x-1"
            style={{ color: "var(--card-number)", fontSize: 16 }}
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
              fontFamily:  "var(--font-cormorant), Georgia, serif",
              fontStyle:   "italic",
              fontSize:    "clamp(16px, 2vw, 20px)",
              lineHeight:  1.6,
              color:       "var(--bark)",
              maxWidth:    420,
              paddingLeft: 20,
              borderLeft:  "2px solid var(--honey)",
              paddingBottom: 12,
            }}
          >
            We organise the shelf the old way — by what the remedy does, not what
            it contains. Six chapters, three hundred herbs in total.
          </p>
        </div>

        {/* ── Specimen card grid ── */}
        <div
          className="grid gap-4 md:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        >
          {CATEGORIES.map((cat) => (
            <SpecimenCard key={cat.slug} cat={cat} />
          ))}
        </div>
      </div>
    </section>
  );
}
