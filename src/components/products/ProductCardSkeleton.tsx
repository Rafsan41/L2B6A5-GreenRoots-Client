import { Skeleton } from "@/components/ui/skeleton"

export default function ProductCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={`relative flex h-full flex-col overflow-hidden ${className ?? ""}`}
      style={{
        background:   "var(--card-surface)",
        border:       "1px solid var(--card-border-color)",
        borderRadius: "12px",
        padding:      "20px 20px 18px",
      }}
    >
      {/* Inner ruled border shimmer */}
      <div
        className="absolute pointer-events-none"
        style={{ inset: 7, borderRadius: 7, border: "1px solid var(--card-inner-border)", opacity: 0.4 }}
      />

      {/* Top row: № placeholder + price placeholder */}
      <div className="relative z-10 flex justify-between items-center mb-3">
        <Skeleton className="h-3 w-10" />
        <Skeleton className="h-3 w-12" />
      </div>

      {/* Divider */}
      <div className="relative z-10 h-px bg-muted mb-5" />

      {/* Seal placeholder (top-right) */}
      <Skeleton className="absolute z-10 top-10 right-4 size-12 rounded-full" />

      {/* Jar image area */}
      <div className="relative z-10 flex items-center justify-center" style={{ minHeight: 148 }}>
        <Skeleton className="h-32 w-24 rounded-xl" />
      </div>

      {/* Name */}
      <div className="relative z-10 flex flex-col items-center gap-2 mt-3 mb-1">
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-3 w-24" />
      </div>

      {/* Rating */}
      <div className="relative z-10 flex items-center justify-center gap-1 mt-2 mb-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="size-3 rounded-sm" />
        ))}
      </div>

      {/* Divider */}
      <div className="relative z-10 h-px bg-muted my-4" />

      {/* Add to basket button */}
      <Skeleton className="relative z-10 h-9 w-full rounded-full" />
    </div>
  )
}
