"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { categoryService } from "@/services/category.service"
import { getCategoryIcon } from "@/lib/category-icon"
import type { Category } from "@/types/category"

export function CategoryCard() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    categoryService.getAll()
      .then((data) => setCategories(data.slice(0, 6)))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
        {categories.map((category) => {
          const Icon = getCategoryIcon(category.slug)
          return (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="group flex flex-col items-center gap-3 rounded-2xl border bg-card p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="flex size-14 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                <Icon className="size-7 text-primary" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">{category.name}</h3>
              <p className="text-xs text-muted-foreground">
                {category._count.medicines} medicines
              </p>
            </Link>
          )
        })}
      </div>

      <div className="mt-8 flex justify-center">
        <Button asChild variant="outline" className="gap-2">
          <Link href="/categories">
            View All Categories
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
