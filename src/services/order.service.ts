import type { Order } from "@/types/order"

const BASE = `${process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:5000"}/api`

interface CreateOrderPayload {
  items: { medicineId: string; quantity: number }[]
  shippingAddress: string
  shippingCity: string
  shippingPostalCode?: string
  notes?: string
  paymentMethod?: "CASH_ON_DELIVERY" | "ONLINE"
}

export const orderService = {
  create: async (data: CreateOrderPayload): Promise<Order> => {
    const res = await fetch(`${BASE}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    })
    const json = await res.json()
    if (!json.success) throw new Error(json.message ?? "Failed to place order")
    return json.data
  },

  getMyOrders: async (): Promise<Order[]> => {
    const res = await fetch(`${BASE}/orders`, {
      credentials: "include",
      cache: "no-store",
    })
    const json = await res.json()
    if (!res.ok) throw new Error(json.message ?? "Failed to fetch orders")
    return json.data ?? []
  },

  getById: async (id: string): Promise<Order | null> => {
    const res = await fetch(`${BASE}/orders/${id}`, {
      credentials: "include",
      cache: "no-store",
    })
    if (!res.ok) return null
    const json = await res.json()
    return json.data ?? null
  },

  cancel: async (id: string): Promise<void> => {
    const res = await fetch(`${BASE}/orders/${id}/cancel`, {
      method: "PATCH",
      credentials: "include",
    })
    const json = await res.json()
    if (!json.success) throw new Error(json.message ?? "Failed to cancel order")
  },
}
