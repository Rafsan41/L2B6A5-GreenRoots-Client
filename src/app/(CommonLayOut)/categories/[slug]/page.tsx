"use client"

import { useState, useMemo, useEffect } from "react"
import { useParams } from "next/navigation"
import { notFound } from "next/navigation"
import { Loader2 } from "lucide-react"
import { categoryService } from "@/services/category.service"
import { medicineService } from "@/services/medicine.service"
import type { Category } from "@/types/category"
import type { Medicine } from "@/types/medicine"
import CategoryHeader from "@/components/products/CategoryHeader"
import ProductFilters, {
  defaultFilters,
  type FiltersState,
} from "@/components/products/ProductFilters"
import MobileFilterSheet from "@/components/products/MobileFilterSheet"
import ProductSort, { type SortOption } from "@/components/products/ProductSort"
import SpecimenProductCard from "@/components/products/SpecimenProductCard"
import ProductEmpty from "@/components/products/ProductEmpty"
import ProductPagination from "@/components/products/ProductPagination"

const ITEMS_PER_PAGE = 8

export default function CategorySlugPage() {
  const params = useParams<{ slug: string }>()
  const slug = params.slug

  const [category, setCategory]     = useState<Category | null>(null)
  const [notFound404, setNotFound404] = useState(false)
  const [allMedicines, setAllMedicines] = useState<Medicine[]>([])
  const [isLoading, setIsLoading]   = useState(true)

  useEffect(() => {
    Promise.all([
      categoryService.getAll(),
      medicineService.getAll(),
    ]).then(([cats, meds]) => {
      const found = cats.find((c) => c.slug === slug)
      if (!found) { setNotFound404(true); return }
      setCategory(found)
      setAllMedicines(meds.filter((m) => m.category.slug === slug))
    }).finally(() => setIsLoading(false))
  }, [slug])

  const [filters, setFilters]   = useState<FiltersState>(defaultFilters)
  const [sortBy, setSortBy]     = useState<SortOption>("popular")
  const [currentPage, setCurrentPage] = useState(1)

  if (notFound404) notFound()

  const activeFilterCount = useMemo(() => {
    let count = 0
    if (filters.priceRange) count++
    count += filters.manufacturers.length
    if (filters.minRating) count++
    if (filters.inStockOnly) count++
    if (filters.prescriptionOnly) count++
    count += filters.forms.length
    return count
  }, [filters])

  const availableManufacturers = useMemo(
    () => [...new Set(allMedicines.map((m) => m.manufacturer))].sort(),
    [allMedicines]
  )
  const availableForms = useMemo(
    () => [...new Set(allMedicines.map((m) => m.form).filter(Boolean))].sort() as string[],
    [allMedicines]
  )

  const filteredMedicines = useMemo(() => {
    let result = [...allMedicines]
    if (filters.priceRange) {
      result = result.filter(
        (m) =>
          parseFloat(m.price) >= filters.priceRange!.min &&
          parseFloat(m.price) < (filters.priceRange!.max === Infinity ? 999999 : filters.priceRange!.max)
      )
    }
    if (filters.manufacturers.length > 0)
      result = result.filter((m) => filters.manufacturers.includes(m.manufacturer))
    if (filters.minRating)
      result = result.filter((m) => m.rating >= filters.minRating!)
    if (filters.inStockOnly)
      result = result.filter((m) => m.stock > 0)
    if (filters.prescriptionOnly)
      result = result.filter((m) => m.prescriptionRequired)
    if (filters.forms.length > 0)
      result = result.filter((m) => m.form && filters.forms.includes(m.form))

    switch (sortBy) {
      case "popular":   result.sort((a, b) => b.reviewCount - a.reviewCount); break
      case "newest":    result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break
      case "price-asc": result.sort((a, b) => parseFloat(a.price) - parseFloat(b.price)); break
      case "price-desc":result.sort((a, b) => parseFloat(b.price) - parseFloat(a.price)); break
      case "rating":    result.sort((a, b) => b.rating - a.rating); break
    }
    return result
  }, [allMedicines, filters, sortBy])

  const totalPages = Math.ceil(filteredMedicines.length / ITEMS_PER_PAGE)
  const paginatedMedicines = filteredMedicines.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const handleFiltersChange = (f: FiltersState) => { setFilters(f); setCurrentPage(1) }
  const handleSortChange    = (s: SortOption)   => { setSortBy(s);  setCurrentPage(1) }
  const handleResetFilters  = ()                 => { setFilters(defaultFilters); setCurrentPage(1) }

  if (isLoading || !category) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="w-full">
      <CategoryHeader category={category} medicineCount={allMedicines.length} />

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          <div className="hidden w-64 shrink-0 lg:block">
            <div className="sticky top-24 rounded-2xl border bg-card p-5">
              <ProductFilters
                filters={filters}
                onFiltersChange={handleFiltersChange}
                manufacturers={availableManufacturers}
                forms={availableForms}
                activeCount={activeFilterCount}
              />
            </div>
          </div>

          <div className="flex-1">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <MobileFilterSheet
                filters={filters}
                onFiltersChange={handleFiltersChange}
                manufacturers={availableManufacturers}
                forms={availableForms}
                activeCount={activeFilterCount}
              />
              <ProductSort
                value={sortBy}
                onChange={handleSortChange}
                totalCount={allMedicines.length}
                filteredCount={filteredMedicines.length}
              />
            </div>

            {paginatedMedicines.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {paginatedMedicines.map((medicine, i) => (
                  <SpecimenProductCard
                    key={medicine.id}
                    medicine={medicine}
                    index={(currentPage - 1) * ITEMS_PER_PAGE + i}
                  />
                ))}
              </div>
            ) : (
              <ProductEmpty onResetFilters={handleResetFilters} />
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
