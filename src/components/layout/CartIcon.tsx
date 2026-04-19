"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { useCartStore } from "@/store/cart.store"
import { authClient } from "@/lib/auth-client"
import { ROLE } from "@/constants/role"

export function CartIcon() {
  const [mounted, setMounted] = useState(false)
  const items = useCartStore((state) => state.items)
  const { data: session } = authClient.useSession()

  useEffect(() => setMounted(true), [])

  const role = (session?.user as any)?.role as string | undefined

  // Hide cart for admins only
  if (role === ROLE.admin) return null

  const count = items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <Link
      href="/cart"
      aria-label="Cart"
      className="relative flex size-9 items-center justify-center rounded-lg border transition-colors hover:bg-muted"
    >
      <ShoppingCart className="size-4" />
      {mounted && count > 0 && (
        <span className="absolute -right-1.5 -top-1.5 flex min-w-[18px] items-center justify-center rounded-full bg-primary px-1 py-px text-[10px] font-bold leading-none text-primary-foreground">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  )
}
