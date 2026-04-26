"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Loader2, MapPin, ClipboardList, Truck, ShieldAlert } from "lucide-react"
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

export default function CheckoutPage() {
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()
  const { items, clearCart } = useCartStore()

  const [mounted, setMounted] = useState(false)
  const [placing, setPlacing] = useState(false)
  const [form, setForm] = useState({
    address: "",
    city: "",
    postalCode: "",
    notes: "",
  })

  useEffect(() => {
    setMounted(true)
    if (session?.user?.id) {
      try {
        const saved = localStorage.getItem(`medistore_delivery_${session.user.id}`)
        if (saved) {
          const d = JSON.parse(saved)
          setForm((f) => ({
            ...f,
            address: [d.address, d.district].filter(Boolean).join(", ") || f.address,
            city: d.city || f.city,
            postalCode: d.postalCode || f.postalCode,
          }))
        }
      } catch {}
    }
  }, [session?.user?.id])

  const subtotal = items.reduce((s, i) => s + parseFloat(i.price) * i.quantity, 0)
  const delivery = subtotal >= 500 ? 0 : 50
  const total = subtotal + delivery

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.address.trim() || !form.city.trim()) {
      toast.error("Please fill in address and city")
      return
    }
    setPlacing(true)
    try {
      await orderService.create({
        items: items.map((i) => ({ medicineId: i.medicineId, quantity: i.quantity })),
        shippingAddress: form.address,
        shippingCity: form.city,
        shippingPostalCode: form.postalCode || undefined,
        notes: form.notes || undefined,
      })
      clearCart()
      toast.success("Order placed successfully!")
      router.push("/orders")
    } catch (err: any) {
      toast.error(err.message ?? "Failed to place order")
    } finally {
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

  // Not logged in
  if (!session?.user) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="mb-4 text-muted-foreground">You need to be logged in to checkout.</p>
        <Button asChild><Link href="/login">Log In</Link></Button>
      </div>
    )
  }

  const role = (session.user as any)?.role as string | undefined

  // Admins shouldn't be placing orders
  if (role === ROLE.admin) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center px-4">
        <div className="flex size-16 items-center justify-center rounded-full bg-muted">
          <ShieldAlert className="size-8 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold">Not Available for Admins</h2>
        <p className="text-sm text-muted-foreground max-w-sm">
          Admin accounts cannot place orders.
        </p>
        <Button asChild><Link href={getDashboardUrl(role)}>Go to Dashboard</Link></Button>
      </div>
    )
  }

  // Empty cart
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
          {/* ── Shipping form ────────────────────────────── */}
          <div className="space-y-5 md:space-y-6 lg:col-span-2">
            <div className="rounded-2xl border bg-card p-5 md:p-6 space-y-5">
              <div className="flex items-center gap-2 text-base font-semibold">
                <MapPin className="size-5 text-primary" />
                Shipping Address
              </div>
              <Separator />

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="address">Street Address *</Label>
                  <Input
                    id="address"
                    placeholder="House/Road/Area"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      placeholder="e.g. Dhaka"
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input
                      id="postalCode"
                      placeholder="e.g. 1200"
                      value={form.postalCode}
                      onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="notes">Order Notes (optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any special instructions for delivery..."
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Payment method */}
            <div className="rounded-2xl border bg-card p-5 md:p-6 space-y-4">
              <div className="flex items-center gap-2 text-base font-semibold">
                <ClipboardList className="size-5 text-primary" />
                Payment Method
              </div>
              <Separator />
              <div className="flex items-center gap-3 rounded-xl border border-primary/40 bg-primary/5 px-4 py-3">
                <Truck className="size-5 text-primary shrink-0" />
                <div>
                  <p className="text-sm font-semibold">Cash on Delivery</p>
                  <p className="text-xs text-muted-foreground">Pay when your order arrives</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Order summary ────────────────────────────── */}
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
                {placing
                  ? <><Loader2 className="mr-2 size-4 animate-spin" />Placing Order...</>
                  : "Place Order"}
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
