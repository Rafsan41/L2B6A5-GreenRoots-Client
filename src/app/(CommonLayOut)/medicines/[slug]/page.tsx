"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Loader2 } from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { medicineService } from "@/services/medicine.service"
import type { Medicine } from "@/types/medicine"
import DetailHero from "@/components/medicine-detail/DetailHero"
import DetailTabs from "@/components/medicine-detail/DetailTabs"
import RelatedMedicines from "@/components/medicine-detail/RelatedMedicines"

export default function MedicineDetailPage() {
  const params = useParams<{ slug: string }>()
  const slug = params.slug

  const [medicine, setMedicine] = useState<Medicine | null | undefined>(undefined)

  useEffect(() => {
    medicineService.getBySlug(slug).then((data) => {
      setMedicine(data)
    })
  }, [slug])

  // Still loading
  if (medicine === undefined) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    )
  }

  // Not found
  if (medicine === null || !medicine.isActive) {
    notFound()
  }

  return (
    <div className="w-full">
      {/* Breadcrumb bar */}
      <div className="border-b bg-muted/20">
        <div className="container mx-auto px-4 py-3">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/categories">Categories</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href={`/categories/${medicine.category.slug}`}>
                    {medicine.category.name}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{medicine.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Hero — image + purchase section */}
      <DetailHero medicine={medicine} category={medicine.category} />

      {/* Tabs — Description, Dosage, Reviews */}
      <DetailTabs medicine={medicine} />

      {/* Related medicines */}
      <RelatedMedicines
        currentSlug={medicine.slug}
        categoryId={medicine.categoryId}
        categorySlug={medicine.category.slug}
      />
    </div>
  )
}
