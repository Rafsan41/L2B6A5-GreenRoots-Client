const MARQUEE_ITEMS = [
  "Herbalist-curated",
  "Delivered in 2 hours",
  "Cash on delivery",
  "340+ single-origin herbs",
  "Free shipping over ৳500",
  "Small-batch harvested",
  "100% natural ingredients",
  "Since 2024",
];

/**
 * Full-width scrolling marquee strip.
 * Dark ink background — sits between hero and categories.
 */
export function MarqueeBanner() {
  // Duplicate items so the scroll loop is seamless
  const doubled = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <div
      className="overflow-hidden border-y"
      style={{
        background: "var(--ink)",
        borderColor: "var(--ink)",
        color: "var(--parchment)",
        padding: "18px 0",
        position: "relative",
        zIndex: 2,
      }}
    >
      <div
        className="flex gap-10 w-max animate-marquee whitespace-nowrap"
        style={{
          fontFamily: "var(--font-cormorant), Georgia, serif",
          fontStyle: "italic",
          fontSize: "clamp(18px, 2vw, 22px)",
        }}
      >
        {doubled.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-10">
            <span>{item}</span>
            <span style={{ color: "var(--honey)", fontStyle: "normal" }}>☘</span>
          </span>
        ))}
      </div>
    </div>
  );
}
