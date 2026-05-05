"use client"

import Link from "next/link"
import { Heart, Star } from "lucide-react"
import { toast } from "sonner"
import { useState } from "react"
import type { Medicine } from "@/types/medicine"
import { useCartStore } from "@/store/cart.store"
import { authClient } from "@/lib/auth-client"
import { JarSVG } from "@/components/icons/botanical/JarSVG"

// ── Seal text by form ─────────────────────────────────────────────────────────
const SEAL_BY_FORM: Record<string, string> = {
  Oil:     "COLD PRESS",
  Powder:  "SUN DRIED",
  Capsule: "RAW EXTRACT",
  Tablet:  "PURE HERB",
  Syrup:   "WILD BERRY",
  Drops:   "COLD PRESS",
  Cream:   "HAND BLEND",
  Spray:   "WILD CRAFT",
}

// ── Props ─────────────────────────────────────────────────────────────────────
interface ProductCardProps {
  medicine: Medicine
  index?: number
  featured?: boolean
}

// ── Component ─────────────────────────────────────────────────────────────────
const ProductCard = ({ medicine, index = 0, featured }: ProductCardProps) => {
  const outOfStock  = medicine.stock === 0
  const [wishlisted, setWishlisted] = useState(false)

  const addItem = useCartStore((s) => s.addItem)
  const { data: session } = authClient.useSession()
  const role          = (session?.user as any)?.role?.toUpperCase()
  const isSeller      = role === "SELLER"
  const isAdmin       = role === "ADMIN"
  const isOwnMedicine = isSeller && (session?.user as any)?.id === medicine.sellerId

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation()
    if (outOfStock) return
    addItem(medicine)
    toast.success(`${medicine.name} added to basket`, {
      description: `${medicine.form ?? "Item"} · ৳${medicine.price}`,
    })
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation()
    setWishlisted((v) => !v)
    toast(wishlisted ? "Removed from wishlist" : "Saved to wishlist", {
      icon: wishlisted ? "🤍" : "❤️",
    })
  }

  // ── Name split ───────────────────────────────────────────────────────────────
  const words     = medicine.name.split(" ")
  const firstName = words[0]
  const restName  = words.slice(1).join(" ")

  // ── Jar label ────────────────────────────────────────────────────────────────
  const genus      = firstName
  const species    = medicine.category?.name ?? "organica"
  const commonName = medicine.form?.toUpperCase() ?? "HERB"

  // ── Catalog number ───────────────────────────────────────────────────────────
  const catalogNum = String(index + 1).padStart(3, "0")

  // ── Seal text ────────────────────────────────────────────────────────────────
  const sealText = medicine.form ? (SEAL_BY_FORM[medicine.form] ?? "WILD CRAFT") : "WILD CRAFT"

  return (
    <Link
      href={`/medicines/${medicine.slug}`}
      className="group relative flex h-full flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1"
      style={{
        background:   "var(--card-surface)",
        border:       "1px solid var(--card-border-color)",
        borderRadius: "12px",
        padding:      "20px 20px 18px",
        boxShadow:    "var(--card-box-shadow)",
      }}
    >
      {/* Inner ruled border */}
      <div
        className="absolute pointer-events-none"
        style={{
          inset: 7, borderRadius: 7,
          border: "1px solid var(--card-inner-border)",
        }}
      />

      {/* Dot texture */}
      <div
        className="absolute inset-0 pointer-events-none rounded-xl"
        style={{
          backgroundImage: "radial-gradient(circle, var(--card-dot-fill) 1px, transparent 1px)",
          backgroundSize:  "22px 22px",
          opacity:         0.3,
        }}
      />

      {/* ── Top row: № + origin pill + price ──────────────────────────────── */}
      <div className="relative z-10 flex justify-between items-center mb-3">
        <span
          className="gr-mono"
          style={{ color: "var(--card-number)", fontSize: 11, letterSpacing: "0.12em" }}
        >
          № {catalogNum}
        </span>
        <div className="flex items-center gap-2">
          {medicine.manufacturer && (
            <span
              className="gr-mono"
              style={{
                fontSize:      9,
                fontWeight:    800,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color:         "var(--honey-deep)",
                background:    "oklch(0.83 0.17 89 / 0.14)",
                border:        "1px solid oklch(0.83 0.17 89 / 0.35)",
                borderRadius:  9999,
                padding:       "2px 8px",
              }}
            >
              {medicine.manufacturer.split(" ")[0]}
            </span>
          )}
          <span
            className="gr-mono"
            style={{ color: "var(--card-price)", fontSize: 11, letterSpacing: "0.06em" }}
          >
            ৳{medicine.price}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div
        className="relative z-10"
        style={{ height: 1, background: "var(--card-divider)", marginBottom: 18 }}
      />

      {/* ── Wishlist ────────────────────────────────────────────────────────── */}
      <button
        onClick={handleWishlist}
        aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        className="absolute z-20 transition-all hover:scale-110"
        style={{ top: 46, right: 16 }}
      >
        <Heart
          className={`size-3.5 transition-colors ${
            wishlisted ? "fill-red-400 text-red-400" : "text-muted-foreground opacity-40 hover:opacity-80"
          }`}
        />
      </button>

      {/* ── Rotating seal (top-right) ───────────────────────────────────────── */}
      <div className="absolute z-20" style={{ top: 10, right: 10 }}>
        <svg width="52" height="52" viewBox="0 0 52 52">
          <defs>
            <path
              id={`pc-arc-${medicine.id}`}
              d="M 26,26 m -17,0 a 17,17 0 1,1 34,0 a 17,17 0 1,1 -34,0"
            />
          </defs>
          <circle cx="26" cy="26" r="21" fill="none" stroke="var(--card-seal-outer)" strokeWidth="0.8" />
          <circle cx="26" cy="26" r="18" fill="none" stroke="var(--card-seal-inner)" strokeWidth="0.5" />
          <text
            fontFamily="var(--font-jetbrains-mono), monospace"
            fontSize="5"
            letterSpacing="0.18em"
            fill="var(--card-seal-text)"
          >
            <textPath href={`#pc-arc-${medicine.id}`} startOffset="5%">
              {sealText} · GREENROOTS ·
            </textPath>
          </text>
          <circle cx="26" cy="26" r="2.2" fill="var(--card-seal-dot)" />
        </svg>
      </div>

      {/* ── Jar illustration ────────────────────────────────────────────────── */}
      <div
        className="relative z-10 flex items-center justify-center"
        style={{ minHeight: 148 }}
      >
        <div
          style={{
            width:      104,
            color:      "var(--card-jar-tint)",
            filter:     "var(--card-jar-drop-shadow)",
            transition: "transform 0.4s ease",
          }}
          className="group-hover:scale-105"
        >
          <JarSVG genus={genus} species={species} commonName={commonName} />
        </div>

        {/* Out-of-stock scrim */}
        {outOfStock && (
          <div
            className="absolute inset-0 flex items-center justify-center rounded"
            style={{ background: "var(--card-scrim)" }}
          >
            <span
              className="gr-mono"
              style={{ color: "var(--card-scrim-text)", fontSize: 9, letterSpacing: "0.18em" }}
            >
              OUT OF STOCK
            </span>
          </div>
        )}
      </div>

      {/* ── Name ────────────────────────────────────────────────────────────── */}
      <div className="relative z-10 text-center mt-2 mb-1">
        <h3
          style={{
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontWeight: 500,
            fontSize:   "clamp(21px, 2vw, 25px)",
            color:      "var(--card-name-primary)",
            lineHeight: 1.15,
          }}
        >
          {firstName}{" "}
          <em style={{ color: "var(--card-name-secondary)", fontStyle: "italic" }}>
            {restName}
          </em>
        </h3>

        {/* Manufacturer as italic subtitle */}
        <p
          style={{
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontStyle:  "italic",
            fontSize:   13,
            color:      "var(--card-subtitle)",
            marginTop:  3,
          }}
        >
          {medicine.manufacturer}
        </p>
      </div>

      {/* ── Rating ──────────────────────────────────────────────────────────── */}
      {medicine.reviewCount > 0 && (
        <div className="relative z-10 flex items-center justify-center gap-1.5 mt-2 mb-1">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              className="size-3"
              style={{
                fill:  s <= Math.round(medicine.rating) ? "var(--card-rating-on)" : "transparent",
                color: s <= Math.round(medicine.rating) ? "var(--card-rating-on)" : "var(--card-rating-off)",
              }}
            />
          ))}
          <span
            className="gr-mono"
            style={{ color: "var(--card-rating-count)", fontSize: 9, marginLeft: 2 }}
          >
            ({medicine.reviewCount})
          </span>
        </div>
      )}

      {/* Push button to bottom */}
      <div className="flex-1" />

      {/* ── Separator ───────────────────────────────────────────────────────── */}
      <div
        className="relative z-10"
        style={{ height: 1, background: "var(--card-divider)", margin: "14px 0" }}
      />

      {/* ── Add to basket ───────────────────────────────────────────────────── */}
      {isOwnMedicine ? (
        <div className="relative z-10 text-center">
          <span
            className="gr-mono"
            style={{ color: "var(--card-listing-label)", fontSize: 9, letterSpacing: "0.15em" }}
          >
            YOUR LISTING
          </span>
        </div>
      ) : isAdmin ? null : (
        <button
          onClick={handleAddToCart}
          disabled={outOfStock}
          className="relative z-10 w-full transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40 hover:scale-[1.02] active:scale-[0.98]"
          style={{
            background:    outOfStock
              ? "oklch(0.60 0.19 40 / 0.08)"
              : "var(--cta)",
            border:        outOfStock
              ? "1px solid var(--card-btn-border)"
              : "1px solid transparent",
            borderRadius:  "100px",
            padding:       "9px 20px",
            color:         outOfStock ? "var(--card-btn-text)" : "#fff",
            fontFamily:    "var(--font-cormorant), Georgia, serif",
            fontSize:      15,
            fontStyle:     "italic",
            letterSpacing: "0.02em",
            cursor:        outOfStock ? "not-allowed" : "pointer",
            boxShadow:     outOfStock ? "none" : "0 6px 16px -6px rgba(255,111,60,0.50)",
          }}
        >
          {outOfStock ? "Out of stock" : "Add to basket →"}
        </button>
      )}

      {/* Featured badge */}
      {featured && (
        <div className="absolute z-20" style={{ top: 10, left: 10 }}>
          <span
            className="gr-mono"
            style={{
              background:    "var(--clay)",
              color:         "oklch(0.98 0.01 90)",
              borderRadius:  "2px",
              padding:       "2px 8px",
              fontSize:      9,
              letterSpacing: "0.12em",
            }}
          >
            FEATURED
          </span>
        </div>
      )}

      {/* Low stock warning */}
      {!outOfStock && medicine.stock > 0 && medicine.stock <= 10 && (
        <p
          className="relative z-10 text-center mt-2 gr-mono"
          style={{ color: "var(--card-low-stock)", fontSize: 9, letterSpacing: "0.1em" }}
        >
          Only {medicine.stock} left
        </p>
      )}
    </Link>
  )
}

export default ProductCard
