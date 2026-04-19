"use client"

import Link from "next/link"
import {
  ShoppingCart,
  Star,
  Heart,
  Eye,
  Pill,
  FlaskConical,
  Droplets,
  Wind,
  Package,
  Truck,
  PackagePlus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { toast } from "sonner"
import { useState } from "react"
import type { Medicine } from "@/types/medicine"
import { useCartStore } from "@/store/cart.store"
import { authClient } from "@/lib/auth-client"

const BULK_PRESETS = [100, 500, 1000]

// ── Form → icon mapping ───────────────────────────────────
const formIconMap: Record<string, React.ElementType> = {
  Tablet: Pill,
  Capsule: Pill,
  Syrup: FlaskConical,
  Cream: Droplets,
  Drops: Droplets,
  Spray: Wind,
}

// ── Form → gradient color ─────────────────────────────────
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
    <div
      className={`flex size-full items-center justify-center bg-gradient-to-br ${gradient}`}
    >
      <Icon className="size-14 text-primary/40" strokeWidth={1.2} />
    </div>
  )
}

// ─────────────────────────────────────────────────────────
interface ProductCardProps {
  medicine: Medicine
  featured?: boolean
}

const ProductCard = ({ medicine, featured }: ProductCardProps) => {
  const outOfStock = medicine.stock === 0
  const [wishlisted, setWishlisted] = useState(false)
  const [showBulk, setShowBulk] = useState(false)
  const [customQty, setCustomQty] = useState("")
  const addItem = useCartStore((state) => state.addItem)
  const { data: session } = authClient.useSession()
  const isSeller = (session?.user as any)?.role?.toUpperCase() === "SELLER"

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (outOfStock) return
    addItem(medicine)
    toast.success(`${medicine.name} added to cart`, {
      description: `${medicine.form ?? "Item"} — ৳${medicine.price}`,
    })
  }

  const handleBulkOrder = (e: React.MouseEvent, qty: number) => {
    e.preventDefault()
    e.stopPropagation()
    if (outOfStock || qty < 1) return
    addItem(medicine, qty)
    toast.success(`${qty}× ${medicine.name} added to cart`, {
      description: `Bulk order — ৳${(parseFloat(medicine.price) * qty).toFixed(2)} total`,
    })
    setShowBulk(false)
    setCustomQty("")
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setWishlisted((prev) => !prev)
    toast(wishlisted ? "Removed from wishlist" : "Saved to wishlist", {
      icon: wishlisted ? "🤍" : "❤️",
    })
  }

  return (
    <TooltipProvider>
      <Link
        href={`/medicines/${medicine.slug}`}
        className={`group flex flex-col overflow-hidden rounded-2xl border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5 ${featured
          ? "border-primary/30 ring-1 ring-primary/20"
          : "hover:border-primary/30"
          }`}
      >
        {/* ── Image ─────────────────────────────────────── */}
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <MedicinePlaceholder form={medicine.form} />

          {/* Wishlist button — top-left */}
          <button
            onClick={handleWishlist}
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            className="absolute left-2 top-2 flex size-8 items-center justify-center rounded-full border bg-background/80 backdrop-blur transition-all hover:scale-110 hover:bg-background"
          >
            <Heart
              className={`size-4 transition-colors ${wishlisted
                ? "fill-red-500 text-red-500"
                : "text-muted-foreground"
                }`}
            />
          </button>

          {/* Badges — top-right stack */}
          <div className="absolute right-2 top-2 flex flex-col items-end gap-1.5">
            {featured && (
              <Badge variant="default" className="text-xs">
                Featured
              </Badge>
            )}
            {medicine.prescriptionRequired && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge
                    variant="destructive"
                    className="cursor-default text-xs"
                  >
                    Rx
                  </Badge>
                </TooltipTrigger>
                <TooltipContent side="left">
                  Prescription required — consult your doctor before purchase
                </TooltipContent>
              </Tooltip>
            )}
            {outOfStock && (
              <Badge variant="secondary" className="text-xs">
                Out of Stock
              </Badge>
            )}
          </div>
        </div>

        {/* ── Content ───────────────────────────────────── */}
        <div className="flex flex-1 flex-col gap-2 p-4">
          {/* Manufacturer + Seller */}
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-medium text-primary">{medicine.manufacturer}</p>
            <p className="text-xs text-muted-foreground shrink-0"> {medicine.seller.name}</p>
          </div>

          {/* Name */}
          <h3 className="line-clamp-1 text-base font-semibold text-foreground">
            {medicine.name}
          </h3>

          {/* Description */}
          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {medicine.description}
          </p>

          {/* Form + Dosage tags */}
          {(medicine.form || medicine.dosage) && (
            <div className="flex flex-wrap gap-1.5">
              {medicine.form && (
                <span className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                  {medicine.form}
                </span>
              )}
              {medicine.dosage && (
                <span className="line-clamp-1 max-w-[140px] rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                  {medicine.dosage}
                </span>
              )}
            </div>
          )}

          {/* Rating */}
          <div className="flex items-center gap-1.5">
            <Star className="size-3.5 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{medicine.rating.toFixed(1)}</span>
            <span className="text-xs text-muted-foreground">
              ({medicine.reviewCount} reviews)
            </span>
          </div>

          <div className="flex-1" />

          {/* Delivery info */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Truck className="size-3.5 shrink-0 text-primary" />
            <span>2–3 day delivery &bull; Cash on delivery</span>
          </div>

          {/* Price + Actions */}
          <div className="mt-2 flex items-center justify-between border-t pt-3">
            <span className="text-xl font-bold text-primary">
              ৳{medicine.price}
            </span>

            <div className="flex gap-2">
              {/* View Details */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <span
                    className="flex size-8 items-center justify-center rounded-lg border bg-muted transition-colors hover:bg-primary/10 hover:text-primary"
                    onClick={(e) => e.stopPropagation()} // let Link handle navigation
                  >
                    <Eye className="size-4" />
                  </span>
                </TooltipTrigger>
                <TooltipContent>View Details</TooltipContent>
              </Tooltip>

              {/* Bulk Order (seller only) */}
              {isSeller && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5"
                      disabled={outOfStock}
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowBulk((v) => !v) }}
                    >
                      <PackagePlus className="size-3.5" />
                      Bulk
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Bulk Order</TooltipContent>
                </Tooltip>
              )}

              {/* Add to Cart (customers only) */}
              {!isSeller && (
                <Button
                  size="sm"
                  className="gap-1.5"
                  disabled={outOfStock}
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="size-3.5" />
                  {outOfStock ? "Unavailable" : "Add"}
                </Button>
              )}
            </div>
          </div>

          {/* Bulk order presets (seller only) */}
          {isSeller && showBulk && (
            <div
              className="rounded-lg border bg-muted/40 p-3 space-y-2"
              onClick={(e) => { e.preventDefault(); e.stopPropagation() }}
            >
              <p className="text-xs font-semibold text-muted-foreground">Bulk Quantity</p>
              <div className="flex flex-wrap gap-1.5">
                {BULK_PRESETS.map((qty) => (
                  <Button
                    key={qty}
                    size="sm"
                    variant="outline"
                    className="h-7 px-3 text-xs"
                    disabled={outOfStock}
                    onClick={(e) => handleBulkOrder(e, qty)}
                  >
                    {qty}
                  </Button>
                ))}
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex gap-2">
                  <Input
                    type="number"
                    min={100}
                    placeholder="Custom qty (min 100)"
                    value={customQty}
                    onChange={(e) => setCustomQty(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    className="h-7 text-xs"
                  />
                  <Button
                    size="sm"
                    className="h-7 shrink-0 text-xs"
                    disabled={outOfStock || !customQty || parseInt(customQty) < 100}
                    onClick={(e) => handleBulkOrder(e, parseInt(customQty))}
                  >
                    Add
                  </Button>
                </div>
                {customQty && parseInt(customQty) < 100 && (
                  <p className="text-[10px] text-destructive">Minimum bulk order is 100 units</p>
                )}
              </div>
            </div>
          )}

          {/* Low stock warning */}
          {!outOfStock && medicine.stock <= 20 && (
            <p className="text-xs font-medium text-destructive">
              Only {medicine.stock} left in stock — order soon
            </p>
          )}
        </div>
      </Link>
    </TooltipProvider>
  )
}

export default ProductCard
