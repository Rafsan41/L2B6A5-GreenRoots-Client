import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { getCategoryIcon } from "@/lib/category-icon"
import type { Category } from "@/types/category"

interface CategoriesGridProps {
  categories: Category[]
  onCategoryClick?: (slug: string) => void
}

const CategoriesGrid = ({ categories, onCategoryClick }: CategoriesGridProps) => {
  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-20 text-center">
        <p className="text-lg font-medium text-foreground">No categories found</p>
        <p className="text-sm text-muted-foreground">
          Try adjusting your search to find what you need.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {categories.map((category) => {
        const Icon = getCategoryIcon(category.slug)
        return (
          <Link
            key={category.id}
            href={`/categories/${category.slug}`}
            onClick={() => onCategoryClick?.(category.slug)}
            className="group relative flex flex-col gap-4 rounded-2xl border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
          >
            <div className="flex size-14 items-center justify-center rounded-xl border bg-primary/10 transition-colors group-hover:bg-primary/20">
              <Icon className="size-7 text-primary" />
            </div>

            <div className="flex flex-1 flex-col gap-1.5">
              <h3 className="text-lg font-semibold text-foreground">{category.name}</h3>
              {category.description && (
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {category.description}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between border-t pt-4">
              <span className="text-sm font-medium text-muted-foreground">
                {category._count.medicines} medicines
              </span>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-all group-hover:gap-2">
                View Products
                <ArrowRight className="size-3.5" />
              </span>
            </div>
          </Link>
        )
      })}
    </div>
  )
}

export default CategoriesGrid
