import { Skeleton } from "@/components/ui/skeleton"

export default function DetailSkeleton() {
  return (
    <div className="w-full animate-pulse">
      {/* Breadcrumb bar */}
      <div className="border-b bg-muted/20 px-4 py-3">
        <div className="container mx-auto flex items-center gap-2">
          <Skeleton className="h-3 w-10" />
          <span className="text-muted-foreground/40">/</span>
          <Skeleton className="h-3 w-16" />
          <span className="text-muted-foreground/40">/</span>
          <Skeleton className="h-3 w-24" />
        </div>
      </div>

      {/* Hero */}
      <div className="container mx-auto px-4 py-10 grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* Image column */}
        <div className="flex flex-col gap-4">
          <Skeleton className="aspect-square w-full max-w-lg rounded-2xl" />
          <div className="flex gap-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-16 rounded-xl flex-shrink-0" />
            ))}
          </div>
        </div>

        {/* Info column */}
        <div className="flex flex-col gap-4 pt-2">
          <Skeleton className="h-4 w-20 rounded-full" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <div className="flex gap-1">
            {[1,2,3,4,5].map((i) => <Skeleton key={i} className="size-5 rounded-sm" />)}
            <Skeleton className="h-5 w-12 ml-2" />
          </div>
          <Skeleton className="h-8 w-28" />
          <Skeleton className="h-px w-full" />
          <div className="flex gap-3 mt-2">
            <Skeleton className="h-12 flex-1 rounded-full" />
            <Skeleton className="h-12 flex-1 rounded-full" />
          </div>
          <Skeleton className="h-4 w-40 mt-2" />
        </div>
      </div>

      {/* Tabs placeholder */}
      <div className="container mx-auto px-4 pb-16">
        <div className="flex gap-4 border-b mb-6">
          {["Overview", "Dosage & Usage", "Reviews"].map((t) => (
            <Skeleton key={t} className="h-8 w-24 rounded-none rounded-t-md" />
          ))}
        </div>
        <div className="space-y-3 max-w-2xl">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    </div>
  )
}
