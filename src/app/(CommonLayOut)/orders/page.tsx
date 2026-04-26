"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Loader2, Package, ShoppingBag, ChevronRight, XCircle, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { authClient } from "@/lib/auth-client"
import { orderService } from "@/services/order.service"
import { sellerService, type SellerOrderEntry } from "@/services/seller.service"
import { adminService, type AdminOrder } from "@/services/admin.service"
import type { Order, OrderStatus } from "@/types/order"

// ── Status config ─────────────────────────────────────────
const STATUS_COLOR: Record<OrderStatus, string> = {
  PLACED:     "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  PROCESSING: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  SHIPPED:    "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  DELIVERED:  "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  CANCELLED:  "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
}

const STATUS_LABEL: Record<OrderStatus, string> = {
  PLACED: "Order Placed", PROCESSING: "Processing",
  SHIPPED: "Shipped", DELIVERED: "Delivered", CANCELLED: "Cancelled",
}

const TRACKING_STEPS: OrderStatus[] = ["PLACED", "PROCESSING", "SHIPPED", "DELIVERED"]

function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_COLOR[status]}`}>
      {STATUS_LABEL[status]}
    </span>
  )
}

function TrackingBar({ status }: { status: OrderStatus }) {
  if (status === "CANCELLED") {
    return (
      <div className="flex items-center gap-2 text-sm text-destructive">
        <XCircle className="size-4 shrink-0" />
        <span>Order was cancelled</span>
      </div>
    )
  }
  const currentIdx = TRACKING_STEPS.indexOf(status)
  return (
    <div className="flex items-center gap-1 overflow-x-auto">
      {TRACKING_STEPS.map((step, idx) => {
        const done = idx <= currentIdx
        const current = idx === currentIdx
        return (
          <div key={step} className="flex items-center gap-1 shrink-0">
            <div className={`flex size-6 items-center justify-center rounded-full text-[10px] font-bold transition-colors ${
              done ? (current ? "bg-primary text-primary-foreground ring-2 ring-primary/30" : "bg-primary/80 text-primary-foreground") : "bg-muted text-muted-foreground"
            }`}>
              {idx + 1}
            </div>
            <span className={`text-xs ${done ? (current ? "font-semibold text-primary" : "text-foreground") : "text-muted-foreground"}`}>
              {STATUS_LABEL[step]}
            </span>
            {idx < TRACKING_STEPS.length - 1 && (
              <div className={`mx-1 h-px w-6 shrink-0 ${idx < currentIdx ? "bg-primary" : "bg-muted"}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── Customer order card ───────────────────────────────────
