import type { RouteGroup } from "@/app/types"

const adminRoutes: RouteGroup[] = [
    {
        title: "Admin",
        url: "/admin-dashboard",
        items: [
            { title: "Dashboard", url: "/admin-dashboard" },
            { title: "My Profile", url: "/profile" },
        ],
    },
]

export default adminRoutes
