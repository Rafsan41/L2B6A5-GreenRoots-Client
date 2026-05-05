"use client"

import { useEffect, useState } from "react"
import { Loader2, Package, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import {
  sellerService,
  type SellerOrderEntry,
  type SellerOrderStatus,
} from "@/services/seller.service"

const PAGE_SIZE = 10

const STATUS_COLOR: Record<SellerOrderStatus, string> = {
  PLACED:     "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  PROCESSING: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  SHIPPED:    "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  DELIVERED:  "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  CANCELLED:  "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
}

const STATUS_LABEL: Record<SellerOrderStatus, string> = {
  PLACED: "Placed", PROCESSING: "Processing", SHIPPED: "Shipped",
  DELIVERED: "Delivered", CANCELLED: "Cancelled",
}

const NEXT_STATUSES: Record<SellerOrderStatus, SellerOrderStatus[]> = {
  PLACED: ["PROCESSING","CANCELLED"], PROCESSING: ["SHIPPED"],
  SHIPPED: ["DELIVERED"], DELIVERED: [], CANCELLED: [],
}

const STATUS_FILTERS: (SellerOrderStatus | "ALL")[] = [
  "ALL","PLACED","PROCESSING","SHIPPED","DELIVERED","CANCELLED"
]

// ── Single order card ──────────────────────────────────────────────────────────
function OrderRow({ entry, onUpdate }: {
  entry: SellerOrderEntry
  onUpdate: (orderId: string, status: SellerOrderStatus) => void
}) {
  const [updating, setUpdating] = useState(false)
  const { order } = entry
  const nextStatuses = NEXT_STATUSES[entry.status]
  const sellerItems = order.items.filter((i) => i.medicine.sellerId === entry.sellerId)
  const sellerTotal = sellerItems.reduce((s, i) => s + parseFloat(i.subtotal), 0)

  const handleStatusChange = async (status: SellerOrderStatus) => {
    setUpdating(true)
    try {
      await sellerService.updateOrderStatus(order.id, status)
      onUpdate(order.id, status)
      toast.success(`${order.orderNumber} → ${STATUS_LABEL[status]}`)
    } catch (err: any) { toast.error(err.message) }
    finally { setUpdating(false) }
  }

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-muted/30 px-4 py-3 text-sm">
        <span className="font-mono font-semibold">{order.orderNumber}</span>
        <span className="text-muted-foreground">
          {new Date(order.createdAt).toLocaleDateString("en-GB", { day:"numeric", month:"short", year:"numeric" })}
        </span>
        <div>
          <p className="text-xs text-muted-foreground">Customer</p>
          <p className="font-medium">{order.customer.name}</p>
          <p className="text-xs text-muted-foreground">{order.customer.email}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Your items total</p>
          <p className="font-bold text-primary">৳{sellerTotal.toFixed(2)}</p>
        </div>
        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_COLOR[entry.status]}`}>
          {STATUS_LABEL[entry.status]}
        </span>
      </div>
      <div className="px-4 py-3 space-y-3">
        <div className="space-y-1">
          {sellerItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground line-clamp-1 flex-1">{item.medicine.name}</span>
              <span className="ml-3 shrink-0">×{item.quantity} · ৳{parseFloat(item.subtotal).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          Ship to: {order.shippingAddress}, {order.shippingCity}
        </p>
        {nextStatuses.length > 0 && (
          <>
            <Separator />
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground">Update:</span>
              {nextStatuses.map((s) => (
                <button key={s} disabled={updating} onClick={() => handleStatusChange(s)}
                  className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold hover:opacity-80 disabled:opacity-50 ${STATUS_COLOR[s]}`}>
                  {updating && <Loader2 className="size-3 animate-spin" />}
                  Mark as {STATUS_LABEL[s]}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────────
export default function SellerOrdersPage() {
  const [orders, setOrders]   = useState<SellerOrderEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter]   = useState<SellerOrderStatus | "ALL">("ALL")
  const [page, setPage]       = useState(1)

  useEffect(() => {
    sellerService.getOrders()
      .then(setOrders)
      .catch(() => toast.error("Failed to load orders"))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { setPage(1) }, [filter])

  const handleUpdate = (orderId: string, status: SellerOrderStatus) =>
    setOrders((prev) => prev.map((e) => e.order.id === orderId ? { ...e, status } : e))

  const counts = {
    PLACED:     orders.filter((o) => o.status === "PLACED").length,
    PROCESSING: orders.filter((o) => o.status === "PROCESSING").length,
    SHIPPED:    orders.filter((o) => o.status === "SHIPPED").length,
    DELIVERED:  orders.filter((o) => o.status === "DELIVERED").length,
    CANCELLED:  orders.filter((o) => o.status === "CANCELLED").length,
  }

  const filtered   = filter === "ALL" ? orders : orders.filter((o) => o.status === filter)
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  if (loading) return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Loader2 className="size-8 animate-spin text-primary" />
    </div>
  )

  return (
    <div className="space-y-6 p-2">
      <div>
        <h1 className="text-2xl font-bold">My Orders</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          View and manage customer orders for your medicines
        </p>
      </div>

      {/* Summary badges */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {(["PLACED","PROCESSING","SHIPPED","DELIVERED","CANCELLED"] as SellerOrderStatus[]).map((s) => (
          <div key={s} className={`rounded-xl border p-3 text-center cursor-pointer transition-opacity ${
            filter !== "ALL" && filter !== s ? "opacity-40" : ""
          } ${STATUS_COLOR[s]}`}
            onClick={() => setFilter((prev) => prev === s ? "ALL" : s)}>
            <p className="text-2xl font-bold">{counts[s]}</p>
            <p className="mt-0.5 text-xs font-medium">{STATUS_LABEL[s]}</p>
          </div>
        ))}
      </div>

      {/* Filter pills */}
      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`rounded-full px-3 py-1 text-xs font-semibold border transition-colors ${
              filter === s
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-muted text-muted-foreground border-transparent hover:border-muted-foreground/30"
            }`}>
            {s === "ALL" ? `All (${orders.length})` : `${STATUS_LABEL[s as SellerOrderStatus]} (${counts[s as SellerOrderStatus]})`}
          </button>
        ))}
      </div>

      {/* Orders list */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
          <Package className="size-10 text-muted-foreground" />
          <p className="text-muted-foreground">
            No {filter !== "ALL" ? STATUS_LABEL[filter as SellerOrderStatus].toLowerCase() : ""} orders
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {paginated.map((entry) => (
              <OrderRow key={entry.id} entry={entry} onUpdate={handleUpdate} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between text-sm">
              <p className="text-muted-foreground text-xs">
                Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
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
    </div>
  )
}
