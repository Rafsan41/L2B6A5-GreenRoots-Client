"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Star, ShoppingCart, Heart, Share2, Truck,
  ShieldCheck, RotateCcw, Minus, Plus, FileWarning,
  Pill, FlaskConical, Droplets, Wind, Package,
  Zap, AlertTriangle, MapPin, BoltIcon, PackagePlus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip"
import { toast } from "sonner"
import type { Medicine } from "@/types/medicine"
import { authClient } from "@/lib/auth-client"
import { useCartStore } from "@/store/cart.store"

// ── Form → icon + gradient ────────────────────────────────
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
  const gradient = form ? (formGradientMap[form] ?? "from-primary/15 to-primary/5") : "from-muted to-muted/50"
  return (
    <div className={`flex size-full items-center justify-center bg-gradient-to-br ${gradient}`}>
      <Icon className="size-24 text-primary/30" strokeWidth={1} />
    </div>
  )
}

// ── Delivery estimator cities ─────────────────────────────
const deliveryEstimates: Record<string, string> = {
  dhaka: "Same day – 1 day",
  chittagong: "1–2 days",
  sylhet: "2–3 days",
  rajshahi: "2–3 days",
  khulna: "2–3 days",
  default: "3–5 days",
}

interface DetailHeroProps {
  medicine: Medicine
  category: { name: string; slug: string } | undefined
}

