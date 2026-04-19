"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  Loader2, ShoppingBag, Package, CheckCircle2, XCircle,
  Clock, Truck, User, MapPin, ChevronRight, ShoppingCart,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { authClient } from "@/lib/auth-client"
import { orderService } from "@/services/order.service"
import type { Order, OrderStatus } from "@/types/order"

// ── helpers ────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; icon: React.ElementType }> = {
  PLACED:     { label: "Placed",     color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",     icon: Clock },
  PROCESSING: { label: "Processing", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400", icon: Package },
  SHIPPED:    { label: "Shipped",    color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400", icon: Truck },
  DELIVERED:  { label: "Delivered",  color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",  icon: CheckCircle2 },
  CANCELLED:  { label: "Cancelled",  color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",          icon: XCircle },
}

function StatusChip({ status }: { status: OrderStatus }) {
  const cfg = STATUS_CONFIG[status]
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${cfg.color}`}>
      <cfg.icon className="size-3" />
      {cfg.label}
    </span>
  )
}

function StatCard({
  icon: Icon, label, value, color,
}: {
  icon: React.ElementType; label: string; value: number | string; color: string
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border bg-card p-5">
      <div className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${color}`}>
        <Icon className="size-5" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </div>
  )
}

// ── page ───────────────────────────────────────────────────────────────────

export default function CustomerDashboardPage() {
  const { data: session, isPending } = authClient.useSession()
  const [orders, setOrders]     = useState<Order[]>([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    orderService.getMyOrders()
      .then(setOrders)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (isPending || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    )
  }

  const user = session?.user as { name?: string; email?: string; image?: string } | undefined

  // ── stats ──────────────────────────────────────────────────────────────
  const totalOrders     = orders.length
  const activeOrders    = orders.filter((o) => !["DELIVERED","CANCELLED"].includes(o.status)).length
  const totalSpent      = orders
    .filter((o) => o.status !== "CANCELLED")
    .reduce((s, o) => s + parseFloat(o.total), 0)
  const deliveredOrders = orders.filter((o) => o.status === "DELIVERED").length

  const recentOrders = orders.slice(0, 5)

  return (
    <div className="space-y-6 p-2">

      {/* ── greeting ───────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold">
          Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}!
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Here&apos;s a summary of your orders and account.
        </p>
      </div>

      {/* ── stat cards ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard icon={ShoppingBag}  label="Total Orders"    value={totalOrders}
          color="bg-blue-100 text-blue-600 dark:bg-blue-900/30" />
        <StatCard icon={Clock}        label="Active Orders"   value={activeOrders}
          color="bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30" />
        <StatCard icon={CheckCircle2} label="Delivered"       value={deliveredOrders}
          color="bg-green-100 text-green-600 dark:bg-green-900/30" />
        <StatCard icon={Package}      label="Total Spent"     value={`৳${totalSpent.toFixed(0)}`}
          color="bg-purple-100 text-purple-600 dark:bg-purple-900/30" />
      </div>

      {/* ── quick actions ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Link href="/orders"
          className="flex items-center justify-between rounded-xl border bg-card p-4 transition-colors hover:bg-muted/40">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30">
              <ShoppingBag className="size-4" />
            </div>
            <div>
              <p className="text-sm font-semibold">My Orders</p>
              <p className="text-xs text-muted-foreground">Track deliveries</p>
            </div>
          </div>
          <ChevronRight className="size-4 text-muted-foreground" />
        </Link>

        <Link href="/medicines"
          className="flex items-center justify-between rounded-xl border bg-card p-4 transition-colors hover:bg-muted/40">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-green-100 text-green-600 dark:bg-green-900/30">
              <ShoppingCart className="size-4" />
            </div>
            <div>
              <p className="text-sm font-semibold">Shop Medicines</p>
              <p className="text-xs text-muted-foreground">Browse our store</p>
            </div>
          </div>
          <ChevronRight className="size-4 text-muted-foreground" />
        </Link>

        <Link href="/profile"
          className="flex items-center justify-between rounded-xl border bg-card p-4 transition-colors hover:bg-muted/40">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-900/30">
              <User className="size-4" />
            </div>
            <div>
              <p className="text-sm font-semibold">My Profile</p>
              <p className="text-xs text-muted-foreground">Manage account</p>
            </div>
          </div>
          <ChevronRight className="size-4 text-muted-foreground" />
        </Link>
      </div>

      {/* ── recent orders ──────────────────────────────────────────────── */}
      <div className="rounded-xl border bg-card">
        <div className="flex items-center justify-between border-b px-5 py-3.5">
          <p className="text-sm font-semibold">Recent Orders</p>
          <Button asChild variant="ghost" size="sm" className="h-7 gap-1 text-xs">
            <Link href="/orders">View all <ChevronRight className="size-3" /></Link>
          </Button>
        </div>

        {recentOrders.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <ShoppingBag className="size-10 text-muted-foreground/40" />
            <div>
              <p className="text-sm font-medium">No orders yet</p>
              <p className="text-xs text-muted-foreground">Your orders will appear here</p>
            </div>
            <Button asChild size="sm" className="mt-1">
              <Link href="/medicines">Shop Now</Link>
            </Button>
          </div>
        ) : (
          <div className="divide-y">
            {recentOrders.map((order) => (
              <Link key={order.id} href={`/orders/${order.id}`}
                className="flex items-center justify-between px-5 py-3.5 transition-colors hover:bg-muted/30">
                <div className="min-w-0">
                  <p className="font-mono text-xs font-semibold text-muted-foreground">
                    {order.orderNumber}
                  </p>
                  <p className="mt-0.5 truncate text-sm font-medium">
                    {order.items[0]?.medicine.name}
                    {order.items.length > 1 && (
                      <span className="text-muted-foreground"> +{order.items.length - 1} more</span>
                    )}
                  </p>
                  <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="size-3" />
                    {order.shippingCity}
                    <span>·</span>
                    {new Date(order.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric", month: "short", year: "numeric",
                    })}
                  </div>
                </div>
                <div className="ml-4 flex shrink-0 flex-col items-end gap-1.5">
                  <StatusChip status={order.status} />
                  <p className="text-sm font-semibold text-primary">৳{parseFloat(order.total).toFixed(2)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}
