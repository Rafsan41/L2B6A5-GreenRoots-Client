"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import {
  Loader2, Package, MapPin, CheckCircle2, Circle, XCircle, ChevronLeft,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { authClient } from "@/lib/auth-client"
import { orderService } from "@/services/order.service"
import type { Order, OrderStatus } from "@/types/order"

const STEPS: { status: OrderStatus; label: string; desc: string }[] = [
  { status: "PLACED",     label: "Order Placed",  desc: "We've received your order" },
  { status: "PROCESSING", label: "Processing",    desc: "Your order is being prepared" },
  { status: "SHIPPED",    label: "Shipped",       desc: "Your order is on the way" },
  { status: "DELIVERED",  label: "Delivered",     desc: "Order delivered successfully" },
]

const STATUS_COLOR: Record<OrderStatus, string> = {
  PLACED:     "text-blue-600 dark:text-blue-400",
  PROCESSING: "text-yellow-600 dark:text-yellow-400",
  SHIPPED:    "text-purple-600 dark:text-purple-400",
  DELIVERED:  "text-green-600 dark:text-green-400",
  CANCELLED:  "text-red-600 dark:text-red-400",
}

function TrackingTimeline({ status }: { status: OrderStatus }) {
  if (status === "CANCELLED") {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-destructive">
        <XCircle className="size-5 shrink-0" />
        <div>
          <p className="font-semibold">Order Cancelled</p>
          <p className="text-sm opacity-80">This order has been cancelled and stock restored.</p>
        </div>
      </div>
    )
  }

  const currentIdx = STEPS.findIndex((s) => s.status === status)

  return (
    <div className="space-y-0">
      {STEPS.map((step, idx) => {
        const done = idx < currentIdx
        const current = idx === currentIdx
        const pending = idx > currentIdx

        return (
          <div key={step.status} className="flex gap-4">
            {/* Icon + line */}
            <div className="flex flex-col items-center">
              <div className={`flex size-8 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                done    ? "border-primary bg-primary text-primary-foreground"
                : current ? "border-primary bg-primary/10 text-primary"
                : "border-muted bg-muted text-muted-foreground"
              }`}>
                {done ? (
                  <CheckCircle2 className="size-4" />
                ) : (
                  <Circle className="size-4" />
                )}
              </div>
              {idx < STEPS.length - 1 && (
                <div className={`my-1 w-0.5 flex-1 min-h-[24px] ${idx < currentIdx ? "bg-primary" : "bg-muted"}`} />
              )}
            </div>

            {/* Text */}
            <div className={`pb-5 pt-1 ${pending ? "opacity-50" : ""}`}>
              <p className={`text-sm font-semibold ${current ? STATUS_COLOR[status] : ""}`}>
                {step.label}
                {current && <span className="ml-2 text-xs font-normal opacity-70">← Current</span>}
              </p>
              <p className="text-xs text-muted-foreground">{step.desc}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: session, isPending } = authClient.useSession()
  const [order, setOrder] = useState<Order | null | undefined>(undefined)
  const [cancelling, setCancelling] = useState(false)

  useEffect(() => {
    if (!session?.user) return
    orderService.getById(id).then(setOrder)
  }, [id, session?.user])

  const handleCancel = async () => {
    if (!order) return
    setCancelling(true)
    try {
      await orderService.cancel(order.id)
      setOrder({ ...order, status: "CANCELLED" })
      toast.success("Order cancelled")
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setCancelling(false)
    }
  }

  if (isPending || order === undefined) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="mb-4 text-muted-foreground">Order not found.</p>
        <Button asChild><Link href="/orders">My Orders</Link></Button>
      </div>
    )
  }

  const subtotal = order.items.reduce((s, i) => s + parseFloat(i.subtotal), 0)
  const total = parseFloat(order.total)
  const delivery = total - subtotal

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Back */}
      <Button asChild variant="ghost" size="sm" className="mb-6 gap-1.5 -ml-2">
        <Link href="/orders">
          <ChevronLeft className="size-4" /> My Orders
        </Link>
      </Button>

      {/* Header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Order Details</h1>
          <p className="mt-1 font-mono text-sm text-muted-foreground">{order.orderNumber}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Placed on</p>
          <p className="text-sm font-medium">
            {new Date(order.createdAt).toLocaleDateString("en-GB", {
              day: "numeric", month: "long", year: "numeric",
            })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* ── Left: Tracking + Items ─────────────────────── */}
        <div className="space-y-6 lg:col-span-2">
          {/* Tracking timeline */}
          <div className="rounded-2xl border bg-card p-6">
            <div className="mb-4 flex items-center gap-2 font-semibold">
              <Package className="size-5 text-primary" />
              Delivery Tracking
            </div>
            <TrackingTimeline status={order.status} />
          </div>

          {/* Items */}
          <div className="rounded-2xl border bg-card p-6">
            <h2 className="mb-4 font-semibold">
              Items ({order.items.reduce((s, i) => s + i.quantity, 0)})
            </h2>
            <div className="divide-y">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-4 py-3">
                  <div className="min-w-0">
                    <Link
                      href={`/medicines/${item.medicine.slug}`}
                      className="line-clamp-1 text-sm font-medium hover:text-primary transition-colors"
                    >
                      {item.medicine.name}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      ৳{parseFloat(item.unitPrice).toFixed(2)} × {item.quantity}
                    </p>
                  </div>
                  <p className="shrink-0 font-semibold">
                    ৳{parseFloat(item.subtotal).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right: Summary + Address ───────────────────── */}
        <div className="space-y-6 lg:col-span-1">
          {/* Price summary */}
          <div className="rounded-2xl border bg-card p-6 space-y-3">
            <h2 className="font-semibold">Price Summary</h2>
            <Separator />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>৳{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery</span>
                {delivery === 0
                  ? <span className="text-primary">Free</span>
                  : <span>৳{delivery.toFixed(2)}</span>}
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment</span>
                <span>
                  {order.paymentMethod === "ONLINE" ? "Online" : "Cash on Delivery"}
                  {order.paymentMethod === "ONLINE" && (
                    <span className={`ml-1.5 text-xs font-medium ${
                      order.paymentStatus === "PAID"   ? "text-green-600 dark:text-green-400"
                    : order.paymentStatus === "FAILED" ? "text-red-600 dark:text-red-400"
                    : "text-yellow-600 dark:text-yellow-400"
                    }`}>
                      · {order.paymentStatus === "PAID" ? "Paid" : order.paymentStatus === "FAILED" ? "Failed" : "Pending"}
                    </span>
                  )}
                </span>
              </div>
            </div>
            <Separator />
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span className="text-primary">৳{total.toFixed(2)}</span>
            </div>
          </div>

          {/* Shipping address */}
          <div className="rounded-2xl border bg-card p-6 space-y-3">
            <div className="flex items-center gap-2 font-semibold">
              <MapPin className="size-4 text-primary" />
              Shipping Address
            </div>
            <Separator />
            <p className="text-sm">{order.shippingAddress}</p>
            <p className="text-sm text-muted-foreground">
              {order.shippingCity}
              {order.shippingPostalCode && `, ${order.shippingPostalCode}`}
            </p>
            {order.notes && (
              <p className="text-xs text-muted-foreground italic">Note: {order.notes}</p>
            )}
          </div>

          {/* Cancel action */}
          {order.status === "PLACED" && (
            <Button
              variant="outline"
              className="w-full border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
              disabled={cancelling}
              onClick={handleCancel}
            >
              {cancelling && <Loader2 className="mr-2 size-4 animate-spin" />}
              Cancel Order
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
