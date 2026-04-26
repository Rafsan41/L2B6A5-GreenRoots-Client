"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

function CancelContent() {
  const params  = useSearchParams()
  const orderId = params.get("orderId")

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="flex size-20 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/30">
        <AlertCircle className="size-10 text-yellow-600 dark:text-yellow-400" />
      </div>
      <div>
        <h1 className="text-2xl font-bold mb-2">Payment Cancelled</h1>
        <p className="text-muted-foreground max-w-sm">
          You cancelled the payment. Your order has been saved — you can retry payment or cancel the order.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        {orderId && (
          <Button asChild>
            <Link href={`/orders/${orderId}`}>View Order</Link>
          </Button>
        )}
        <Button asChild variant="outline">
          <Link href="/orders">My Orders</Link>
        </Button>
      </div>
    </div>
  )
}

export default function PaymentCancelPage() {
  return (
    <Suspense>
      <CancelContent />
    </Suspense>
  )
}
