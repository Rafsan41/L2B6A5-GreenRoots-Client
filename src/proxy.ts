import { NextRequest, NextResponse } from "next/server"
import { userService } from "./services/user.service"
import { ROLE } from "./constants/role"

export async function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname

    // Pass raw cookie header — next/headers cookies() is not available in middleware/Edge
    const cookieHeader = request.headers.get("cookie") ?? ""
    const { data } = await userService.getSession(cookieHeader)

    const isAuthenticated = !!data?.user
    const isAdmin = data?.user?.role === ROLE.admin
    const isSeller = data?.user?.role === ROLE.seller
    const isCustomer = data?.user?.role === ROLE.customer

    // Not logged in → redirect to login
    if (!isAuthenticated) {
        return NextResponse.redirect(new URL("/login", request.url))
    }

    // Admin trying to access non-admin pages → send to admin dashboard
    if (isAdmin && (pathname.startsWith("/dashboard") || pathname.startsWith("/seller-dashboard"))) {
        return NextResponse.redirect(new URL("/admin-dashboard", request.url))
    }

    // Seller trying to access non-seller pages → send to seller dashboard
    if (isSeller && (pathname.startsWith("/admin-dashboard") || pathname.startsWith("/dashboard"))) {
        return NextResponse.redirect(new URL("/seller-dashboard", request.url))
    }

    // Regular user trying to access admin or seller pages → send to home
    if (
        isCustomer &&
        (pathname.startsWith("/admin-dashboard") || pathname.startsWith("/seller-dashboard"))
    ) {
        return NextResponse.redirect(new URL("/home", request.url))
    }

    console.log("proxy passed:", pathname)
    return NextResponse.next()
}

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/admin-dashboard/:path*",
        "/seller-dashboard/:path*",
    ],
}
