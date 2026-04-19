import type { RouteGroup } from "@/app/types"

const customerRoutes: RouteGroup[] = [
    {
        title: "Customer",
        url: "/dashboard",
        items: [
            { title: "Dashboard", url: "/dashboard" },
            { title: "My Orders", url: "/orders" },
            { title: "My Profile", url: "/profile" },
        ],
    },
]

export default customerRoutes
