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
import { VineDivider } from "@/components/home/VineDivider"
import { MarqueeBanner } from "@/components/home/MarqueeBanner"
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

      {/* ① Dark moss hero + search */}
      <CategoryHero
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        categoryCount={categories.length || 6}
      />

      {/* ② Vine + marquee */}
      <VineDivider />
      <MarqueeBanner />

      {/* ③ Recently viewed strip (only if data) */}
      {!loading && (
        <RecentlyViewed viewedSlugs={viewed} allCategories={categories} />
      )}

      {/* ④ Main specimen grid */}
      <section
        className="relative border-b"
        style={{
          padding:     "clamp(60px, 8vw, 110px) 0",
          borderColor: "var(--rule)",
          position:    "relative",
          zIndex:      2,
        }}
      >
        {/* Ambient blob */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: -80, right: -160,
            width: 500, height: 420,
            borderRadius: "50%",
            background: "radial-gradient(ellipse, oklch(0.38 0.08 140 / 0.10) 0%, transparent 70%)",
          }}
        />

        <div className="max-w-[1320px] mx-auto px-4 md:px-8 lg:px-10 relative z-10">

          {/* Section header */}
          <div
            className="flex flex-col gap-8 md:grid md:gap-16 items-end mb-10 md:mb-16"
            style={{ gridTemplateColumns: "1.2fr 1fr" }}
          >
            <div>
              <span className="gr-index">❦ Chapter III · Six Collections</span>
              <h2
                style={{
                  fontFamily:    "var(--font-cormorant), Georgia, serif",
                  fontWeight:    500,
                  fontSize:      "clamp(44px, 5.5vw, 80px)",
                  lineHeight:    1,
                  letterSpacing: "-0.02em",
                  color:         "var(--ink)",
                }}
              >
                The{" "}
                <em style={{ color: "var(--moss)", fontStyle: "italic" }}>catalog,</em>{" "}
                by collection.
              </h2>
            </div>
            <p
              style={{
                fontFamily:    "var(--font-cormorant), Georgia, serif",
                fontStyle:     "italic",
                fontSize:      20,
                lineHeight:    1.6,
                color:         "var(--bark)",
                maxWidth:      420,
                paddingLeft:   20,
                borderLeft:    "2px solid var(--clay)",
                paddingBottom: 12,
              }}
            >
              {searchQuery ? (
                <>
                  Showing {filtered.length} of {categories.length} collections for{" "}
                  <em>&ldquo;{searchQuery}&rdquo;</em>
                </>
              ) : (
                "We organise the shelf the old way — by what the remedy does, not what it contains. Six chapters, three hundred herbs in total."
              )}
            </p>
          </div>

          {/* Grid or loader */}
          {loading ? (
            <div className="flex justify-center py-28">
              <Loader2
                className="size-8 animate-spin"
                style={{ color: "var(--moss)" }}
              />
            </div>
          ) : (
            <CategoriesGrid categories={filtered} onCategoryClick={addViewed} />
          )}
        </div>
      </section>

      {/* ⑤ Most-browsed strip */}
      {!loading && <PopularCategories categories={categories} />}

      {/* ⑥ Featured herb banner */}
      <div style={{ paddingTop: 110 }}>
        <FeaturedCategoryBanner />
      </div>

      {/* ⑦ Vine + Why GreenRoots */}
      <VineDivider reversed />
      <WhyChooseUs />

      {/* ⑧ Dark moss CTA */}
      <CategoryCTA />

    </div>
  )
}
