"use client"

import { useState, useMemo, useEffect } from "react"
import { Loader2 } from "lucide-react"
import { medicineService } from "@/services/medicine.service"
import type { Medicine } from "@/types/medicine"
import MedicinesHero from "@/components/medicines/MedicinesHero"
import ProductFilters, {
  defaultFilters,
  type FiltersState,
} from "@/components/products/ProductFilters"
import MobileFilterSheet from "@/components/products/MobileFilterSheet"
import ProductSort, { type SortOption } from "@/components/products/ProductSort"
import ProductCard from "@/components/products/ProductCard"
import ProductEmpty from "@/components/products/ProductEmpty"
import ProductPagination from "@/components/products/ProductPagination"

const ITEMS_PER_PAGE = 12

export default function MedicinesPage() {
  const [allActive, setAllActive] = useState<Medicine[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    medicineService.getAll().then((data) => {
      setAllActive(data)
      setIsLoading(false)
    })
  }, [])

  // ── State ──────────────────────────────────────────────
  const [filters, setFilters] = useState<FiltersState>(defaultFilters)
  const [sortBy, setSortBy] = useState<SortOption>("popular")
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")

  // ── Derive filter options from live data ───────────────
  const availableManufacturers = useMemo(
    () => [...new Set(allActive.map((m) => m.manufacturer))].sort(),
    [allActive]
  )
  const availableForms = useMemo(
    () => [...new Set(allActive.map((m) => m.form).filter(Boolean))].sort() as string[],
    [allActive]
  )
  const categoryOptions = useMemo(() => {
    const seen = new Map<string, string>()
    for (const m of allActive) {
      if (!seen.has(m.category.slug)) seen.set(m.category.slug, m.category.name)
    }
    return [...seen.entries()].map(([slug, name]) => ({ slug, name }))
  }, [allActive])

  // ── Active filter badge count ──────────────────────────
  const activeFilterCount = useMemo(() => {
    let count = 0
    if (filters.priceRange)          count++
    count += filters.manufacturers.length
    if (filters.inStockOnly)         count++
    if (filters.prescriptionOnly)    count++
    count += filters.forms.length
    count += filters.categories.length
    return count
  }, [filters])

  const totalActiveCount = activeFilterCount + (searchQuery.trim() ? 1 : 0)

  // ── Filtering + sorting ────────────────────────────────
  const filteredMedicines = useMemo(() => {
    let result = [...allActive]

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.manufacturer.toLowerCase().includes(q) ||
          m.description.toLowerCase().includes(q)
      )
    }

    if (filters.categories.length > 0) {
      result = result.filter((m) => filters.categories.includes(m.category.slug))
    }

    if (filters.priceRange) {
      result = result.filter((m) => {
        const p = parseFloat(m.price)
        return p >= filters.priceRange!.min && p < (filters.priceRange!.max === Infinity ? 999999 : filters.priceRange!.max)
      })
    }

    if (filters.manufacturers.length > 0) {
      result = result.filter((m) => filters.manufacturers.includes(m.manufacturer))
    }

    if (filters.inStockOnly)      result = result.filter((m) => m.stock > 0)
    if (filters.prescriptionOnly) result = result.filter((m) => m.prescriptionRequired)

    if (filters.forms.length > 0) {
      result = result.filter((m) => m.form && filters.forms.includes(m.form))
    }

    switch (sortBy) {
      case "popular":
        result.sort((a, b) => b.stock - a.stock)
        break
      case "newest":
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case "price-asc":
        result.sort((a, b) => parseFloat(a.price) - parseFloat(b.price))
        break
      case "price-desc":
        result.sort((a, b) => parseFloat(b.price) - parseFloat(a.price))
        break
      case "rating":
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
    }

    return result
  }, [allActive, filters, sortBy, searchQuery])

  // ── Pagination ─────────────────────────────────────────
  const totalPages = Math.ceil(filteredMedicines.length / ITEMS_PER_PAGE)
  const paginated = filteredMedicines.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  // ── Handlers ───────────────────────────────────────────
  const handleFiltersChange = (next: FiltersState) => { setFilters(next); setCurrentPage(1) }
  const handleSortChange = (next: SortOption) => { setSortBy(next); setCurrentPage(1) }
  const handleSearchChange = (q: string) => { setSearchQuery(q); setCurrentPage(1) }
  const handleResetAll = () => { setFilters(defaultFilters); setSearchQuery(""); setCurrentPage(1) }

  return (
    <div className="w-full">
      <MedicinesHero
        totalCount={allActive.length}
        filteredCount={filteredMedicines.length}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Desktop sidebar */}
          <aside className="hidden w-64 shrink-0 lg:block">
            <div className="sticky top-24 rounded-2xl border bg-card p-5">
              <ProductFilters
                filters={filters}
                onFiltersChange={handleFiltersChange}
                manufacturers={availableManufacturers}
                forms={availableForms}
                activeCount={activeFilterCount}
                categoryOptions={categoryOptions}
              />
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <MobileFilterSheet
                filters={filters}
                onFiltersChange={handleFiltersChange}
                manufacturers={availableManufacturers}
                forms={availableForms}
                activeCount={activeFilterCount}
                categoryOptions={categoryOptions}
              />
              <ProductSort
                value={sortBy}
                onChange={handleSortChange}
                totalCount={allActive.length}
                filteredCount={filteredMedicines.length}
              />
            </div>

            {/* Active filter chips */}
            {totalActiveCount > 0 && (
              <div className="mb-5 flex flex-wrap items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground">Active filters:</span>
                {searchQuery && (
                  <FilterChip label={`"${searchQuery}"`} onRemove={() => handleSearchChange("")} />
                )}
                {filters.categories.map((slug) => {
                  const cat = categoryOptions.find((c) => c.slug === slug)
                  return cat ? (
                    <FilterChip
                      key={slug}
                      label={cat.name}
                      onRemove={() => handleFiltersChange({ ...filters, categories: filters.categories.filter((s) => s !== slug) })}
                    />
                  ) : null
                })}
                {filters.priceRange && (
                  <FilterChip label={filters.priceRange.label} onRemove={() => handleFiltersChange({ ...filters, priceRange: null })} />
                )}
                {filters.manufacturers.map((m) => (
                  <FilterChip key={m} label={m} onRemove={() => handleFiltersChange({ ...filters, manufacturers: filters.manufacturers.filter((x) => x !== m) })} />
                ))}
                {filters.forms.map((f) => (
                  <FilterChip key={f} label={f} onRemove={() => handleFiltersChange({ ...filters, forms: filters.forms.filter((x) => x !== f) })} />
                ))}
                {filters.inStockOnly && (
                  <FilterChip label="In stock" onRemove={() => handleFiltersChange({ ...filters, inStockOnly: false })} />
                )}
                {filters.prescriptionOnly && (
                  <FilterChip label="Rx required" onRemove={() => handleFiltersChange({ ...filters, prescriptionOnly: false })} />
                )}
                <button onClick={handleResetAll} className="text-xs font-medium text-destructive hover:underline">
                  Clear all
                </button>
              </div>
            )}

            {/* Loading state */}
            {isLoading ? (
              <div className="flex min-h-[40vh] items-center justify-center">
                <Loader2 className="size-8 animate-spin text-primary" />
              </div>
            ) : paginated.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {paginated.map((medicine, i) => (
                  <ProductCard
                    key={medicine.id}
                    medicine={medicine}
                    index={(currentPage - 1) * ITEMS_PER_PAGE + i}
                  />
                ))}
              </div>
            ) : (
              <ProductEmpty onResetFilters={handleResetAll} />
            )}

            <ProductPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border bg-primary/8 px-2.5 py-0.5 text-xs font-medium text-primary">
      {label}
      <button onClick={onRemove} className="ml-0.5 rounded-full text-primary/60 hover:text-primary" aria-label={`Remove ${label} filter`}>
        ×
      </button>
    </span>
  )
}
