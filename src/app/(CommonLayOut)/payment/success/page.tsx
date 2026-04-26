"use client"

import { Suspense, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { CheckCircle2, Loader2 } from "lucide-react"
import { useCartStore } from "@/store/cart.store"

function SuccessContent() {
  const params    = useSearchParams()
  const orderId   = params.get("orderId")
  const router    = useRouter()
  const clearCart = useCartStore((s) => s.clearCart)

  useEffect(() => {
    clearCart()
    const dest = orderId ? `/orders/${orderId}` : "/orders"
    const timer = setTimeout(() => router.replace(dest), 2000)
    return () => clearTimeout(timer)
  }, [clearCart, orderId, router])

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="flex size-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
        <CheckCircle2 className="size-10 text-green-600 dark:text-green-400" />
      </div>
      <div>
        <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
        <p className="text-muted-foreground max-w-sm">
          Your payment has been confirmed. Redirecting you to your order…
        </p>
      </div>
      <Loader2 className="size-6 animate-spin text-primary" />
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  )
}
