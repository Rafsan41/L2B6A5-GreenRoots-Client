import { NextRequest, NextResponse } from "next/server"
import { userService } from "./services/user.service"
import { ROLE } from "./constants/role"

export async function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname

    // Pass raw cookie header — next/headers cookies() is not available in middleware/Edge
    const cookieHeader = request.headers.get("cookie") ?? ""
    const { data } = await userService.getSession(cookieHeader)

    const isAuthenticated = !!data?.user
    const role = (data?.user?.role as string | undefined)?.toUpperCase()
    const isAdmin    = role === ROLE.admin
    const isSeller   = role === ROLE.seller
    const isCustomer = role === ROLE.customer

    const isAuthRoute = pathname === "/login" || pathname === "/register"

    // Not logged in → protect dashboard routes
    if (!isAuthenticated && !isAuthRoute) {
        return NextResponse.redirect(new URL("/login", request.url))
    }

    // Already logged in → skip login / register, go straight to their landing page
    if (isAuthenticated && isAuthRoute) {
        if (isAdmin)   return NextResponse.redirect(new URL("/admin-dashboard", request.url))
        if (isSeller)  return NextResponse.redirect(new URL("/seller-dashboard", request.url))
        return NextResponse.redirect(new URL("/home", request.url))
    }

    // Admin trying to access non-admin pages → send to admin dashboard
    const adminOnlyAllowedPrefixes = ["/admin-dashboard"]
    const customerSellerOnlyPrefixes = ["/dashboard", "/seller-dashboard", "/cart", "/checkout"]
    if (isAdmin && customerSellerOnlyPrefixes.some(p => pathname.startsWith(p))) {
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
        "/orders/:path*",
        "/orders",
        "/profile/:path*",
        "/profile",
        "/cart",
        "/checkout",
        "/login",
        "/register",
    ],
}
