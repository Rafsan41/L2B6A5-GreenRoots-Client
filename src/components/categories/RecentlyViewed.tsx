import Link from "next/link"
import type { Category } from "@/types/category"

interface RecentlyViewedProps {
  viewedSlugs: string[]
  allCategories: Category[]
}

const RecentlyViewed = ({ viewedSlugs, allCategories }: RecentlyViewedProps) => {
  const items = viewedSlugs
    .map((slug) => allCategories.find((c) => c.slug === slug))
    .filter((c): c is Category => c !== undefined)
    .slice(0, 6)

  if (items.length === 0) return null

  return (
    <div
      className="border-b"
      style={{
        borderColor: "var(--rule)",
        background:  "var(--cream)",
        padding:     "14px 0",
      }}
    >
      <div className="max-w-[1320px] mx-auto px-4 md:px-8 lg:px-10 flex items-center gap-5 overflow-x-auto">
        {/* Label */}
        <span
          className="gr-mono shrink-0"
          style={{ color: "var(--bark)", fontSize: 9 }}
        >
          RECENTLY VIEWED
        </span>

        {/* Separator */}
        <div
          style={{ width: 1, height: 18, background: "var(--rule)", flexShrink: 0 }}
        />

        {/* Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          {items.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="transition-all duration-200"
              style={{
                background:   "transparent",
                border:       "1px solid var(--rule)",
                borderRadius: "100px",
                padding:      "5px 16px",
                fontFamily:   "var(--font-cormorant), Georgia, serif",
                fontStyle:    "italic",
                fontSize:     14,
                color:        "var(--bark)",
                whiteSpace:   "nowrap",
              }}
            >
              {cat.name} →
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default RecentlyViewed
