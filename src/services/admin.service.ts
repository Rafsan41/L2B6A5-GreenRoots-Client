const BASE = `${process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:5000"}/api`

export type UserStatus = "ACTIVE" | "BANNED" | "PENDING" | "SUSPENDED"
export type UserRole   = "ADMIN" | "SELLER" | "CUSTOMER"
export type OrderStatus = "PLACED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED"

export interface AdminUser {
  id: string
  name: string
  email: string
  role: UserRole
  status: UserStatus
  image: string | null
  createdAt: string
}

export interface AdminMedicine {
  id: string
  name: string
  slug: string
  price: string
  stock: number
  isActive: boolean
  manufacturer: string
  form: string | null
  prescriptionRequired: boolean
  createdAt: string
  category: { id: string; name: string; slug: string }
  seller: { id: string; name: string; email: string }
}

export interface AdminOrderItem {
  id: string
  quantity: number
  unitPrice: string
  subtotal: string
  medicine: { id: string; name: string; seller: { id: string; name: string } }
}

export interface AdminOrder {
  id: string
  orderNumber: string
  status: OrderStatus
  total: string
  shippingAddress: string
  shippingCity: string
  shippingPostalCode: string | null
  paymentMethod: string
  createdAt: string
  customer: { id: string; name: string; email: string; role: string }
  items: AdminOrderItem[]
}

export interface AdminCategory {
  id: string
  name: string
  slug: string
  description: string | null
  image: string | null
}

export interface AdminStats {
  users: {
    totalUsers: number
    totalCustomers: number
    totalBannedCustomers: number
  }
  sellers: {
    totalSellers: number
    totalApprovedSellers: number
    totalPendingSellers: number
    totalRejectedSellers: number
    totalSuspendedSellers: number
    salesBySeller: { sellerId: string; sellerName: string; totalOrders: number; totalRevenue: number }[]
  }
  medicines: { totalMedicines: number; totalCategories: number }
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

export const adminService = {
  getStats:      () => apiFetch<AdminStats>("/admin/statistics"),
  getUsers:      () => apiFetch<AdminUser[]>("/admin/users"),
  updateUserStatus: (id: string, status: UserStatus) =>
    apiFetch(`/admin/users/${id}`, { method: "PATCH", body: JSON.stringify({ status }) }),

  getMedicines:  () => apiFetch<AdminMedicine[]>("/admin/medicines"),
  toggleMedicine:(id: string) =>
    apiFetch(`/admin/medicines/${id}/toggle`, { method: "PATCH" }),

  getOrders:     () => apiFetch<AdminOrder[]>("/admin/orders"),
  updateOrderStatus: (id: string, status: OrderStatus) =>
    apiFetch(`/admin/orders/${id}`, { method: "PATCH", body: JSON.stringify({ status }) }),

  getCategories: () =>
    fetch(`${BASE}/categories`, { credentials: "include" })
      .then((r) => r.json()).then((j) => (j.data ?? []) as AdminCategory[]),
  createCategory:(data: { name: string; slug: string; description?: string }) =>
    apiFetch<AdminCategory>("/categories", { method: "POST", body: JSON.stringify(data) }),
  updateCategory:(id: string, data: { name?: string; slug?: string; description?: string }) =>
    apiFetch<AdminCategory>(`/admin/categories/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteCategory:(id: string) =>
    apiFetch(`/admin/categories/${id}`, { method: "DELETE" }),
}
