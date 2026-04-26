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
interface SpecimenProductCardProps {
  medicine: Medicine
  index?: number
}

// ── Component ─────────────────────────────────────────────────────────────────
const SpecimenProductCard = ({ medicine, index = 0 }: SpecimenProductCardProps) => {
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

  // ── Derived display values ────────────────────────────────────────────────
  const words     = medicine.name.split(" ")
  const firstName = words[0]
  const restName  = words.slice(1).join(" ")

  const genus      = firstName
  const species    = medicine.category?.name ?? "organica"
  const commonName = medicine.form?.toUpperCase() ?? "HERB"

  const harvestNum = String(index + 1).padStart(3, "0")
  const sealText   = medicine.keyBadges?.[0]?.toUpperCase().slice(0, 10)
    ?? (medicine.form ? (SEAL_BY_FORM[medicine.form] ?? "WILD CRAFT") : "WILD CRAFT")

  const categoryBadge = medicine.category?.name?.toUpperCase() ?? "BOTANICALS"

  return (
    <Link
      href={`/medicines/${medicine.slug}`}
      className="group relative flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1"
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

      {/* ── Top row: HARVEST № + CATEGORY ──────────────────────────────────── */}
      <div className="relative z-10 flex justify-between items-start mb-1">
        <span
          className="gr-mono"
          style={{ color: "var(--card-number)", fontSize: 10, letterSpacing: "0.12em" }}
        >
          HARVEST № {harvestNum}
        </span>
        <span
          className="gr-mono"
          style={{
            color:        "var(--card-category-label)",
            fontSize:     10,
            letterSpacing:"0.10em",
            paddingRight: 50,
          }}
        >
          · {categoryBadge}
        </span>
      </div>

      {/* ── Rotating seal (top-right corner) ───────────────────────────────── */}
      <div className="absolute z-20" style={{ top: 10, right: 10 }}>
        <svg width="56" height="56" viewBox="0 0 56 56">
          <defs>
            <path
              id={`sp-arc-${medicine.id}`}
              d="M 28,28 m -18,0 a 18,18 0 1,1 36,0 a 18,18 0 1,1 -36,0"
            />
          </defs>
          <circle cx="28" cy="28" r="22" fill="none" stroke="var(--card-seal-outer)" strokeWidth="0.9" />
          <circle cx="28" cy="28" r="19" fill="none" stroke="var(--card-seal-inner)" strokeWidth="0.5" />
          <text
            fontFamily="var(--font-jetbrains-mono), monospace"
            fontSize="5.2"
            letterSpacing="0.17em"
            fill="var(--card-seal-text)"
          >
            <textPath href={`#sp-arc-${medicine.id}`} startOffset="10%">
              {sealText} · GREENROOTS ·
            </textPath>
          </text>
          <circle cx="28" cy="28" r="2.5" fill="var(--card-seal-dot)" />
        </svg>
      </div>

      {/* ── Wishlist ────────────────────────────────────────────────────────── */}
      <button
        onClick={handleWishlist}
        aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        className="absolute z-20 transition-all hover:scale-110"
        style={{ bottom: 58, right: 20 }}
      >
        <Heart
          className={`size-3.5 transition-colors ${
            wishlisted ? "fill-red-400 text-red-400" : "text-muted-foreground opacity-40 hover:opacity-80"
          }`}
        />
      </button>

      {/* ── Jar illustration ────────────────────────────────────────────────── */}
      <div
        className="relative z-10 flex items-center justify-center"
        style={{ minHeight: 160, paddingTop: 8 }}
      >
        <div
          style={{
            width:      110,
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
      <div className="relative z-10 mt-2">
        <h3
          style={{
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontWeight: 500,
            fontSize:   "clamp(22px, 2.2vw, 27px)",
            color:      "var(--card-name-primary)",
            lineHeight: 1.1,
          }}
        >
          {firstName}{" "}
          <em style={{ color: "var(--card-name-secondary)", fontStyle: "italic" }}>
            {restName}
          </em>
        </h3>

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

      {/* ── Rating dots ─────────────────────────────────────────────────────── */}
      {medicine.reviewCount > 0 && (
        <div className="relative z-10 flex items-center gap-1.5 mt-2">
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
          <span className="gr-mono" style={{ color: "var(--card-rating-count)", fontSize: 9 }}>
            ({medicine.reviewCount})
          </span>
        </div>
      )}

      {/* ── Separator rule ───────────────────────────────────────────────────── */}
      <div
        className="relative z-10"
        style={{ height: 1, background: "var(--card-divider)", margin: "12px 0" }}
      />

      {/* ── Bottom row: price · form + add button ────────────────────────────── */}
      <div className="relative z-10 flex items-center justify-between">
        <span
          className="gr-mono"
          style={{ color: "var(--card-number)", fontSize: 12, letterSpacing: "0.06em" }}
        >
          ৳{medicine.price}
          {medicine.form && (
            <span style={{ color: "var(--card-rating-count)", margin: "0 6px" }}>·</span>
          )}
          {medicine.form && (
            <span style={{ color: "var(--card-category-label)" }}>
              {medicine.form.toUpperCase()}
            </span>
          )}
        </span>

        {/* Add / Your listing / (nothing for admin) */}
        {isOwnMedicine ? (
          <span className="gr-mono" style={{ color: "var(--card-listing-label)", fontSize: 9 }}>
            YOUR LISTING
          </span>
        ) : !isAdmin ? (
          <button
            onClick={handleAddToCart}
            disabled={outOfStock}
            className="transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background:    "transparent",
              border:        "1px solid var(--card-btn-border)",
              borderRadius:  "100px",
              padding:       "5px 16px",
              color:         "var(--card-btn-text)",
              fontFamily:    "var(--font-cormorant), Georgia, serif",
              fontSize:      14,
              fontStyle:     "italic",
              letterSpacing: "0.02em",
            }}
            onMouseEnter={(e) => {
              if (outOfStock) return
              const b = e.currentTarget as HTMLButtonElement
              b.style.background  = "var(--card-btn-hover-bg)"
              b.style.borderColor = "var(--card-btn-hover-border)"
              b.style.color       = "var(--card-btn-hover-text)"
            }}
            onMouseLeave={(e) => {
              const b = e.currentTarget as HTMLButtonElement
              b.style.background  = "transparent"
              b.style.borderColor = "var(--card-btn-border)"
              b.style.color       = "var(--card-btn-text)"
            }}
          >
            {outOfStock ? "Unavailable" : "Add →"}
          </button>
        ) : null}
      </div>

      {/* Low stock warning */}
      {!outOfStock && medicine.stock > 0 && medicine.stock <= 10 && (
        <p
          className="relative z-10 gr-mono mt-2"
          style={{ color: "var(--card-low-stock)", fontSize: 9, letterSpacing: "0.1em" }}
        >
          Only {medicine.stock} left in stock
        </p>
      )}
    </Link>
  )
}

export default SpecimenProductCard
