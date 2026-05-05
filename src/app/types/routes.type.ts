import type { LucideIcon } from "lucide-react"

export type RoleName = "Admin" | "Seller" | "Customer"

export type RouteItem = {
  title: string
  url: string
  icon?: LucideIcon
  items?: RouteItem[]
}

export type RouteGroup = {
  title: string
  url: string
  items?: RouteItem[]
}
