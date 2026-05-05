import {
  LayoutDashboard,
  BarChart2,
  Package,
  ShoppingCart,
  Users,
  UserCircle,
  Settings,
  HelpCircle,
} from "lucide-react"
import type { RouteGroup } from "@/app/types"

const sellerRoutes: RouteGroup[] = [
  {
    title: "Overview",
    url: "/seller-dashboard",
    items: [
      { title: "Dashboard",       url: "/seller-dashboard",                icon: LayoutDashboard },
      { title: "Analytics",       url: "/seller-dashboard/analytics",      icon: BarChart2 },
    ],
  },
  {
    title: "Management",
    url: "/seller-dashboard",
    items: [
      { title: "My Medicines",    url: "/seller-dashboard/medicines",      icon: Package },
      { title: "My Orders",       url: "/seller-dashboard/orders",         icon: ShoppingCart },
      { title: "Customers",       url: "/seller-dashboard/customers",      icon: Users },
    ],
  },
  {
    title: "Account",
    url: "/seller-dashboard",
    items: [
      { title: "My Profile",      url: "/profile",                         icon: UserCircle },
      { title: "Settings",        url: "/settings",                        icon: Settings },
      { title: "Support",         url: "/contact",                         icon: HelpCircle },
    ],
  },
]

export default sellerRoutes
