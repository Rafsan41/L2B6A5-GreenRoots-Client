"use client"

import { useEffect, useState } from "react"
import { Loader2, Users, Star, MessageSquare, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { sellerService } from "@/services/seller.service"

const PAGE_SIZE = 10

interface CustomerRow {
  name: string
  email?: string
  totalOrders: number
  totalSpent: number
  lastOrder?: string
}

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`size-3 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`} />
      ))}
    </div>
  )
}

export default function SellerCustomersPage() {
  const [customerData, setCustomerData] = useState<any>(null)
  const [loading, setLoading]           = useState(true)
  const [search, setSearch]             = useState("")
  const [page, setPage]                 = useState(1)
  const [tab, setTab]                   = useState<"customers" | "reviews">("customers")

  useEffect(() => {
    sellerService.getCustomerStats()
      .then(setCustomerData)
      .catch(() => toast.error("Failed to load customer data"))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { setPage(1) }, [search, tab])

  if (loading) return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Loader2 className="size-8 animate-spin text-primary" />
    </div>
  )

  // ── Derive unique customers from review data ────────────────────────────────
  const medicineReviews: any[] = customerData?.medicineReviewsPerCustomer ?? []
  const sellerReviews: any[]   = customerData?.sellerReviewsPerCustomer ?? []

  // Build unique customer map from all reviews
  const customerMap = new Map<string, CustomerRow>()
  ;[...medicineReviews, ...sellerReviews].forEach((r: any) => {
    if (!customerMap.has(r.customerName)) {
      customerMap.set(r.customerName, {
        name:        r.customerName,
        email:       r.customerEmail,
        totalOrders: 0,
        totalSpent:  0,
        lastOrder:   r.createdAt,
      })
    }
    const entry = customerMap.get(r.customerName)!
    entry.totalOrders += 1
    if (r.createdAt > (entry.lastOrder ?? "")) entry.lastOrder = r.createdAt
  })
  const rawCustomers: CustomerRow[] = Array.from(customerMap.values())

  const filteredCustomers = rawCustomers.filter((c) =>
    !search ||
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.email ?? "").toLowerCase().includes(search.toLowerCase())
  )

  const totalPages = Math.max(1, Math.ceil(filteredCustomers.length / PAGE_SIZE))
  const paginated  = filteredCustomers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  // ── All reviews combined ───────────────────────────────────────────────────
  const allReviews = tab === "reviews"
    ? [...medicineReviews.map((r: any) => ({ ...r, type: "medicine" })),
       ...sellerReviews.map((r: any) => ({ ...r, type: "seller" }))]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    : []

  return (
    <div className="space-y-6 p-2">
      <div>
        <h1 className="text-2xl font-bold">Customers</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          View your customer base and their reviews
        </p>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-card p-5 flex items-center gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/30">
            <Users className="size-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total Customers</p>
            <p className="text-2xl font-bold">{rawCustomers.length}</p>
          </div>
        </div>
        <div className="rounded-xl border bg-card p-5 flex items-center gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30">
            <Star className="size-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Medicine Reviews</p>
            <p className="text-2xl font-bold">{medicineReviews.length}</p>
          </div>
        </div>
        <div className="rounded-xl border bg-card p-5 flex items-center gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-900/30">
            <MessageSquare className="size-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Store Reviews</p>
            <p className="text-2xl font-bold">{sellerReviews.length}</p>
          </div>
        </div>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-2 border-b pb-0">
        {(["customers","reviews"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`pb-2 px-1 text-sm font-medium capitalize border-b-2 transition-colors ${
              tab === t
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}>
            {t === "customers" ? `Customers (${rawCustomers.length})` : `Reviews (${medicineReviews.length + sellerReviews.length})`}
          </button>
        ))}
      </div>

      {/* ── Customers tab ── */}
      {tab === "customers" && (
        <>
          <div className="flex items-center gap-3">
            <Input
              placeholder="Search by name or email…"
              value={search} onChange={(e) => setSearch(e.target.value)}
              className="h-9 max-w-sm text-sm"
            />
            <span className="ml-auto text-xs text-muted-foreground">
              {filteredCustomers.length} customer{filteredCustomers.length !== 1 ? "s" : ""}
            </span>
          </div>

          {filteredCustomers.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
              <Users className="size-10 text-muted-foreground" />
              <p className="text-muted-foreground">
                {search ? "No customers match your search." : "No customers yet."}
              </p>
            </div>
          ) : (
            <>
              <div className="rounded-xl border bg-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b bg-muted/30">
                      <tr>
                        {["Customer", "Orders", "Total Spent", "Last Order"].map((h) => (
                          <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {paginated.map((c, i) => (
                        <tr key={i}>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <span className="size-8 flex shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                                style={{ background: ["#10b981","#3b82f6","#f59e0b","#8b5cf6","#ef4444"][i % 5] }}>
                                {c.name.charAt(0).toUpperCase()}
                              </span>
                              <div>
                                <p className="font-medium">{c.name}</p>
                                {c.email && <p className="text-xs text-muted-foreground">{c.email}</p>}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center justify-center rounded-full bg-primary/10 text-primary px-2.5 py-0.5 text-xs font-semibold">
                              {c.totalOrders}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-semibold text-primary">
                            {c.totalSpent > 0 ? `৳${c.totalSpent.toFixed(0)}` : "—"}
                          </td>
                          <td className="px-4 py-3 text-xs text-muted-foreground">
                            {c.lastOrder
                              ? new Date(c.lastOrder).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
                              : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filteredCustomers.length)} of {filteredCustomers.length}
                  </p>
                  <div className="flex items-center gap-1">
                    <Button variant="outline" size="icon" className="size-8"
                      disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
                      <ChevronLeft className="size-4" />
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                      .reduce<(number | "…")[]>((acc, p, idx, arr) => {
                        if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("…")
                        acc.push(p)
                        return acc
                      }, [])
                      .map((p, i) =>
                        p === "…" ? (
                          <span key={`e-${i}`} className="px-1 text-muted-foreground">…</span>
                        ) : (
                          <Button key={p} variant={page === p ? "default" : "outline"} size="icon"
                            className="size-8 text-xs" onClick={() => setPage(p as number)}>
                            {p}
                          </Button>
                        )
                      )}
                    <Button variant="outline" size="icon" className="size-8"
                      disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
                      <ChevronRight className="size-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* ── Reviews tab ── */}
      {tab === "reviews" && (
        <div className="space-y-3">
          {allReviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
              <Star className="size-10 text-muted-foreground" />
              <p className="text-muted-foreground">No reviews yet</p>
            </div>
          ) : allReviews.map((r: any, i: number) => (
            <div key={i} className="rounded-xl border bg-card p-4 space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">{r.customerName}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {r.type === "medicine" ? (
                      <span className="text-primary">{r.medicineName}</span>
                    ) : (
                      <span className="italic">Store review</span>
                    )}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <StarRow rating={r.rating} />
                  <p className="text-xs text-muted-foreground">
                    {new Date(r.createdAt).toLocaleDateString("en-GB", { day:"numeric", month:"short", year:"numeric" })}
                  </p>
                </div>
              </div>
              {r.comment && (
                <p className="text-sm text-muted-foreground leading-relaxed">{r.comment}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