function OrderCard({ order, onCancel }: { order: Order; onCancel: (id: string) => void }) {
  const [cancelling, setCancelling] = useState(false)

  const handleCancel = async () => {
    setCancelling(true)
    try {
      await orderService.cancel(order.id)
      toast.success("Order cancelled")
      onCancel(order.id)
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setCancelling(false)
    }
  }

  return (
    <div className="rounded-2xl border bg-card overflow-hidden">
      <div className="flex flex-wrap items-start justify-between gap-3 bg-muted/30 px-5 py-4">
        <div>
          <p className="text-xs text-muted-foreground">Order Number</p>
          <p className="font-mono text-sm font-semibold">{order.orderNumber}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Placed on</p>
          <p className="text-sm">{new Date(order.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Total</p>
          <p className="text-sm font-bold text-primary">৳{parseFloat(order.total).toFixed(2)}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="px-5 py-4 space-y-4">
        <TrackingBar status={order.status} />
        <Separator />
        <div className="space-y-1.5">
          {order.items.slice(0, 3).map((item) => (
            <div key={item.id} className="flex items-center justify-between text-sm">
              <Link href={`/medicines/${item.medicine.slug}`} className="hover:text-primary transition-colors line-clamp-1 flex-1">
                {item.medicine.name}
              </Link>
              <span className="ml-3 shrink-0 text-muted-foreground">
                ×{item.quantity} · ৳{parseFloat(item.subtotal).toFixed(2)}
              </span>
            </div>
          ))}
          {order.items.length > 3 && (
            <p className="text-xs text-muted-foreground">+{order.items.length - 3} more item{order.items.length - 3 > 1 ? "s" : ""}</p>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          Ship to: {order.shippingAddress}, {order.shippingCity}
          {order.shippingPostalCode && ` - ${order.shippingPostalCode}`}
        </p>
        <div className="flex items-center justify-between pt-1">
          <Button asChild variant="outline" size="sm" className="gap-1.5">
            <Link href={`/orders/${order.id}`}>
              View Details <ChevronRight className="size-3.5" />
            </Link>
          </Button>
          {order.status === "PLACED" && (
            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" disabled={cancelling} onClick={handleCancel}>
              {cancelling ? <Loader2 className="mr-1 size-4 animate-spin" /> : null}
              Cancel Order
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Seller order card (from SellerOrder) ──────────────────
function SellerOrderCard({ entry }: { entry: SellerOrderEntry }) {
  const { order, status, sellerId } = entry
  const myItems = order.items.filter((i) => i.medicine.sellerId === sellerId)
  const myTotal = myItems.reduce((s, i) => s + parseFloat(i.subtotal), 0)

  return (
    <div className="rounded-2xl border bg-card overflow-hidden">
      <div className="flex flex-wrap items-start justify-between gap-3 bg-muted/30 px-5 py-4">
        <div>
          <p className="text-xs text-muted-foreground">Order Number</p>
          <p className="font-mono text-sm font-semibold">{order.orderNumber}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Customer</p>
          <p className="text-sm font-medium flex items-center gap-1">
            <User className="size-3" />{order.customer.name}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Placed on</p>
          <p className="text-sm">{new Date(order.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Your Revenue</p>
          <p className="text-sm font-bold text-primary">৳{myTotal.toFixed(2)}</p>
        </div>
        <StatusBadge status={status as OrderStatus} />
      </div>

      <div className="px-5 py-4 space-y-4">
        <TrackingBar status={status as OrderStatus} />
        <Separator />
        <div className="space-y-1.5">
          {myItems.slice(0, 3).map((item) => (
            <div key={item.id} className="flex items-center justify-between text-sm">
              <span className="line-clamp-1 flex-1">{item.medicine.name}</span>
              <span className="ml-3 shrink-0 text-muted-foreground">
                ×{item.quantity} · ৳{parseFloat(item.subtotal).toFixed(2)}
              </span>
            </div>
          ))}
          {myItems.length > 3 && (
            <p className="text-xs text-muted-foreground">+{myItems.length - 3} more item{myItems.length - 3 > 1 ? "s" : ""}</p>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          Ship to: {order.shippingAddress}, {order.shippingCity}
          {order.shippingPostalCode && ` - ${order.shippingPostalCode}`}
        </p>
        <p className="text-xs text-muted-foreground italic">
          Status is managed by admin
        </p>
      </div>
    </div>
  )
}

// ── Admin order card ──────────────────────────────────────
function AdminOrderCard({ order }: { order: AdminOrder }) {
  return (
    <div className="rounded-2xl border bg-card overflow-hidden">
      <div className="flex flex-wrap items-start justify-between gap-3 bg-muted/30 px-5 py-4">
        <div>
          <p className="text-xs text-muted-foreground">Order Number</p>
          <p className="font-mono text-sm font-semibold">{order.orderNumber}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Customer</p>
          <p className="text-sm font-medium flex items-center gap-1">
            <User className="size-3" /> {order.customer.name}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Placed on</p>
          <p className="text-sm">{new Date(order.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Total</p>
          <p className="text-sm font-bold text-primary">৳{parseFloat(order.total).toFixed(2)}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>
      <div className="px-5 py-4 space-y-4">
        <TrackingBar status={order.status} />
        <Separator />
        <div className="space-y-1.5">
          {order.items.slice(0, 3).map((item) => (
            <div key={item.id} className="flex items-center justify-between text-sm">
              <span className="line-clamp-1 flex-1">{item.medicine.name}</span>
              <span className="ml-3 shrink-0 text-muted-foreground">
                ×{item.quantity} · ৳{parseFloat(item.subtotal).toFixed(2)}
              </span>
            </div>
          ))}
          {order.items.length > 3 && (
            <p className="text-xs text-muted-foreground">+{order.items.length - 3} more item{order.items.length - 3 > 1 ? "s" : ""}</p>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          Ship to: {order.shippingAddress}, {order.shippingCity}
          {order.shippingPostalCode && ` - ${order.shippingPostalCode}`}
        </p>
        <p className="text-xs text-muted-foreground">
          Sellers: {[...new Set(order.items.map(i => i.medicine.seller.name))].join(", ")}
        </p>
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────
export default function OrdersPage() {
  const { data: session, isPending } = authClient.useSession()
  const userRole = (session?.user as any)?.role?.toUpperCase()
  const isAdmin  = userRole === "ADMIN"
  const isSeller = userRole === "SELLER"

  const [myOrders, setMyOrders]         = useState<Order[]>([])
  const [sellerOrders, setSellerOrders]  = useState<SellerOrderEntry[]>([])
  const [adminOrders, setAdminOrders]    = useState<AdminOrder[]>([])
  const [loading, setLoading]            = useState(true)

  useEffect(() => {
    if (!session?.user) return
    setLoading(true)
    if (isAdmin) {
      adminService.getOrders()
        .then(setAdminOrders)
        .catch((err: any) => toast.error(err.message ?? "Failed to load orders"))
        .finally(() => setLoading(false))
    } else if (isSeller) {
      sellerService.getOrders()
        .then(setSellerOrders)
        .catch((err: any) => toast.error(err.message ?? "Failed to load orders"))
        .finally(() => setLoading(false))
    } else {
      orderService.getMyOrders()
        .then(setMyOrders)
        .catch((err: any) => toast.error(err.message ?? "Failed to load orders"))
        .finally(() => setLoading(false))
    }
  }, [session?.user?.id, isAdmin, isSeller])

  const handleCancel = (id: string) => {
    setMyOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: "CANCELLED" as OrderStatus } : o)))
  }

  if (isPending || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!session?.user) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="mb-4 text-muted-foreground">Please log in to see your orders.</p>
        <Button asChild><Link href="/login">Log In</Link></Button>
      </div>
    )
  }

  const pageTitle = isAdmin ? "All Orders" : isSeller ? "Customer Orders" : "My Orders"

  return (
    <div className="container mx-auto px-4 py-8 md:py-10">
      <div className="mb-6 md:mb-8 flex items-center gap-3">
        <Package className="size-6 text-primary" />
        <h1 className="text-2xl font-bold">{pageTitle}</h1>
      </div>

      {isAdmin ? (
        /* ── Admin view: all orders ── */
        adminOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-5 py-24 text-center">
            <div className="flex size-20 items-center justify-center rounded-full bg-muted">
              <Package className="size-9 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold">No orders yet</h2>
          </div>
        ) : (
          <div className="space-y-5">
            {adminOrders.map((order) => <AdminOrderCard key={order.id} order={order} />)}
          </div>
        )
      ) : isSeller ? (
        /* ── Seller view: customer orders only ── */
        sellerOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-5 py-24 text-center">
            <div className="flex size-20 items-center justify-center rounded-full bg-muted">
              <Package className="size-9 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold">No customer orders yet</h2>
            <p className="text-sm text-muted-foreground">Orders placed for your products will appear here</p>
          </div>
        ) : (
          <div className="space-y-5">
            {sellerOrders.map((entry) => <SellerOrderCard key={entry.id} entry={entry} />)}
          </div>
        )
      ) : (
        /* ── Customer view ── */
        myOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-5 py-24 text-center">
            <div className="flex size-20 items-center justify-center rounded-full bg-muted">
              <ShoppingBag className="size-9 text-muted-foreground" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">No orders yet</h2>
              <p className="mt-1 text-sm text-muted-foreground">Browse medicines and place your first order</p>
            </div>
            <Button asChild><Link href="/medicines">Browse Medicines</Link></Button>
          </div>
        ) : (
          <div className="space-y-5">
            {myOrders.map((order) => <OrderCard key={order.id} order={order} onCancel={handleCancel} />)}
          </div>
        )
      )}
    </div>
  )
}

// ── legacy seller two-section placeholder (kept for reference, no longer rendered) ──
function _SellerTwoSections({ myOrders, sellerOrders, handleCancel }: { myOrders: Order[]; sellerOrders: SellerOrderEntry[]; handleCancel: (id: string) => void }) {
  return (
        <div className="space-y-10">
          {/* My Purchases */}
          <section>
            <h2 className="mb-4 text-lg font-semibold flex items-center gap-2">
              <ShoppingBag className="size-5 text-primary" />
              My Purchases
              <span className="ml-1 rounded-full bg-muted px-2 py-0.5 text-xs font-normal text-muted-foreground">
                {myOrders.length}
              </span>
            </h2>
            {myOrders.length === 0 ? (
              <div className="rounded-xl border border-dashed bg-muted/20 py-10 text-center">
                <p className="text-sm text-muted-foreground">You haven't placed any orders yet</p>
                <Button asChild size="sm" className="mt-3"><Link href="/medicines">Browse Medicines</Link></Button>
              </div>
            ) : (
              <div className="space-y-5">
                {myOrders.map((order) => <OrderCard key={order.id} order={order} onCancel={handleCancel} />)}
              </div>
            )}
          </section>
        </div>
  )
}
