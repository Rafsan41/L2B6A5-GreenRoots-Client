"use client"

import React, { useEffect, useState } from "react"
import { Loader2, ChevronDown, ChevronUp, Store } from "lucide-react"
import { toast } from "sonner"
import {
  adminService,
  type AdminOrder,
  type OrderStatus,
} from "@/services/admin.service"
import { ORDER_STATUS_COLOR, StatusChip } from "./admin-shared"

const ORDER_STATUSES = ["ALL", "PLACED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"] as const
const ORDER_STATUS_OPTIONS: OrderStatus[] = ["PLACED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]
const BUYER_FILTERS = ["ALL", "CUSTOMER", "SELLER"] as const
type BuyerFilter = (typeof BUYER_FILTERS)[number]

export default function OrdersSection() {
  const [orders, setOrders]         = useState<AdminOrder[]>([])
  const [loading, setLoading]       = useState(true)
  const [statusFilter, setStatusFilter] = useState<"ALL" | OrderStatus>("ALL")
  const [buyerFilter, setBuyerFilter]   = useState<BuyerFilter>("ALL")
  const [expanded, setExpanded]     = useState<string | null>(null)
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null)

  useEffect(() => {
    adminService
      .getOrders()
      .then(setOrders)
      .catch(() => toast.error("Failed to load orders"))
      .finally(() => setLoading(false))
  }, [])

  const handleOrderStatusChange = async (orderId: string, status: OrderStatus) => {
    setUpdatingOrder(orderId)
    try {
      await adminService.updateOrderStatus(orderId, status)
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)))
      toast.success("Order status updated")
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setUpdatingOrder(null)
    }
  }

  const effectiveRole = (o: AdminOrder) => o.customer.role ?? "CUSTOMER"

  const filtered = orders.filter((o) => {
    const matchStatus = statusFilter === "ALL" || o.status === statusFilter
    const matchBuyer  = buyerFilter  === "ALL" || effectiveRole(o) === buyerFilter
    return matchStatus && matchBuyer
  })

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="size-7 animate-spin text-primary" />
      </div>
    )

  const sellerOrderCount   = orders.filter((o) => effectiveRole(o) === "SELLER").length
  const customerOrderCount = orders.filter((o) => effectiveRole(o) === "CUSTOMER").length

  return (
    <div className="space-y-4">
      {/* Buyer type filter */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-muted-foreground">Buyer:</span>
        {(["ALL", "CUSTOMER", "SELLER"] as const).map((b) => {
          const count =
            b === "ALL" ? orders.length : b === "SELLER" ? sellerOrderCount : customerOrderCount
          return (
            <button
              key={b}
              onClick={() => setBuyerFilter(b)}
              className={`rounded-full px-3 py-1 text-xs font-semibold border transition-colors ${
                buyerFilter === b
                  ? b === "SELLER"
                    ? "bg-purple-600 text-white border-purple-600"
                    : "bg-primary text-primary-foreground border-primary"
                  : "bg-muted text-muted-foreground border-transparent"
              }`}
            >
              {b === "SELLER" ? "🏪 Manager Bulk" : b} ({count})
            </button>
          )
        })}
      </div>

      {/* Status filter */}
      <div className="flex flex-wrap gap-2">
        {ORDER_STATUSES.map((s) => {
          const count =
            s === "ALL"
              ? filtered.length
              : orders.filter((o) => {
                  const matchBuyer = buyerFilter === "ALL" || effectiveRole(o) === buyerFilter
                  return o.status === s && matchBuyer
                }).length
          return (
            <button
              key={s}
              onClick={() => setStatusFilter(s as any)}
              className={`rounded-full px-3 py-1 text-xs font-semibold border transition-colors ${
                statusFilter === s
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-muted text-muted-foreground border-transparent"
              }`}
            >
              {s} ({count})
            </button>
          )
        })}
      </div>

      <div className="rounded-xl border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/30">
              <tr>
                {["Order", "Buyer", "Date", "Items", "Total", "Status", "Update Status"].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((order) => {
                const isSeller     = effectiveRole(order) === "SELLER"
                const sellerCount  = new Set(order.items.map((i) => i.medicine.seller.id)).size
                return (
                  <React.Fragment key={order.id}>
                    <tr className={isSeller ? "bg-purple-500/5" : ""}>
                      <td className="px-4 py-3">
                        <p className="font-mono text-xs font-semibold">{order.orderNumber}</p>
                        <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                          {isSeller && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-semibold text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                              🏪 Manager Bulk
                            </span>
                          )}
                          <button
                            onClick={() =>
                              setExpanded(expanded === order.id ? null : order.id)
                            }
                            className="inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[10px] text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                          >
                            {expanded === order.id ? (
                              <>
                                <ChevronUp className="size-3" /> Hide
                              </>
                            ) : (
                              <>
                                <ChevronDown className="size-3" /> Details
                              </>
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium">{order.customer.name}</p>
                        <p className="text-xs text-muted-foreground">{order.customer.email}</p>
                        <span
                          className={`text-[10px] font-semibold ${
                            isSeller ? "text-purple-500" : "text-blue-500"
                          }`}
                        >
                          {effectiveRole(order)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                        {sellerCount > 1 && (
                          <p className="text-xs">{sellerCount} sellers</p>
                        )}
                      </td>
                      <td className="px-4 py-3 font-semibold text-primary">
                        ৳{parseFloat(order.total).toFixed(2)}
                      </td>
                      <td className="px-4 py-3">
                        <StatusChip status={order.status} colorMap={ORDER_STATUS_COLOR} />
                      </td>
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={order.status}
                          disabled={updatingOrder === order.id}
                          onChange={(e) =>
                            handleOrderStatusChange(order.id, e.target.value as OrderStatus)
                          }
                          className="rounded-md border border-input bg-background px-2 py-1 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
                        >
                          {ORDER_STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                        {updatingOrder === order.id && (
                          <Loader2 className="ml-1 inline size-3 animate-spin" />
                        )}
                      </td>
                    </tr>
                    {expanded === order.id && (
                      <tr key={`${order.id}-exp`}>
                        <td colSpan={7} className="bg-muted/10 px-6 py-4">
                          <div className="space-y-2 text-xs">
                            <p className="text-muted-foreground">
                              Ship to: {order.shippingAddress}, {order.shippingCity}
                              {order.shippingPostalCode && ` - ${order.shippingPostalCode}`}
                            </p>
                            <div className="divide-y rounded-lg border overflow-hidden">
                              {order.items.map((item) => (
                                <div
                                  key={item.id}
                                  className="flex items-center justify-between bg-background px-3 py-2"
                                >
                                  <div className="space-y-1">
                                    <p className="font-medium">{item.medicine.name}</p>
                                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                                      <Store className="size-2.5" />
                                      {item.medicine.seller.name}
                                    </span>
                                  </div>
                                  <div className="text-right">
                                    <p>×{item.quantity}</p>
                                    <p className="font-semibold text-primary">
                                      ৳{parseFloat(item.subtotal).toFixed(2)}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                )
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="py-12 text-center text-sm text-muted-foreground">No orders found</p>
          )}
        </div>
      </div>
    </div>
  )
}
