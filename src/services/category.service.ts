import { AUTH_BASE_URL } from "@/lib/auth-client"
import type { Category } from "@/types/category"

const BASE = `${AUTH_BASE_URL}/api`

export const categoryService = {
  getAll: async (): Promise<Category[]> => {
    try {
      const res = await fetch(`${BASE}/categories`, { cache: "no-store" })
      if (!res.ok) return []
      const json = await res.json()
      return (json.data ?? []) as Category[]
    } catch {
      return []
    }
  },
}
