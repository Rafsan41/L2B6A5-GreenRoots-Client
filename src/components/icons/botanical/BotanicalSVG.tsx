import { SVGProps } from "react";

/**
 * Large central botanical illustration — used in SideBySideCTA left panel.
 * Depicts a flowering herb plant with branching leaves.
 */
export function BotanicalSVG(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 500 500" fill="none" stroke="currentColor" strokeWidth={0.7} {...props}>
      {/* Main stem */}
      <path d="M250 500 L 250 80" />
      {/* Branches */}
      <path d="M250 140 Q 180 120 130 90 Q 100 70 80 40" />
      <path d="M250 180 Q 320 160 370 130 Q 400 110 420 80" />
      <path d="M250 230 Q 180 210 130 180" />
      <path d="M250 270 Q 320 250 370 220" />
      {/* Leaf clusters */}
      <ellipse cx="150" cy="110" rx="24" ry="10" transform="rotate(-25 150 110)" />
      <ellipse cx="100" cy="75"  rx="20" ry="9"  transform="rotate(-40 100 75)" />
      <ellipse cx="350" cy="150" rx="24" ry="10" transform="rotate(25 350 150)" />
      <ellipse cx="400" cy="115" rx="20" ry="9"  transform="rotate(40 400 115)" />
      <ellipse cx="150" cy="200" rx="22" ry="9"  transform="rotate(-30 150 200)" />
      <ellipse cx="350" cy="240" rx="22" ry="9"  transform="rotate(30 350 240)" />
      {/* Flower crown */}
      <circle cx="250" cy="75"  r="12" />
      <ellipse cx="250" cy="52"  rx="10" ry="16" />
      <ellipse cx="250" cy="98"  rx="10" ry="16" />
      <ellipse cx="227" cy="75"  rx="16" ry="10" />
      <ellipse cx="273" cy="75"  rx="16" ry="10" />
      {/* Root spread */}
      <path d="M250 380 Q 210 400 150 410" />
      <path d="M250 380 Q 290 400 350 410" />
      <path d="M250 420 Q 210 445 155 460" />
      <path d="M250 420 Q 290 445 345 460" />
    </svg>
  );
}

/**
 * GreenRoots logo plant icon — sprout with roots
 */
export function LogoPlantSVG(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.2}
      {...props}
    >
      <path d="M16 4 C 16 4, 12 8, 12 13 C 12 17, 14 19, 16 19 C 18 19, 20 17, 20 13 C 20 8, 16 4, 16 4 Z" />
      <path d="M16 19 L 16 28" />
      <path d="M12 22 C 9 22, 8 24, 8 26" />
      <path d="M20 22 C 23 22, 24 24, 24 26" />
    </svg>
  );
}

/**
 * Small bento category icons
 */
export function AdaptogenIconSVG(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 60 60" fill="none" stroke="currentColor" strokeWidth={1} {...props}>
      <path d="M30 50 L 30 15" />
      <path d="M30 22 Q 20 20 14 12" />
      <path d="M30 28 Q 40 26 46 18" />
      <path d="M30 34 Q 20 32 14 24" />
      <path d="M30 40 Q 40 38 46 30" />
    </svg>
  );
}

export function SkinIconSVG(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 60 60" fill="none" stroke="currentColor" strokeWidth={1} {...props}>
      <path d="M30 15 Q 18 29 18 40 Q 18 50 30 50 Q 42 50 42 40 Q 42 29 30 15 Z" />
    </svg>
  );
}

export function DigestiveIconSVG(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 60 60" fill="none" stroke="currentColor" strokeWidth={1} {...props}>
      <path d="M30 15 L 30 48" />
      <ellipse cx="22" cy="22" rx="5" ry="8" transform="rotate(-25 22 22)" />
      <ellipse cx="38" cy="22" rx="5" ry="8" transform="rotate(25 38 22)" />
      <ellipse cx="18" cy="34" rx="6" ry="9" transform="rotate(-30 18 34)" />
      <ellipse cx="42" cy="34" rx="6" ry="9" transform="rotate(30 42 34)" />
    </svg>
  );
}

export function VitaminIconSVG(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 60 60" fill="none" stroke="currentColor" strokeWidth={1} {...props}>
      <circle cx="30" cy="30" r="5" />
      <ellipse cx="30" cy="16" rx="5" ry="9" />
      <ellipse cx="30" cy="44" rx="5" ry="9" />
      <ellipse cx="16" cy="30" rx="9" ry="5" />
      <ellipse cx="44" cy="30" rx="9" ry="5" />
    </svg>
  );
}

export function ImmunityIconSVG(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 60 60" fill="none" stroke="currentColor" strokeWidth={1} {...props}>
      <path d="M30 12 Q 18 18 16 30 Q 14 42 30 50 Q 46 42 44 30 Q 42 18 30 12 Z" />
      <path d="M30 22 L 30 38 M 22 30 L 38 30" strokeWidth={1.2} />
    </svg>
  );
}

export function SleepIconSVG(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 60 60" fill="none" stroke="currentColor" strokeWidth={1} {...props}>
      <path d="M38 14 A 16 16 0 1 1 14 38 A 12 12 0 0 0 38 14 Z" />
      <path d="M22 20 L 26 20 L 20 28 L 26 28" strokeWidth={0.9} />
    </svg>
  );
}
