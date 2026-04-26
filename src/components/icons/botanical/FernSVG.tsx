import { SVGProps } from "react";

/** Full-height decorative fern — used in hero left panel and shelf section */
export function FernSVG(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 200 600" fill="none" stroke="currentColor" {...props}>
      <path d="M100 600 Q 100 400 90 200 Q 85 80 100 10" strokeWidth={0.8} />
      <g strokeWidth={0.5}>
        <path d="M95 40 Q 80 50 72 46 M95 40 Q 110 50 118 46" />
        <path d="M92 80 Q 72 92 60 86 M92 80 Q 112 92 124 86" />
        <path d="M90 125 Q 66 138 50 128 M90 125 Q 114 138 130 128" />
        <path d="M88 175 Q 60 188 42 174 M88 175 Q 116 188 134 174" />
        <path d="M88 225 Q 58 238 38 220 M88 225 Q 118 238 138 220" />
        <path d="M90 280 Q 60 292 40 272 M90 280 Q 120 292 140 272" />
        <path d="M92 335 Q 64 348 44 328 M92 335 Q 120 348 140 328" />
        <path d="M94 390 Q 68 403 50 384 M94 390 Q 120 403 138 384" />
        <path d="M96 450 Q 74 462 58 446 M96 450 Q 118 462 134 446" />
        <path d="M98 510 Q 80 520 68 508 M98 510 Q 116 520 128 508" />
      </g>
    </svg>
  );
}

/** Compact side-fern for section decorations */
export function SideFernSVG(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 240 480" fill="none" stroke="currentColor" {...props}>
      <path d="M120 480 Q 120 300 110 160 Q 105 70 120 10" strokeWidth={0.7} />
      <g strokeWidth={0.5}>
        <path d="M115 60 Q 90 74 76 66 M115 60 Q 140 74 154 66" />
        <path d="M112 110 Q 80 124 60 112 M112 110 Q 144 124 164 112" />
        <path d="M110 170 Q 76 184 50 170 M110 170 Q 144 184 170 170" />
        <path d="M112 240 Q 76 254 48 236 M112 240 Q 148 254 176 236" />
        <path d="M114 310 Q 80 324 54 306 M114 310 Q 148 324 174 306" />
        <path d="M116 380 Q 86 394 64 378 M116 380 Q 146 394 168 378" />
      </g>
    </svg>
  );
}
