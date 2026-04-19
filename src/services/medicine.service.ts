import { AUTH_BASE_URL } from "@/lib/auth-client"
import type { Medicine } from "@/types/medicine"

const BASE = `${AUTH_BASE_URL}/api`

// Backend wraps every response in { success, data }
interface ApiResponse<T> {
  success: boolean
  data: T
}

async function safeFetch<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, { cache: "no-store" })
    if (!res.ok) return null
    const json: ApiResponse<T> = await res.json()
    return json.data ?? null
  } catch {
    return null
  }
}

export const medicineService = {
  // GET /medicines  →  { data: { medicines: [], total, page, limit } }
  getAll: async (): Promise<Medicine[]> => {
    const data = await safeFetch<{ medicines: Medicine[] }>(`${BASE}/medicines?limit=100`)
    return data?.medicines?.filter((m) => m.isActive) ?? []
  },

  // GET /medicines/slug/:slug  →  { data: Medicine }
  getBySlug: async (slug: string): Promise<Medicine | null> => {
    return safeFetch<Medicine>(`${BASE}/medicines/slug/${slug}`)
  },

  // GET /medicines/:id  →  { data: Medicine }
  getById: async (id: string): Promise<Medicine | null> => {
    return safeFetch<Medicine>(`${BASE}/medicines/${id}`)
  },

  // GET /medicines?featured=true&limit=8
  getFeatured: async (): Promise<Medicine[]> => {
    const data = await safeFetch<{ medicines: Medicine[] }>(`${BASE}/medicines?featured=true&limit=8`)
    return data?.medicines?.filter((m) => m.isActive) ?? []
  },

  // GET /medicines?category=:categoryId  →  { data: { medicines: [] } }
  getByCategory: async (categoryId: string, excludeSlug?: string): Promise<Medicine[]> => {
    const data = await safeFetch<{ medicines: Medicine[] }>(
      `${BASE}/medicines?category=${categoryId}&limit=5`
    )
    return (data?.medicines ?? [])
      .filter((m) => m.isActive && m.slug !== excludeSlug)
      .slice(0, 4)
  },
}
