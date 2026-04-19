export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image: string | null
  _count: { medicines: number }
}
