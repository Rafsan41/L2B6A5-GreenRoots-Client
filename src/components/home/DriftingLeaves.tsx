"use client";

import { LeafSVG } from "@/components/icons/botanical";

/**
 * Fixed full-page drifting leaf layer.
 * Sits at z-index 1, pointer-events:none — purely decorative.
 * Only rendered on the public home page (via ClientOnly wrapper).
 */
export function DriftingLeaves() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 1 }}
    >
      {/* Leaf 1 — moss-mid, top-left */}
      <LeafSVG
        className="absolute animate-drift-1"
        style={{
          top: "6%",
          left: "8%",
          width: 36,
          height: 54,
          color: "var(--moss-mid)",
          filter: "drop-shadow(0 2px 1px oklch(0 0 0 / 0.04))",
        }}
      />

      {/* Leaf 2 — moss, top-right */}
      <LeafSVG
        className="absolute animate-drift-2"
        style={{
          top: "18%",
          right: "6%",
          width: 30,
          height: 46,
          color: "var(--moss)",
          transform: "rotate(-22deg)",
          filter: "drop-shadow(0 2px 1px oklch(0 0 0 / 0.04))",
        }}
      />

      {/* Leaf 3 — clay/amber, mid-left */}
      <LeafSVG
        className="absolute animate-drift-3"
        style={{
          top: "54%",
          left: "3%",
          width: 28,
          height: 42,
          color: "var(--clay)",
          transform: "rotate(40deg)",
          opacity: 0.7,
          filter: "drop-shadow(0 2px 1px oklch(0 0 0 / 0.04))",
        }}
      />

      {/* Leaf 4 — moss-mid, bottom-right */}
      <LeafSVG
        className="absolute animate-drift-4"
        style={{
          bottom: "14%",
          right: "9%",
          width: 42,
          height: 62,
          color: "var(--moss-mid)",
          transform: "rotate(-10deg)",
          filter: "drop-shadow(0 2px 1px oklch(0 0 0 / 0.04))",
        }}
      />

      {/* Leaf 5 — sage, center */}
      <LeafSVG
        className="absolute animate-drift-5"
        style={{
          bottom: "34%",
          left: "48%",
          width: 24,
          height: 36,
          color: "var(--sage)",
          transform: "rotate(70deg)",
          opacity: 0.8,
          filter: "drop-shadow(0 2px 1px oklch(0 0 0 / 0.04))",
        }}
      />
    </div>
  );
}
