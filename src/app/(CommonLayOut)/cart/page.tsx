"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  ShoppingCart, Minus, Plus, Trash2, Pill, FlaskConical,
  Droplets, Wind, Package, ArrowRight, ShoppingBag, ShieldAlert,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { useCartStore, type CartItem } from "@/store/cart.store"
import { authClient } from "@/lib/auth-client"
import { ROLE } from "@/constants/role"
import { getDashboardUrl } from "@/lib/dashboard-url"

// ── Form placeholder ──────────────────────────────────────
const formIconMap: Record<string, React.ElementType> = {
  Tablet: Pill, Capsule: Pill, Syrup: FlaskConical,
  Cream: Droplets, Drops: Droplets, Spray: Wind,
}
const formGradientMap: Record<string, string> = {
  Tablet: "from-primary/15 to-primary/5",
  Capsule: "from-primary/15 to-blue-500/5",
  Syrup: "from-orange-400/15 to-primary/5",
  Cream: "from-pink-400/10 to-primary/5",
  Drops: "from-cyan-400/10 to-primary/5",
  Spray: "from-sky-400/10 to-primary/5",
}
function ItemPlaceholder({ form }: { form: string | null }) {
  const Icon = form ? (formIconMap[form] ?? Package) : Package
  const gradient = form ? (formGradientMap[form] ?? "from-primary/15 to-primary/5") : "from-muted to-muted/50"
  return (
    <div className={`flex size-full items-center justify-center bg-gradient-to-br ${gradient}`}>
      <Icon className="size-8 text-primary/40" strokeWidth={1.2} />
    </div>
  )
}

// ── Cart item row ─────────────────────────────────────────
function CartRow({ item }: { item: CartItem }) {
  const { removeItem, updateQty } = useCartStore()
  const unitPrice = parseFloat(item.price)

  return (
    <div className="flex gap-4 py-5">
      <Link href={`/medicines/${item.slug}`} className="shrink-0 size-20 overflow-hidden rounded-xl border bg-muted">
        <ItemPlaceholder form={item.form} />
      </Link>

      <div className="flex flex-1 flex-col gap-1 min-w-0">
        <Link href={`/medicines/${item.slug}`} className="line-clamp-1 font-semibold hover:text-primary transition-colors">
          {item.name}
        </Link>
        {item.form && <Badge variant="secondary" className="w-fit text-xs">{item.form}</Badge>}
        <p className="text-sm text-primary font-semibold mt-auto">
          ৳{unitPrice.toFixed(2)} <span className="text-muted-foreground font-normal">/ unit</span>
        </p>
      </div>

      <div className="flex flex-col items-end gap-2 shrink-0">
        <div className="flex items-center gap-1 rounded-lg border p-1">
          <Button variant="ghost" size="icon" className="size-7"
            disabled={item.quantity <= 1}
            onClick={() => updateQty(item.medicineId, item.quantity - 1)}>
            <Minus className="size-3" />
          </Button>
          <span className="min-w-6 text-center text-sm font-semibold">{item.quantity}</span>
          <Button variant="ghost" size="icon" className="size-7"
            disabled={item.quantity >= item.stock}
            onClick={() => updateQty(item.medicineId, item.quantity + 1)}>
            <Plus className="size-3" />
          </Button>
        </div>
        <p className="text-base font-bold">৳{(unitPrice * item.quantity).toFixed(2)}</p>
        <Button variant="ghost" size="icon" className="size-7 text-muted-foreground hover:text-destructive"
          onClick={() => { removeItem(item.medicineId); toast(`${item.name} removed`) }}>
          <Trash2 className="size-4" />
        </Button>
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────
export default function CartPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const { items, clearCart } = useCartStore()
  const { data: session, isPending } = authClient.useSession()

  useEffect(() => setMounted(true), [])

  if (!mounted || isPending) return null

  const role = (session?.user as any)?.role as string | undefined

  // Only admins cannot use the cart
  if (role && role === ROLE.admin) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center px-4">
        <div className="flex size-16 items-center justify-center rounded-full bg-muted">
          <ShieldAlert className="size-8 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold">Not Available</h2>
        <p className="text-sm text-muted-foreground max-w-sm">
          The cart is not available for admin accounts.
        </p>
        <Button asChild><Link href={getDashboardUrl(role)}>Go to Dashboard</Link></Button>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-10">
        <h1 className="mb-6 text-2xl font-bold">My Cart</h1>
        <div className="flex flex-col items-center justify-center gap-5 py-24 text-center">
          <div className="flex size-20 items-center justify-center rounded-full bg-muted">
            <ShoppingCart className="size-9 text-muted-foreground" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Your cart is empty</h2>
            <p className="mt-1 text-sm text-muted-foreground">Browse medicines and add items to your cart</p>
          </div>
          <Button asChild className="gap-2">
            <Link href="/medicines"><ShoppingBag className="size-4" />Browse Medicines</Link>
          </Button>
        </div>
      </div>
    )
  }

  const subtotal = items.reduce((sum, i) => sum + parseFloat(i.price) * i.quantity, 0)
  const delivery = subtotal >= 500 ? 0 : 50
  const total = subtotal + delivery
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          My Cart <span className="text-base font-normal text-muted-foreground">({totalItems} item{totalItems > 1 ? "s" : ""})</span>
        </h1>
        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive"
          onClick={() => { clearCart(); toast("Cart cleared") }}>
          <Trash2 className="mr-1.5 size-4" />Clear all
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-2xl border bg-card">
            <div className="divide-y px-5">
              {items.map((item) => <CartRow key={item.medicineId} item={item} />)}
            </div>
          </div>
          <div className="mt-4">
            <Button asChild variant="ghost" className="gap-2 text-muted-foreground">
              <Link href="/medicines">← Continue Shopping</Link>
            </Button>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl border bg-card p-6 space-y-4">
            <h2 className="text-lg font-semibold">Order Summary</h2>
            <Separator />
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal ({totalItems} item{totalItems > 1 ? "s" : ""})</span>
                <span className="font-medium">৳{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery</span>
                {delivery === 0
                  ? <span className="font-medium text-primary">Free</span>
                  : <span className="font-medium">৳{delivery}</span>}
              </div>
              {delivery > 0 && <p className="text-xs text-muted-foreground">Free delivery on orders over ৳500</p>}
            </div>
            <Separator />
            <div className="flex justify-between text-base font-bold">
              <span>Total</span>
              <span className="text-primary">৳{total.toFixed(2)}</span>
            </div>
            <Button className="w-full gap-2" size="lg" onClick={() => router.push("/checkout")}>
              Proceed to Checkout<ArrowRight className="size-4" />
            </Button>
            <p className="text-center text-xs text-muted-foreground">Cash on delivery available nationwide</p>
          </div>
        </div>
      </div>
    </div>
  )
}
