import {
  LayoutDashboard,
  BarChart2,
  ShieldCheck,
  Users,
  ShoppingCart,
  Package,
  Tag,
  UserCircle,
  Settings,
  HelpCircle,
} from "lucide-react"
import type { RouteGroup } from "@/app/types"

const adminRoutes: RouteGroup[] = [
  {
    title: "Overview",
    url: "/admin-dashboard",
    items: [
      { title: "Dashboard",  url: "/admin-dashboard",           icon: LayoutDashboard },
      { title: "Analytics",  url: "/admin-dashboard/analytics", icon: BarChart2 },
    ],
  },
  {
    title: "Management",
    url: "/admin-dashboard",
    items: [
      { title: "Approvals",         url: "/admin-dashboard/approvals",  icon: ShieldCheck },
      { title: "Manage Users",      url: "/admin-dashboard/users",      icon: Users },
      { title: "Manage Orders",     url: "/admin-dashboard/orders",     icon: ShoppingCart },
      { title: "Manage Medicines",  url: "/admin-dashboard/medicines",  icon: Package },
      { title: "Categories",        url: "/admin-dashboard/categories", icon: Tag },
    ],
  },
  {
    title: "Account",
    url: "/admin-dashboard",
    items: [
      { title: "My Profile", url: "/profile",  icon: UserCircle },
      { title: "Settings",   url: "/settings", icon: Settings },
      { title: "Support",    url: "/contact",  icon: HelpCircle },
    ],
  },
]

export default adminRoutes
