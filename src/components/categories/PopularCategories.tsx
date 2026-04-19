import Link from "next/link"
import { ArrowRight, TrendingUp } from "lucide-react"
import { getCategoryIcon } from "@/lib/category-icon"
import type { Category } from "@/types/category"

interface PopularCategoriesProps {
  categories: Category[]
}

const PopularCategories = ({ categories }: PopularCategoriesProps) => {
  // Top 5 by medicine count
  const top5 = [...categories]
    .sort((a, b) => b._count.medicines - a._count.medicines)
    .slice(0, 5)

  if (top5.length === 0) return null

  return (
    <section className="container mx-auto px-4 py-14">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
          <TrendingUp className="size-5 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Popular Categories</h2>
          <p className="text-sm text-muted-foreground">Most searched categories by our customers</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {top5.map((category) => {
          const Icon = getCategoryIcon(category.slug)
          return (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="group flex items-center gap-3 rounded-xl border bg-card p-4 transition-all hover:border-primary/30 hover:bg-primary/5"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                <Icon className="size-5 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-semibold text-foreground">{category.name}</h3>
                <p className="text-xs text-muted-foreground">{category._count.medicines} medicines</p>
              </div>
              <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-primary" />
            </Link>
          )
        })}
      </div>
    </section>
  )
}

export default PopularCategories
