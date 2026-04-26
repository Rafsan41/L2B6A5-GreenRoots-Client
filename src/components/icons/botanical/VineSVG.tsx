import { SVGProps } from "react";

/** Corner vine decoration — place in hero top-left */
export function CornerVineSVG(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      stroke="currentColor"
      strokeWidth={1}
      {...props}
    >
      <path d="M0 40 Q 40 50 60 80 Q 75 105 90 140 Q 100 170 110 200" />
      <ellipse cx="54"  cy="72"  rx="14" ry="7"  transform="rotate(-35 54 72)" />
      <ellipse cx="78"  cy="108" rx="15" ry="7"  transform="rotate(-20 78 108)" />
      <ellipse cx="96"  cy="150" rx="14" ry="7"  transform="rotate(-10 96 150)" />
      <ellipse cx="32"  cy="48"  rx="10" ry="5"  transform="rotate(-50 32 48)" />
    </svg>
  );
}

/** Side vine — right side of zigzag / method section */
export function SideVineSVG(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 280 420"
      fill="none"
      stroke="currentColor"
      strokeWidth={0.7}
      {...props}
    >
      <path d="M280 20 Q 200 60 160 140 Q 130 210 140 300 Q 150 370 200 410" />
      <ellipse cx="200" cy="80"  rx="18" ry="9" transform="rotate(35 200 80)" />
      <ellipse cx="150" cy="180" rx="18" ry="9" transform="rotate(-25 150 180)" />
      <ellipse cx="140" cy="260" rx="18" ry="9" transform="rotate(25 140 260)" />
      <ellipse cx="170" cy="350" rx="18" ry="9" transform="rotate(-15 170 350)" />
      <circle cx="240" cy="50"  r="4" />
      <circle cx="175" cy="120" r="3" />
    </svg>
  );
}

/** Organic blob — subtle section background */
export function OrganicBlobSVG(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 400 300" fill="currentColor" {...props}>
      <path
        d="M200 30 Q 340 40 360 140 Q 370 230 270 270 Q 170 290 90 240 Q 30 190 50 100 Q 80 20 200 30 Z"
        opacity={0.4}
      />
    </svg>
  );
}
