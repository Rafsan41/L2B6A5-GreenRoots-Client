import type { RouteGroup } from "@/app/types"

const sellerRoutes: RouteGroup[] = [
    {
        title: "Seller",
        url: "/seller-dashboard",
        items: [
            { title: "Dashboard",  url: "/seller-dashboard" },
            { title: "My Orders",  url: "/orders" },
            { title: "My Profile", url: "/profile" },
        ],
    },
]

export default sellerRoutes
