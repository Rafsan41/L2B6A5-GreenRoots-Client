"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

function FailContent() {
  const params  = useSearchParams()
  const orderId = params.get("orderId")

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="flex size-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
        <XCircle className="size-10 text-red-600 dark:text-red-400" />
      </div>
      <div>
        <h1 className="text-2xl font-bold mb-2">Payment Failed</h1>
        <p className="text-muted-foreground max-w-sm">
          Your payment could not be processed. Please try again or choose Cash on Delivery.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        {orderId && (
          <Button asChild>
            <Link href={`/orders/${orderId}`}>View Order</Link>
          </Button>
        )}
        <Button asChild variant="outline">
          <Link href="/checkout">Try Again</Link>
        </Button>
      </div>
    </div>
  )
}

export default function PaymentFailPage() {
  return (
    <Suspense>
      <FailContent />
    </Suspense>
  )
}
