import type { Category } from "@/types/category"

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:5000"

export const categoryService = {
  getAll: async (): Promise<Category[]> => {
    try {
      const res = await fetch(`${BACKEND}/api/categories`, { cache: "no-store" })
      if (!res.ok) return []
      const json = await res.json()
      return (json.data ?? []) as Category[]
    } catch {
      return []
    }
  },
}
