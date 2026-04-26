"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Loader2, MapPin, ClipboardList, Truck, CreditCard, ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { authClient } from "@/lib/auth-client"
import { useCartStore } from "@/store/cart.store"
import { orderService } from "@/services/order.service"
import { ROLE } from "@/constants/role"
import { getDashboardUrl } from "@/lib/dashboard-url"

type PaymentMethod = "CASH_ON_DELIVERY" | "ONLINE"

export default function CheckoutPage() {
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()
  const { items, clearCart } = useCartStore()

  const [mounted, setMounted]         = useState(false)
  const [placing, setPlacing]         = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CASH_ON_DELIVERY")
  const [form, setForm] = useState({ address: "", city: "", postalCode: "", notes: "" })

  useEffect(() => {
    setMounted(true)
    if (session?.user?.id) {
      try {
        const saved = localStorage.getItem(`medistore_delivery_${session.user.id}`)
        if (saved) {
          const d = JSON.parse(saved)
          setForm((f) => ({
            ...f,
            address:    [d.address, d.district].filter(Boolean).join(", ") || f.address,
            city:       d.city       || f.city,
            postalCode: d.postalCode || f.postalCode,
          }))
        }
      } catch {}
    }
  }, [session?.user?.id])

  const subtotal = items.reduce((s, i) => s + parseFloat(i.price) * i.quantity, 0)
  const delivery = subtotal >= 500 ? 0 : 50
  const total    = subtotal + delivery

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.address.trim() || !form.city.trim()) {
      toast.error("Please fill in address and city")
      return
    }
    setPlacing(true)
    try {
      const order = await orderService.create({
        items:           items.map((i) => ({ medicineId: i.medicineId, quantity: i.quantity })),
        shippingAddress: form.address,
        shippingCity:    form.city,
        shippingPostalCode: form.postalCode || undefined,
        notes:           form.notes || undefined,
        paymentMethod,
      })

      if (paymentMethod === "ONLINE") {
        // Initiate SSLCommerz session
        const res = await fetch("/api/payment/init", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId: order.id }),
        })
        const json = await res.json()
        if (!res.ok || !json.data?.gatewayUrl) throw new Error(json.message ?? "Payment initiation failed")
        // Cart is intentionally NOT cleared here — only cleared after successful payment
        window.location.href = json.data.gatewayUrl
      } else {
        clearCart()
        toast.success("Order placed successfully!")
        router.push("/orders")
      }
    } catch (err: any) {
      toast.error(err.message ?? "Failed to place order")
      setPlacing(false)
    }
  }

  if (isPending || !mounted) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!session?.user) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="mb-4 text-muted-foreground">You need to be logged in to checkout.</p>
        <Button asChild><Link href="/login">Log In</Link></Button>
      </div>
    )
  }

  const role = (session.user as any)?.role as string | undefined

  if (role === ROLE.admin) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center px-4">
        <div className="flex size-16 items-center justify-center rounded-full bg-muted">
          <ShieldAlert className="size-8 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold">Not Available for Admins</h2>
        <p className="text-sm text-muted-foreground max-w-sm">Admin accounts cannot place orders.</p>
        <Button asChild><Link href={getDashboardUrl(role)}>Go to Dashboard</Link></Button>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="mb-4 text-muted-foreground">Your cart is empty.</p>
        <Button asChild><Link href="/medicines">Browse Medicines</Link></Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-10">
      <h1 className="mb-6 md:mb-8 text-2xl font-bold">Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-3">

          {/* ── Left: Shipping + Payment ── */}
          <div className="space-y-5 md:space-y-6 lg:col-span-2">

            {/* Shipping */}
            <div className="rounded-2xl border bg-card p-5 md:p-6 space-y-5">
              <div className="flex items-center gap-2 text-base font-semibold">
                <MapPin className="size-5 text-primary" /> Shipping Address
              </div>
              <Separator />
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="address">Street Address *</Label>
                  <Input id="address" placeholder="House/Road/Area" value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })} required />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="city">City *</Label>
                    <Input id="city" placeholder="e.g. Dhaka" value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })} required />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input id="postalCode" placeholder="e.g. 1200" value={form.postalCode}
                      onChange={(e) => setForm({ ...form, postalCode: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="notes">Order Notes (optional)</Label>
                  <Textarea id="notes" placeholder="Any special instructions..." rows={3}
                    value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
                </div>
              </div>
            </div>

            {/* Payment method */}
            <div className="rounded-2xl border bg-card p-5 md:p-6 space-y-4">
              <div className="flex items-center gap-2 text-base font-semibold">
                <ClipboardList className="size-5 text-primary" /> Payment Method
              </div>
              <Separator />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Cash on Delivery */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("CASH_ON_DELIVERY")}
                  className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all ${
                    paymentMethod === "CASH_ON_DELIVERY"
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-border hover:border-primary/40"
                  }`}
                >
                  <Truck className="size-5 text-primary shrink-0" />
                  <div>
                    <p className="text-sm font-semibold">Cash on Delivery</p>
                    <p className="text-xs text-muted-foreground">Pay when your order arrives</p>
                  </div>
                </button>

                {/* Online Payment */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("ONLINE")}
                  className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all ${
                    paymentMethod === "ONLINE"
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-border hover:border-primary/40"
                  }`}
                >
                  <CreditCard className="size-5 text-primary shrink-0" />
                  <div>
                    <p className="text-sm font-semibold">Online Payment</p>
                    <p className="text-xs text-muted-foreground">Card, Mobile Banking via SSLCommerz</p>
                  </div>
                </button>
              </div>

              {paymentMethod === "ONLINE" && (
                <p className="text-xs text-muted-foreground rounded-lg bg-muted/50 px-3 py-2">
                  You will be redirected to SSLCommerz secure payment page after placing the order.
                </p>
              )}
            </div>
          </div>

          {/* ── Right: Summary ── */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border bg-card p-5 md:p-6 space-y-4">
              <h2 className="text-base font-semibold">Order Summary</h2>
              <Separator />

              <div className="space-y-3 max-h-60 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.medicineId} className="flex justify-between text-sm">
                    <span className="line-clamp-1 flex-1 text-muted-foreground">
                      {item.name} <span className="text-foreground">×{item.quantity}</span>
                    </span>
                    <span className="ml-3 font-medium shrink-0">
                      ৳{(parseFloat(item.price) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>৳{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery</span>
                  {delivery === 0
                    ? <span className="text-primary font-medium">Free</span>
                    : <span>৳{delivery}</span>}
                </div>
              </div>

              <Separator />

              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span className="text-primary">৳{total.toFixed(2)}</span>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={placing}>
                {placing ? (
                  <><Loader2 className="mr-2 size-4 animate-spin" />
                    {paymentMethod === "ONLINE" ? "Redirecting to payment..." : "Placing Order..."}
                  </>
                ) : paymentMethod === "ONLINE" ? "Pay Online →" : "Place Order"}
              </Button>

              <Button asChild variant="ghost" className="w-full" size="sm">
                <Link href="/cart">← Back to Cart</Link>
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
