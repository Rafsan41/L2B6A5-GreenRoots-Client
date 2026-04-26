import { SVGProps } from "react";

interface JarSVGProps extends SVGProps<SVGSVGElement> {
  genus?: string;       // e.g. "Curcuma"
  species?: string;     // e.g. "longa"
  commonName?: string;  // e.g. "TURMERIC"
}

/**
 * Botanical specimen jar illustration.
 * Pass genus/species/commonName to customise the label.
 */
export function JarSVG({
  genus = "Herba",
  species = "organica",
  commonName = "HERB",
  ...props
}: JarSVGProps) {
  return (
    <svg viewBox="0 0 140 180" fill="none" stroke="currentColor" strokeWidth={1} {...props}>
      {/* Lid */}
      <rect x="52" y="12" width="36" height="14" rx="2" fill="var(--bark-soft)" stroke="none" />
      <rect x="48" y="24" width="44" height="6"  rx="1" />
      {/* Body */}
      <path
        d="M54 30 L 54 54 L 42 70 L 42 166 Q 42 174 52 174 L 88 174 Q 98 174 98 166 L 98 70 L 86 54 L 86 30 Z"
        fill="var(--cream-2)"
      />
      {/* Label area */}
      <rect x="48" y="94" width="44" height="60" fill="var(--parchment)" strokeWidth={0.5} />
      {/* Latin name */}
      <text
        x="70"
        y="112"
        textAnchor="middle"
        fontFamily="var(--font-cormorant), Georgia, serif"
        fontStyle="italic"
        fontSize={11}
        fill="var(--ink)"
        stroke="none"
      >
        {genus}
      </text>
      <text
        x="70"
        y="124"
        textAnchor="middle"
        fontFamily="var(--font-cormorant), Georgia, serif"
        fontStyle="italic"
        fontSize={8}
        fill="var(--ink)"
        stroke="none"
      >
        {species}
      </text>
      {/* Divider */}
      <line x1="54" y1="132" x2="86" y2="132" strokeWidth={0.3} />
      {/* Common name */}
      <text
        x="70"
        y="145"
        textAnchor="middle"
        fontFamily="var(--font-jetbrains-mono), monospace"
        fontSize={6}
        letterSpacing="0.1em"
        fill="var(--bark)"
        stroke="none"
      >
        {commonName}
      </text>
    </svg>
  );
}
