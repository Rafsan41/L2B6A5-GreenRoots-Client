import Link from "next/link"
import { Clock, ArrowRight } from "lucide-react"
import { getCategoryIcon } from "@/lib/category-icon"
import type { Category } from "@/types/category"

interface RecentlyViewedProps {
  viewedSlugs: string[]
  allCategories: Category[]
}

const RecentlyViewed = ({ viewedSlugs, allCategories }: RecentlyViewedProps) => {
  const recentCategories = viewedSlugs
    .map((slug) => allCategories.find((c) => c.slug === slug))
    .filter((c): c is Category => c !== undefined)

  if (recentCategories.length === 0) return null

  return (
    <section className="container mx-auto px-4 py-10">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
          <Clock className="size-5 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-bold tracking-tight">Recently Viewed</h2>
          <p className="text-sm text-muted-foreground">Categories you browsed earlier</p>
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2">
        {recentCategories.map((category) => {
          const Icon = getCategoryIcon(category.slug)
          return (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="group flex shrink-0 items-center gap-3 rounded-xl border bg-card px-4 py-3 transition-all hover:border-primary/30 hover:bg-primary/5"
            >
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                <Icon className="size-5 text-primary" />
              </div>
              <div className="min-w-0">
                <h3 className="whitespace-nowrap text-sm font-semibold text-foreground">
                  {category.name}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {category._count.medicines} medicines
                </p>
              </div>
              <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-primary" />
            </Link>
          )
        })}
      </div>
    </section>
  )
}

export default RecentlyViewed