const DetailHero = ({ medicine, category }: DetailHeroProps) => {
  const router = useRouter()
  const { data: session } = authClient.useSession()
  const isLoggedIn = !!session?.user
  const isSeller = (session?.user as any)?.role?.toUpperCase() === "SELLER"
  const addItem = useCartStore((state) => state.addItem)

  const BULK_PRESETS = [100, 500, 1000]
  const [qty, setQty] = useState(1)
  const [bulkQty, setBulkQty] = useState("")
  const [wishlisted, setWishlisted] = useState(false)
  const [city, setCity] = useState("")
  const [deliveryEstimate, setDeliveryEstimate] = useState<string | null>(null)
  const [showStickyBar, setShowStickyBar] = useState(false)

  const ctaRef = useRef<HTMLDivElement>(null)
  const outOfStock = medicine.stock === 0

  // ── Sticky bar on scroll ──────────────────────────────
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setShowStickyBar(!entry.isIntersecting),
      { threshold: 0, rootMargin: "-80px 0px 0px 0px" }
    )
    if (ctaRef.current) observer.observe(ctaRef.current)
    return () => observer.disconnect()
  }, [])

  // ── Auth guard ────────────────────────────────────────
  const authGuard = (action: () => void) => {
    if (!isLoggedIn) {
      toast.error("Please log in to continue", {
        description: "You need an account to add items to cart or place orders.",
        action: { label: "Log In", onClick: () => router.push("/login") },
      })
      return
    }
    action()
  }

  // ── Handlers ──────────────────────────────────────────
  const handleAddToCart = () =>
    authGuard(() => {
      addItem(medicine, qty)
      toast.success(`${medicine.name} added to cart`, {
        description: `${qty} × ${medicine.form ?? "Item"} — ৳${parseFloat(medicine.price) * qty}`,
      })
    })

  const handleBuyNow = () =>
    authGuard(() => {
      addItem(medicine, qty)
      router.push("/cart")
    })

  const handleBulkOrder = (q: number) =>
    authGuard(() => {
      if (q < 1) return
      addItem(medicine, q)
      toast.success(`${q}× ${medicine.name} added to cart`, {
        description: `Bulk order — ৳${(parseFloat(medicine.price) * q).toFixed(2)} total`,
      })
      setBulkQty("")
    })

  const handleWishlist = () => {
    setWishlisted((p) => !p)
    toast(wishlisted ? "Removed from wishlist" : "Saved to wishlist", {
      icon: wishlisted ? "🤍" : "❤️",
    })
  }

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href)
    toast("Link copied to clipboard!")
  }

  const estimateDelivery = () => {
    const key = city.toLowerCase().trim()
    const estimate = deliveryEstimates[key] ?? deliveryEstimates.default
    setDeliveryEstimate(estimate)
  }

  return (
    <TooltipProvider>
      {/* ── Sticky bottom bar ──────────────────────────────── */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 shadow-lg backdrop-blur transition-all duration-300 ${
          showStickyBar ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <MedicinePlaceholder form={medicine.form} />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{medicine.name}</p>
              <p className="text-sm font-bold text-primary">৳{parseFloat(medicine.price) * qty}</p>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            {isSeller ? (
              <Button size="sm" className="gap-1.5" disabled={outOfStock} onClick={() => handleBulkOrder(100)}>
                <PackagePlus className="size-4" />
                Bulk ×100
              </Button>
            ) : (
              <>
                <Button variant="outline" size="sm" className="gap-1.5" disabled={outOfStock} onClick={handleAddToCart}>
                  <ShoppingCart className="size-4" />
                  Add to Cart
                </Button>
                <Button size="sm" className="gap-1.5" disabled={outOfStock} onClick={handleBuyNow}>
                  <Zap className="size-4" />
                  Buy Now
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Safety notice ─────────────────────────────────── */}
      <div className="border-b bg-destructive/5">
        <div className="container mx-auto flex items-center gap-2 px-4 py-2.5 text-sm text-muted-foreground">
          <AlertTriangle className="size-4 shrink-0 text-destructive" />
          <span>
            <strong className="text-foreground">Safety Notice:</strong> Use as
            directed. Consult a qualified doctor if symptoms persist beyond 3
            days or worsen. Keep all medicines out of reach of children.
          </span>
        </div>
      </div>

      <section className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          {/* ── Left: Image + trust ──────────────────────── */}
          <div className="flex flex-col gap-3">
            <div className="relative aspect-square overflow-hidden rounded-2xl border bg-muted">
              <MedicinePlaceholder form={medicine.form} />
              <div className="absolute right-3 top-3 flex flex-col items-end gap-2">
                {medicine.isFeatured && <Badge>Featured</Badge>}
                {medicine.prescriptionRequired && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="destructive" className="cursor-default gap-1">
                        <FileWarning className="size-3" />
                        Rx Required
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent side="left" className="max-w-xs">
                      This medicine requires a valid prescription. Please consult your doctor before purchasing.
                    </TooltipContent>
                  </Tooltip>
                )}
                {outOfStock && <Badge variant="secondary">Out of Stock</Badge>}
              </div>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: ShieldCheck, label: "Genuine Product" },
                { icon: Truck, label: "Fast Delivery" },
                { icon: RotateCcw, label: "Easy Returns" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-1.5 rounded-xl border bg-card p-3 text-center">
                  <Icon className="size-5 text-primary" />
                  <span className="text-xs font-medium text-muted-foreground">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: Product info ──────────────────────── */}
          <div className="flex flex-col gap-5">
            {/* Manufacturer + category */}
            <div className="flex items-center gap-2 text-sm">
              <span className="font-semibold text-primary">{medicine.manufacturer}</span>
              {category && (
                <>
                  <span className="text-muted-foreground">·</span>
                  <span className="text-muted-foreground">{category.name}</span>
                </>
              )}
            </div>

            {/* Name */}
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              {medicine.name}
            </h1>

            {/* Key badges */}
            {medicine.keyBadges.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {medicine.keyBadges.map((badge) => (
                  <span
                    key={badge}
                    className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary"
                  >
                    <BoltIcon className="size-3" />
                    {badge}
                  </span>
                ))}
              </div>
            )}

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`size-4 ${
                      i < Math.floor(medicine.rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground/30"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium">{medicine.rating.toFixed(1)}</span>
              <span className="text-sm text-muted-foreground">
                ({medicine.reviewCount} reviews)
              </span>
            </div>

            <Separator />

            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-primary">৳{medicine.price}</span>
              <span className="text-sm text-muted-foreground">per {medicine.form ?? "unit"}</span>
            </div>

            {/* Badges row */}
            <div className="flex flex-wrap gap-2">
              {medicine.form && <Badge variant="secondary">{medicine.form}</Badge>}
              {medicine.dosage && <Badge variant="outline">{medicine.dosage}</Badge>}
              {medicine.prescriptionRequired && (
                <Badge variant="destructive" className="gap-1">
                  <FileWarning className="size-3" />
                  Prescription Required
                </Badge>
              )}
            </div>

            {/* Stock status */}
            <div className="text-sm">
              {outOfStock ? (
                <span className="font-semibold text-destructive">
                  ✗ Out of stock — check back later
                </span>
              ) : medicine.stock <= 20 ? (
                <span className="font-semibold text-orange-500">
                  ⚠ Only {medicine.stock} left in stock — order soon
                </span>
              ) : (
                <span className="font-semibold text-primary">
                  ✓ In stock ({medicine.stock} units available)
                </span>
              )}
            </div>

            <Separator />

            {/* Quantity selector (customers only) */}
            {!outOfStock && !isSeller && (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">Quantity</span>
                <div className="flex items-center gap-1 rounded-lg border p-1">
                  <Button
                    variant="ghost" size="icon" className="size-8"
                    disabled={qty <= 1}
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                  >
                    <Minus className="size-3.5" />
                  </Button>
                  <span className="min-w-8 text-center text-sm font-semibold">{qty}</span>
                  <Button
                    variant="ghost" size="icon" className="size-8"
                    disabled={qty >= medicine.stock}
                    onClick={() => setQty((q) => Math.min(medicine.stock, q + 1))}
                  >
                    <Plus className="size-3.5" />
                  </Button>
                </div>
                <span className="text-sm text-muted-foreground">
                  Total:{" "}
                  <strong className="text-foreground">৳{parseFloat(medicine.price) * qty}</strong>
                </span>
              </div>
            )}

            {/* CTA row — observed for sticky bar */}
            <div ref={ctaRef} className="flex flex-col gap-3 sm:flex-row">
              {isSeller ? (
                /* Seller: bulk order presets */
                <div className="flex-1 space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                    <PackagePlus className="size-3.5 text-primary" />
                    Bulk Order Quantity
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {BULK_PRESETS.map((q) => (
                      <Button key={q} size="lg" variant="outline" className="gap-1.5" disabled={outOfStock} onClick={() => handleBulkOrder(q)}>
                        <PackagePlus className="size-4" />×{q}
                      </Button>
                    ))}
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex gap-2">
                      <Input
                        type="number" min={100} placeholder="Custom qty (min 100)"
                        value={bulkQty} onChange={(e) => setBulkQty(e.target.value)}
                        className="h-10 text-sm"
                      />
                      <Button size="lg" disabled={outOfStock || !bulkQty || parseInt(bulkQty) < 100} onClick={() => handleBulkOrder(parseInt(bulkQty))}>
                        Order
                      </Button>
                    </div>
                    {bulkQty && parseInt(bulkQty) < 100 && (
                      <p className="text-xs text-destructive">Minimum bulk order is 100 units</p>
                    )}
                  </div>
                </div>
              ) : (
                /* Customer: Add to Cart + Buy Now */
                <>
                  <Button size="lg" className="flex-1 gap-2" disabled={outOfStock} onClick={handleAddToCart}>
                    <ShoppingCart className="size-5" />
                    {outOfStock ? "Out of Stock" : "Add to Cart"}
                  </Button>
                  <Button size="lg" variant="secondary" className="flex-1 gap-2" disabled={outOfStock} onClick={handleBuyNow}>
                    <Zap className="size-5" />
                    Buy Now
                  </Button>
                </>
              )}
              <Button size="lg" variant="outline" className="gap-2" onClick={handleWishlist}>
                <Heart className={`size-5 ${wishlisted ? "fill-red-500 text-red-500" : ""}`} />
                {wishlisted ? "Saved" : "Wishlist"}
              </Button>
              <Button size="icon" variant="outline" className="size-11 shrink-0" onClick={handleShare}>
                <Share2 className="size-4" />
              </Button>
            </div>

            {/* Delivery info */}
            <div className="space-y-3 rounded-xl border bg-muted/30 p-4">
              <div className="flex items-center gap-2 text-sm">
                <Truck className="size-4 shrink-0 text-primary" />
                <span className="text-muted-foreground">
                  <strong className="text-foreground">2–3 day delivery</strong> to
                  Dhaka &amp; major cities
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <ShieldCheck className="size-4 shrink-0 text-primary" />
                <span className="text-muted-foreground">
                  <strong className="text-foreground">Cash on delivery</strong> available
                  nationwide
                </span>
              </div>

              {/* Delivery estimator */}
              <Separator />
              <div className="space-y-2">
                <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <MapPin className="size-3.5 text-primary" />
                  Check delivery time for your city
                </p>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter city (e.g. Dhaka)"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && estimateDelivery()}
                    className="h-8 text-sm"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 shrink-0"
                    onClick={estimateDelivery}
                  >
                    Check
                  </Button>
                </div>
                {deliveryEstimate && (
                  <p className="text-sm font-medium text-primary">
                    📦 Estimated delivery: <strong>{deliveryEstimate}</strong>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </TooltipProvider>
  )
}

export default DetailHero
