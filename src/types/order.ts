export type OrderStatus = "PLACED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED"
export type PaymentMethod = "CASH_ON_DELIVERY"

export interface OrderMedicine {
  id: string
  name: string
  image: string | null
  slug: string
}

export interface OrderItem {
  id: string
  quantity: number
  unitPrice: string
  subtotal: string
  medicineId: string
  medicine: OrderMedicine
}

export interface Order {
  id: string
  orderNumber: string
  status: OrderStatus
  total: string
  shippingAddress: string
  shippingCity: string
  shippingPostalCode: string | null
  paymentMethod: PaymentMethod
  notes: string | null
  createdAt: string
  updatedAt: string
  customerId: string
  items: OrderItem[]
}
