import { LayoutDashboard, ShoppingCart, UserCircle, Settings, HelpCircle } from "lucide-react"
import type { RouteGroup } from "@/app/types"

const customerRoutes: RouteGroup[] = [
  {
    title: "Overview",
    url: "/dashboard",
    items: [
      { title: "Dashboard",  url: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    title: "Shopping",
    url: "/dashboard",
    items: [
      { title: "My Orders",  url: "/orders",    icon: ShoppingCart },
    ],
  },
  {
    title: "Account",
    url: "/dashboard",
    items: [
      { title: "My Profile", url: "/profile",   icon: UserCircle },
      { title: "Settings",   url: "/settings",  icon: Settings },
      { title: "Support",    url: "/contact",   icon: HelpCircle },
    ],
  },
]

export default customerRoutes
