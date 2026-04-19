"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight, Star, ShoppingCart, Pill, FlaskConical, Droplets, Wind, Package, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { medicineService } from "@/services/medicine.service"
import type { Medicine } from "@/types/medicine"

// ── Medicine placeholder ──────────────────────────────────
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

function MedicinePlaceholder({ form }: { form: string | null }) {
  const Icon = form ? (formIconMap[form] ?? Package) : Package
  const gradient = form
    ? (formGradientMap[form] ?? "from-primary/15 to-primary/5")
    : "from-muted to-muted/50"
  return (
    <div className={`flex size-full items-center justify-center bg-gradient-to-br ${gradient}`}>
      <Icon className="size-14 text-primary/35" strokeWidth={1.2} />
    </div>
  )
}

export function MedicineCard() {
  const [medicines, setMedicines] = useState<Medicine[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    medicineService.getFeatured()
      .then(setMedicines)
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
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {medicines.map((medicine) => (
          <Link
            key={medicine.id}
            href={`/medicines/${medicine.slug}`}
            className="group flex flex-col overflow-hidden rounded-2xl border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
          >
            {/* Placeholder image */}
            <div className="relative aspect-[4/3] overflow-hidden bg-muted">
              <MedicinePlaceholder form={medicine.form} />
              <Badge className="absolute right-2 top-2 text-xs">Featured</Badge>
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col gap-1.5 p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-medium text-primary">{medicine.manufacturer}</p>
                <p className="text-xs text-muted-foreground shrink-0">by {(medicine as any).seller?.name}</p>
              </div>
              <h3 className="line-clamp-1 text-base font-semibold text-foreground">{medicine.name}</h3>
              <p className="line-clamp-2 text-sm text-muted-foreground">{medicine.description}</p>

              {/* Rating */}
              <div className="flex items-center gap-1">
                <Star className="size-3.5 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{medicine.rating.toFixed(1)}</span>
                <span className="text-xs text-muted-foreground">({medicine.reviewCount})</span>
              </div>

              <div className="mt-auto flex items-center justify-between border-t pt-3">
                <span className="text-lg font-bold text-primary">
                  ৳{parseFloat(medicine.price).toFixed(2)}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                  <ShoppingCart className="size-3" />
                  Add
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {medicines.length === 0 && (
        <p className="py-12 text-center text-sm text-muted-foreground">No featured medicines found.</p>
      )}

      {/* View All link */}
      <div className="mt-8 flex justify-center">
        <Button asChild variant="outline" className="gap-2">
          <Link href="/medicines">
            View All Medicines
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
