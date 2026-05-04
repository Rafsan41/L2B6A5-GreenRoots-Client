import type { RouteGroup } from "@/app/types"

const adminRoutes: RouteGroup[] = [
    {
        title: "Admin",
        url: "/admin-dashboard",
        items: [
            { title: "Dashboard",   url: "/admin-dashboard" },
            { title: "Users",       url: "/admin-dashboard/users" },
            { title: "Orders",      url: "/admin-dashboard/orders" },
            { title: "Medicines",   url: "/admin-dashboard/medicines" },
            { title: "Categories",  url: "/admin-dashboard/categories" },
            { title: "Approvals",   url: "/admin-dashboard/approvals" },
            { title: "My Profile",  url: "/profile" },
        ],
    },
]

export default adminRoutes
