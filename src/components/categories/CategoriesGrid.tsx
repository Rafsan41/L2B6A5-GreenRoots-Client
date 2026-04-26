import Link from "next/link"
import { JarSVG } from "@/components/icons/botanical/JarSVG"
import type { Category } from "@/types/category"

// ── Botanical data per known slug ─────────────────────────────────────────────
const BOTANICAL: Record<string, {
  genus: string; species: string; commonName: string; seal: string; latin: string
}> = {
  "adaptogens":        { genus: "Withania",  species: "somnifera",   commonName: "ASHWAGANDHA",  seal: "WILD CRAFT",  latin: "Adaptogena · Nervina"     },
  "skin-hair":         { genus: "Rosa",       species: "canina",      commonName: "ROSEHIP OIL",  seal: "COLD PRESS",  latin: "Dermatica · Cosmetica"    },
  "digestive":         { genus: "Zingiber",   species: "officinale",  commonName: "GINGER ROOT",  seal: "RAW HERB",    latin: "Stomachica · Carminativa" },
  "vitamins-minerals": { genus: "Moringa",    species: "oleifera",    commonName: "MORINGA LEAF", seal: "ORGANIC",     latin: "Nutrientia · Mineralia"   },
  "immunity-boost":    { genus: "Sambucus",   species: "nigra",       commonName: "ELDERBERRY",   seal: "WILD BERRY",  latin: "Immunia · Antiviralia"    },
  "sleep-calm":        { genus: "Valeriana",  species: "officinalis", commonName: "VALERIAN",     seal: "NIGHT HERB",  latin: "Sedativa · Calmantia"     },
}
const DEFAULT_BOT = {
  genus: "Herba", species: "organica", commonName: "HERB", seal: "WILD CRAFT", latin: "Botanica · Organica",
}

interface CategoriesGridProps {
  categories: Category[]
  onCategoryClick?: (slug: string) => void
}

const CategoriesGrid = ({ categories, onCategoryClick }: CategoriesGridProps) => {
  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-24 text-center">
        <span
          style={{
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontSize:   56,
            color:      "var(--moss)",
            fontStyle:  "italic",
          }}
        >
          ☘
        </span>
        <p
          style={{
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontStyle:  "italic",
            fontSize:   24,
            color:      "var(--bark)",
          }}
        >
          No specimens found.
        </p>
        <p className="gr-mono" style={{ color: "var(--bark-2)", fontSize: 9 }}>
          Try adjusting your search.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {categories.map((category, i) => {
        const bot           = BOTANICAL[category.slug] ?? DEFAULT_BOT
        const num           = String(i + 1).padStart(3, "0")
        const [word1, ...rest] = category.name.split(" ")

        return (
          <Link
            key={category.id}
            href={`/categories/${category.slug}`}
            onClick={() => onCategoryClick?.(category.slug)}
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

            {/* ── Top row ── */}
            <div className="relative z-10 flex justify-between items-start mb-1">
              <span
                className="gr-mono"
                style={{ color: "var(--card-number)", fontSize: 10, letterSpacing: "0.12em" }}
              >
                COLLECTION № {num}
              </span>
              <span
                className="gr-mono"
                style={{
                  color:        "var(--card-category-label)",
                  fontSize:     10,
                  letterSpacing:"0.10em",
                  paddingRight: 50,
                }}
              >
                · {category.name.toUpperCase()}
              </span>
            </div>

            {/* ── Rotating seal ── */}
            <div className="absolute z-20" style={{ top: 14, right: 14 }}>
              <svg width="56" height="56" viewBox="0 0 56 56">
                <defs>
                  <path
                    id={`cg-arc-${category.id}`}
                    d="M 28,28 m -18,0 a 18,18 0 1,1 36,0 a 18,18 0 1,1 -36,0"
                  />
                </defs>
                <circle cx="28" cy="28" r="22" fill="none" stroke="var(--card-seal-outer)" strokeWidth="1"   />
                <circle cx="28" cy="28" r="19" fill="none" stroke="var(--card-seal-inner)" strokeWidth="0.5" />
                <text
                  fontFamily="var(--font-jetbrains-mono), monospace"
                  fontSize="5.5"
                  letterSpacing="0.18em"
                  fill="var(--card-seal-text)"
                >
                  <textPath href={`#cg-arc-${category.id}`} startOffset="12%">
                    {bot.seal} · GREENROOTS ·
                  </textPath>
                </text>
                <circle cx="28" cy="28" r="2.5" fill="var(--card-seal-dot)" />
              </svg>
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
                <JarSVG genus={bot.genus} species={bot.species} commonName={bot.commonName} />
              </div>
            </div>

            {/* ── Bottom content ── */}
            <div className="relative z-10">
              <h3
                className="leading-tight mb-0.5"
                style={{
                  fontFamily: "var(--font-cormorant), Georgia, serif",
                  fontWeight: 500,
                  fontSize:   "clamp(22px, 2.2vw, 28px)",
                  color:      "var(--card-name-primary)",
                }}
              >
                {word1}{" "}
                <em style={{ color: "var(--card-number)", fontStyle: "italic" }}>
                  {rest.join(" ")}
                </em>
              </h3>

              <p
                style={{
                  fontFamily:   "var(--font-cormorant), Georgia, serif",
                  fontStyle:    "italic",
                  fontSize:     13,
                  color:        "var(--card-subtitle)",
                  marginBottom: 14,
                }}
              >
                {bot.latin}
              </p>

              <div
                className="flex justify-between items-center pt-3"
                style={{ borderTop: "1px solid var(--card-divider)" }}
              >
                <span
                  className="gr-mono"
                  style={{ color: "var(--card-listing-label)", fontSize: 10 }}
                >
                  {category._count.medicines} remedies
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
        )
      })}
    </div>
  )
}

export default CategoriesGrid
