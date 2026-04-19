"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight, ShoppingCart, Star, Pill, FlaskConical, Droplets, Wind, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { medicineService } from "@/services/medicine.service"
import type { Medicine } from "@/types/medicine"

const formIconMap: Record<string, React.ElementType> = {
  Tablet: Pill, Capsule: Pill, Syrup: FlaskConical,
  Cream: Droplets, Drops: Droplets, Spray: Wind,
}
const formGradientMap: Record<string, string> = {
  Tablet: "from-primary/15 to-primary/5",
  Capsule: "from-primary/15 to-blue-500/5",
  Syrup: "from-orange-400/15 to-primary/5",
  Cream: "from-pink-400/10 to-primary/5",
  Drops: "from-cyan-400/10 to-primary/5",
  Spray: "from-sky-400/10 to-primary/5",
}

function MiniPlaceholder({ form }: { form: string | null }) {
  const Icon = form ? (formIconMap[form] ?? Package) : Package
  const gradient = form ? (formGradientMap[form] ?? "from-primary/15 to-primary/5") : "from-muted to-muted/50"
  return (
    <div className={`flex size-full items-center justify-center bg-gradient-to-br ${gradient}`}>
      <Icon className="size-8 text-primary/30" strokeWidth={1.2} />
    </div>
  )
}

interface RelatedMedicinesProps {
  currentSlug: string
  categoryId:  string
  categorySlug: string
}

const RelatedMedicines = ({ currentSlug, categoryId, categorySlug }: RelatedMedicinesProps) => {
  const [related, setRelated] = useState<Medicine[]>([])

  useEffect(() => {
    medicineService.getByCategory(categoryId, currentSlug).then(setRelated)
  }, [categoryId, currentSlug])

  if (related.length === 0) return null

  return (
    <section className="border-t bg-muted/20">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight">More in this category</h2>
          <Button asChild variant="ghost" size="sm" className="gap-1 text-primary">
            <Link href={`/categories/${categorySlug}`}>
              View all <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {related.map((med) => (
            <Link
              key={med.id}
              href={`/medicines/${med.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border bg-card transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
            >
              <div className="relative aspect-square overflow-hidden">
                <MiniPlaceholder form={med.form} />
                {med.stock === 0 && (
                  <Badge variant="secondary" className="absolute right-2 top-2 text-xs">
                    Out of Stock
                  </Badge>
                )}
              </div>
              <div className="flex flex-col gap-1 p-3">
                <p className="text-xs font-medium text-primary">{med.manufacturer}</p>
                <h3 className="line-clamp-1 text-sm font-semibold">{med.name}</h3>
                <div className="flex items-center gap-1">
                  <Star className="size-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-medium">{med.rating.toFixed(1)}</span>
                </div>
                <div className="mt-1 flex items-center justify-between border-t pt-2">
                  <span className="text-sm font-bold text-primary">৳{med.price}</span>
                  <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                    <ShoppingCart className="size-3" />
                    Add
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default RelatedMedicines
