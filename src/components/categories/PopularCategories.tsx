import Link from "next/link"
import type { Category } from "@/types/category"

interface PopularCategoriesProps {
  categories: Category[]
}

const PopularCategories = ({ categories }: PopularCategoriesProps) => {
  const top5 = [...categories]
    .sort((a, b) => b._count.medicines - a._count.medicines)
    .slice(0, 5)

  if (top5.length === 0) return null

  return (
    <div
      className="border-b"
      style={{
        borderColor: "var(--rule)",
        background:  "var(--parchment)",
        padding:     "18px 0",
      }}
    >
      <div className="max-w-[1320px] mx-auto px-4 md:px-8 lg:px-10 flex items-center gap-5 overflow-x-auto">
        {/* Label */}
        <span
          className="gr-mono shrink-0"
          style={{ color: "var(--bark)", fontSize: 9 }}
        >
          MOST BROWSED
        </span>

        {/* Separator */}
        <div
          style={{ width: 1, height: 22, background: "var(--rule)", flexShrink: 0 }}
        />

        {/* Pill links */}
        <div className="flex items-center gap-2">
          {top5.map((cat, i) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="group shrink-0 flex items-center gap-2.5 transition-all duration-200"
              style={{
                background:   "transparent",
                border:       "1px solid var(--rule)",
                borderRadius: "100px",
                padding:      "7px 18px 7px 14px",
              }}
            >
              <span
                className="gr-mono"
                style={{ color: "var(--clay)", fontSize: 9 }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-cormorant), Georgia, serif",
                  fontStyle:  "italic",
                  fontSize:   15,
                  color:      "var(--ink)",
                  whiteSpace: "nowrap",
                }}
              >
                {cat.name}
              </span>
              <span
                className="gr-mono"
                style={{ color: "var(--bark-2)", fontSize: 9 }}
              >
                {cat._count.medicines}
              </span>
              <span
                className="transition-transform duration-200 group-hover:translate-x-0.5"
                style={{ color: "var(--moss)", fontSize: 14 }}
              >
                →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PopularCategories
