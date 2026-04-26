import Image from "next/image";
import Link from "next/link";
import { JarSVG } from "@/components/icons/botanical";

export interface JarCardProduct {
  id: string;
  slug: string;
  number: string;
  name: string;
  partName: string;
  genus: string;
  species: string;
  commonName: string;
  price: number;
  imageUrl?: string;
  featured?: boolean;
  badge?: string; // e.g. "Spring Harvest", "Limited"
}

export function JarCard({ product }: { product: JarCardProduct }) {
  const { slug, number, name, partName, genus, species, commonName, price, imageUrl, featured, badge } =
    product;

  return (
    <article
      className="relative flex flex-col items-center rounded-2xl transition-all duration-300 hover:-translate-y-1 scroll-snap-align-start shrink-0"
      style={{
        flex: "0 0 clamp(220px, 60vw, 280px)",
        padding: "22px 24px 24px",
        background: featured ? "var(--moss-deep)" : "var(--parchment)",
        border: `1px solid ${featured ? "var(--moss-deep)" : "var(--rule)"}`,
        color: featured ? "var(--cream)" : "var(--ink)",
        boxShadow: "none",
      }}
    >
      {/* Season badge */}
      {badge && (
        <div
          className="absolute -top-3 left-5 px-3 py-1 rounded-full text-xs"
          style={{
            background: "var(--rust)",
            color: "var(--parchment)",
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: 8,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          {badge}
        </div>
      )}

      {/* Top label */}
      <div
        className="flex justify-between items-baseline w-full pb-3 mb-4"
        style={{
          borderBottom: `1px dashed ${featured ? "oklch(0.30 0.05 145)" : "var(--rule)"}`,
        }}
      >
        <span className="gr-mono" style={{ color: featured ? "var(--clay-soft)" : "var(--bark)" }}>
          {number}{featured ? " · featured" : ""}
        </span>
        <span className="gr-mono" style={{ color: featured ? "var(--clay-soft)" : "var(--bark)" }}>
          ৳{price}
        </span>
      </div>

      {/* Product image OR jar SVG */}
      <div className="relative w-28 md:w-36 mb-5" style={{ background: "transparent" }}>
        {imageUrl ? (
          <div className="relative w-28 h-36 md:w-36 md:h-44">
            {/* Jar frame SVG behind image */}
            <JarSVG
              genus={genus}
              species={species}
              commonName={commonName}
              className="absolute inset-0 w-full h-full opacity-20"
              style={{ color: featured ? "var(--cream)" : "var(--ink)" }}
              aria-hidden="true"
            />
            <Image
              src={imageUrl}
              alt={name}
              fill
              className="object-contain rounded-lg"
            />
          </div>
        ) : (
          <JarSVG
            genus={genus}
            species={species}
            commonName={commonName}
            className="w-28 md:w-36"
            style={{ color: featured ? "var(--cream)" : "var(--ink)" }}
          />
        )}
      </div>

      {/* Name */}
      <h4
        className="text-xl md:text-2xl leading-tight mb-0.5 text-center"
        style={{
          fontFamily: "var(--font-cormorant), Georgia, serif",
          fontWeight: 500,
          color: featured ? "var(--cream)" : "var(--ink)",
        }}
      >
        {name}{" "}
        <em
          style={{
            fontStyle: "italic",
            color: featured ? "var(--clay-soft)" : "var(--moss)",
          }}
        >
          {partName}
        </em>
      </h4>
      <p
        className="text-sm mb-4 text-center"
        style={{
          fontFamily: "var(--font-cormorant), Georgia, serif",
          fontStyle: "italic",
          color: featured ? "var(--moss-soft)" : "var(--bark)",
        }}
      >
        {genus} {species}
      </p>

      {/* Add to basket */}
      <Link
        href={`/medicines/${slug}`}
        className="mt-auto rounded-full px-4 py-2 text-xs font-medium transition-all duration-200"
        style={
          featured
            ? {
                border: "1px solid var(--clay)",
                background: "var(--clay)",
                color: "var(--moss-deep)",
              }
            : {
                border: "1px solid var(--ink)",
                background: "transparent",
                color: "var(--ink)",
              }
        }
      >
        Add to basket →
      </Link>
    </article>
  );
}
