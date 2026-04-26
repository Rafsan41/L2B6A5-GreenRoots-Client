interface VineDividerProps {
  /** Flip the wave direction */
  reversed?: boolean;
  className?: string;
}

/**
 * Full-width wavy vine SVG divider with leaf accents.
 * Use between major sections.
 */
export function VineDivider({ reversed = false, className = "" }: VineDividerProps) {
  return (
    <div
      aria-hidden="true"
      className={`relative py-2 overflow-hidden ${className}`}
      style={{ color: "var(--moss-mid)" }}
    >
      {/* Wave path */}
      <svg
        viewBox="0 0 1440 80"
        fill="none"
        stroke="currentColor"
        strokeWidth={1}
        preserveAspectRatio="none"
        className="w-full h-16 block"
        style={reversed ? { transform: "scaleX(-1)" } : undefined}
      >
        <path d="M0 40 Q 180 10, 360 40 T 720 40 T 1080 40 T 1440 40" />
      </svg>

      {/* Leaf + dot accents */}
      <svg
        viewBox="0 0 1440 80"
        fill="none"
        stroke="currentColor"
        strokeWidth={1}
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ color: "var(--moss)", top: 8 }}
      >
        <ellipse cx="180"  cy="22" rx="12" ry="5" transform="rotate(-35 180 22)"  />
        <ellipse cx="540"  cy="58" rx="12" ry="5" transform="rotate(35 540 58)"   />
        <ellipse cx="900"  cy="22" rx="12" ry="5" transform="rotate(-35 900 22)"  />
        <ellipse cx="1260" cy="58" rx="12" ry="5" transform="rotate(35 1260 58)"  />
        <circle  cx="360"  cy="40" r="3" />
        <circle  cx="720"  cy="40" r="3" />
        <circle  cx="1080" cy="40" r="3" />
      </svg>
    </div>
  );
}
