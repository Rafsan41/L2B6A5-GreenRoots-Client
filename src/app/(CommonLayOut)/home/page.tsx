import { DriftingLeaves }        from "@/components/home/DriftingLeaves";
import { SplitHero }             from "@/components/home/SplitHero";
import { VineDivider }           from "@/components/home/VineDivider";
import { MarqueeBanner }         from "@/components/home/MarqueeBanner";
import { TrustBar }              from "@/components/home/TrustBar";
import { BentoCategories }       from "@/components/home/BentoCategories";
import { ProductShelf }          from "@/components/home/ProductShelf";
import { FEATURED_PRODUCTS }     from "@/components/home/ProductShelf";
import type { JarCardProduct }   from "@/components/home/JarCard";
import { ZigzagProcess }         from "@/components/home/ZigzagProcess";
import { FieldToJar }            from "@/components/home/FieldToJar";
import { MagazineTestimonials }  from "@/components/home/MagazineTestimonials";
import { FaqSection }            from "@/components/home/FaqSection";
import { HerbLetter }            from "@/components/home/HerbLetter";
import { SideBySideCTA }         from "@/components/home/SideBySideCTA";
import type { Medicine }         from "@/types/medicine";

// ── Known plant-part suffixes ──────────────────────────────────────────────────
const PLANT_PARTS = ["Root", "Leaf", "Flower", "Seed", "Bark", "Berry", "Herb", "Bulb", "Resin", "Rhizome", "Fruit", "Extract"]

function parseName(fullName: string): { name: string; partName: string } {
  for (const part of PLANT_PARTS) {
    if (fullName.endsWith(" " + part)) {
      return { name: fullName.slice(0, -(part.length + 1)), partName: part }
    }
  }
  return { name: fullName, partName: "" }
}

function toJarCard(m: Medicine, index: number): JarCardProduct {
  const { name, partName } = parseName(m.name)
  // Use category name as genus-level label, manufacturer as species-level label
  const genus   = m.category?.name  ?? name
  const species = m.manufacturer?.split(" ")[0]?.toLowerCase() ?? "sp."

  return {
    id:         m.id,
    slug:       m.slug,
    number:     `№ ${String(index + 1).padStart(3, "0")}`,
    name,
    partName,
    genus,
    species,
    commonName: name.toUpperCase(),
    price:      parseFloat(m.price),
    imageUrl:   m.image ?? undefined,
    featured:   m.isFeatured,
    badge:      m.keyBadges?.[0] ?? undefined,
  }
}

async function getShelfProducts(): Promise<JarCardProduct[]> {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:5000"
    const res = await fetch(
      `${backendUrl}/api/medicines?limit=4`,
      { next: { revalidate: 300 } }   // re-fetch every 5 min
    )
    if (!res.ok) return FEATURED_PRODUCTS
    const json = await res.json()
    const medicines: Medicine[] = (json?.data?.medicines ?? []).filter((m: Medicine) => m.isActive).slice(0, 4)
    if (!medicines.length) return FEATURED_PRODUCTS
    return medicines.map(toJarCard)
  } catch {
    return FEATURED_PRODUCTS   // fallback to static if backend is down
  }
}

export default async function HomePage() {
  const shelfProducts = await getShelfProducts()

  return (
    <>
      {/* Fixed drifting leaf layer (behind everything, pointer-events:none) */}
      <DriftingLeaves />

      {/* ① Split hero — dark moss left + specimen cards right */}
      <SplitHero />

      {/* ② Vine divider */}
      <VineDivider />

      {/* ③ Scrolling marquee strip */}
      <MarqueeBanner />

      {/* ③b Trust bar */}
      <TrustBar />

      {/* ④ Bento category grid */}
      <div data-reveal data-reveal-y="50"><BentoCategories /></div>

      {/* ⑤ Horizontal herb shelf — live data, limit 4 */}
      <div data-reveal data-reveal-y="40" data-reveal-delay="0.05"><ProductShelf products={shelfProducts} /></div>

      {/* ⑥ Vine divider (reversed) */}
      <VineDivider reversed />

      {/* ⑦ How it works — zigzag 4-step process */}
      <div data-reveal data-reveal-y="50"><ZigzagProcess /></div>

      {/* ⑧ From field to jar — sourcing transparency */}
      <div data-reveal data-reveal-y="40"><FieldToJar /></div>

      {/* ⑨ Magazine testimonials — pull quote layout */}
      <div data-reveal data-reveal-y="40"><MagazineTestimonials /></div>

      {/* ⑨b FAQ */}
      <div data-reveal data-reveal-y="40"><FaqSection /></div>

      {/* ⑩ The Herb Letter — newsletter section */}
      <div data-reveal data-reveal-y="30"><HerbLetter /></div>

      {/* ⑪ Side-by-side CTA — botanical + dark moss */}
      <div data-reveal data-reveal-y="30"><SideBySideCTA /></div>
    </>
  );
}
