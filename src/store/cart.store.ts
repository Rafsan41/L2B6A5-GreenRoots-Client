import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Medicine } from "@/types/medicine"

export interface CartItem {
  medicineId: string
  name: string
  slug: string
  price: string
  form: string | null
  image: string | null
  quantity: number
  stock: number
}

interface CartStore {
  items: CartItem[]
  addItem: (medicine: Medicine, qty?: number) => void
  removeItem: (medicineId: string) => void
  updateQty: (medicineId: string, qty: number) => void
  clearCart: () => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],

      addItem: (medicine, qty = 1) =>
        set((state) => {
          const existing = state.items.find((i) => i.medicineId === medicine.id)
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.medicineId === medicine.id
                  ? { ...i, quantity: Math.min(i.quantity + qty, i.stock) }
                  : i
              ),
            }
          }
          return {
            items: [
              ...state.items,
              {
                medicineId: medicine.id,
                name: medicine.name,
                slug: medicine.slug,
                price: medicine.price,
                form: medicine.form,
                image: medicine.image,
                quantity: qty,
                stock: medicine.stock,
              },
            ],
          }
        }),

      removeItem: (medicineId) =>
        set((state) => ({
          items: state.items.filter((i) => i.medicineId !== medicineId),
        })),

      updateQty: (medicineId, qty) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.medicineId === medicineId ? { ...i, quantity: qty } : i
          ),
        })),

      clearCart: () => set({ items: [] }),
    }),
    { name: "medistore-cart" }
  )
)
