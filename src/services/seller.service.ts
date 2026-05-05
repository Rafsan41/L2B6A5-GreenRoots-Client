const BASE = `${process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:5000"}/api`

export type SellerOrderStatus = "PLACED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED"

export interface SellerOrderItem {
  id: string
  quantity: number
  unitPrice: string
  subtotal: string
  medicineId: string
  medicine: { id: string; name: string; image: string | null; sellerId: string }
}

export interface SellerOrderEntry {
  id: string
  status: SellerOrderStatus
  createdAt: string
  orderId: string
  sellerId: string
  order: {
    id: string
    orderNumber: string
    status: SellerOrderStatus
    total: string
    shippingAddress: string
    shippingCity: string
    shippingPostalCode: string | null
    paymentMethod: string
    notes: string | null
    createdAt: string
    customer: { id: string; name: string; email: string }
    items: SellerOrderItem[]
  }
}

export interface SellerMedicine {
  id: string
  name: string
  slug: string
  description: string
  price: string
  stock: number
  image: string | null
  manufacturer: string
  dosage: string | null
  form: string | null
  prescriptionRequired: boolean
  isActive: boolean
  isFeatured: boolean
  categoryId: string
  category: { id: string; name: string; slug: string }
  createdAt: string
}

export interface DashboardStats {
  orders: {
    totalPlaced: number
    totalProcessing: number
    totalShipped: number
    totalDelivered: number
    totalCancelled: number
  }
  sales: { totalSales: number }
  medicines: {
    totalCategories: number
    totalMedicines: number
    totalStock: number
    stockByCategory: { category: string; totalStock: number; medicineCount: number }[]
  }
  reviews: {
    totalMedicineReviews: number
    sellerRating: number
    totalSellerReviews: number
    sellerReviews: SellerReview[]
  }
  customers: { totalCustomers: number }
}

export interface SellerReview {
  id: string
  rating: number
  comment: string | null
  createdAt: string
  customer: { id: string; name: string; image: string | null }
  replies: SellerReview[]
}

export interface MedicineReviewEntry {
  customerId: string
  customerName: string
  customerImage: string | null
  medicineId: string
  medicineName: string
  comment: string | null
  rating: number
  createdAt: string
  replies: any[]
}

export interface MedicineFormData {
  name: string
  slug: string
  description: string
  price: number
  stock: number
  manufacturer: string
  categoryId: string
  form?: string
  dosage?: string
  prescriptionRequired?: boolean
  isFeatured?: boolean
  keyBadges?: string[]
  uses?: string[]
  ingredients?: string
  sideEffects?: string[]
  storage?: string
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...init?.headers },
  })
  const json = await res.json()
  if (!json.success) throw new Error(json.message ?? "Request failed")
  return json.data
}

export const sellerService = {
  // Orders
  getOrders: () => apiFetch<SellerOrderEntry[]>("/seller/orders"),
  updateOrderStatus: (orderId: string, status: SellerOrderStatus) =>
    apiFetch(`/seller/orders/${orderId}`, { method: "PATCH", body: JSON.stringify({ status }) }),

  // Stats
  getDashboardStats: () => apiFetch<DashboardStats>("/seller/dashboard-stats"),
  getCustomerStats: () =>
    apiFetch<{
      medicineReviewsPerCustomer: MedicineReviewEntry[]
      sellerReviewsPerCustomer: any[]
      ordersPerMedicine: { medicineId: string; medicineName: string; totalOrders: number }[]
      ordersPerCategory: { categoryId: string; categoryName: string; totalOrders: number }[]
    }>("/seller/customer-stats"),

  // Medicines
  getMedicines: () => apiFetch<SellerMedicine[]>("/seller/medicines"),
  createMedicine: (data: MedicineFormData) =>
    apiFetch<SellerMedicine>("/seller/medicines", { method: "POST", body: JSON.stringify(data) }),
  updateMedicine: (id: string, data: Partial<MedicineFormData> & { stock?: number }) =>
    apiFetch<SellerMedicine>(`/seller/medicines/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteMedicine: (id: string) =>
    apiFetch(`/seller/medicines/${id}`, { method: "DELETE" }),
}
