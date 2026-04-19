"use client"

import { useState, useEffect, useMemo } from "react"
import { Loader2 } from "lucide-react"
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed"
import CategoryHero from "@/components/categories/CategoryHero"
import FeaturedCategoryBanner from "@/components/categories/FeaturedCategoryBanner"
import CategoriesGrid from "@/components/categories/CategoriesGrid"
import RecentlyViewed from "@/components/categories/RecentlyViewed"
import PopularCategories from "@/components/categories/PopularCategories"
import WhyChooseUs from "@/components/categories/WhyChooseUs"
import CategoryCTA from "@/components/categories/CategoryCTA"
import { categoryService } from "@/services/category.service"
import type { Category } from "@/types/category"

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading]       = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const { viewed, addViewed } = useRecentlyViewed()

  useEffect(() => {
    categoryService.getAll()
      .then(setCategories)
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() =>
    categories.filter((c) => {
      if (!searchQuery) return true
      const q = searchQuery.toLowerCase()
      return (
        c.name.toLowerCase().includes(q) ||
        (c.description ?? "").toLowerCase().includes(q)
      )
    }),
    [categories, searchQuery]
  )

  return (
    <div className="w-full">
      <CategoryHero searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      {!loading && <RecentlyViewed viewedSlugs={viewed} allCategories={categories} />}

      <FeaturedCategoryBanner />

      <section className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="size-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <p className="mb-8 text-center text-sm text-muted-foreground">
              Showing {filtered.length} of {categories.length} categories
            </p>
            <CategoriesGrid categories={filtered} onCategoryClick={addViewed} />
          </>
        )}
      </section>

      {!loading && <PopularCategories categories={categories} />}

      <WhyChooseUs />
      <CategoryCTA />
    </div>
  )
}
