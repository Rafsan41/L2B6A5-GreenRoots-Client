import { SVGProps } from "react";

export function LeafSVG(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 40 60" fill="currentColor" {...props}>
      <path
        d="M20 2 Q 36 18 34 38 Q 30 54 20 58 Q 10 54 6 38 Q 4 18 20 2 Z"
        opacity={0.35}
      />
      <path
        d="M20 6 L 20 54"
        stroke="currentColor"
        strokeWidth={0.6}
        fill="none"
        opacity={0.6}
      />
    </svg>
  );
}
