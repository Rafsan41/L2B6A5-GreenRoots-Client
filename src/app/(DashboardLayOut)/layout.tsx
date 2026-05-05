"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Loader2, LayoutDashboard, User, LogOut, ChevronDown } from "lucide-react"

import { AppSidebar, SidebarProvider, SidebarTrigger } from "@/components/app-sidebar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { authClient } from "@/lib/auth-client"
import { ROLE } from "@/constants/role"

// ── Helpers ───────────────────────────────────────────────────────────────────
function getInitials(name?: string | null) {
    if (!name) return "?"
    return name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
}

function getRoleAbbr(role?: string) {
    const r = role?.toUpperCase()
    if (r === "ADMIN")    return "AD"
    if (r === "SELLER")   return "SE"
    if (r === "CUSTOMER") return "CU"
    return "??"
}

function getDashboardUrl(role?: string) {
    const r = role?.toUpperCase()
    if (r === ROLE.admin)  return "/admin-dashboard"
    if (r === ROLE.seller) return "/seller-dashboard"
    return "/dashboard"
}

// ── Breadcrumb derived from pathname ──────────────────────────────────────────
function useBreadcrumb() {
    const pathname = usePathname()
    const segments = pathname.split("/").filter(Boolean)
    // e.g. ["admin-dashboard", "users"] → "Admin Dashboard  /  Users"
    return segments
        .map((s) => s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()))
        .join("  /  ")
}

// ── User dropdown ─────────────────────────────────────────────────────────────
function DashboardUserMenu({ role }: { role?: string }) {
    const router = useRouter()
    const { data: session } = authClient.useSession()

    const handleSignOut = async () => {
        await authClient.signOut()
        router.push("/login")
        router.refresh()
    }

    if (!session?.user) return null

    const { name, email, image } = session.user as {
        name?: string; email?: string; image?: string
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full outline-none ring-primary/30 transition-all hover:ring-2 focus-visible:ring-2">
                    {/* Role abbreviation badge */}
                    <span
                        className="hidden sm:flex items-center justify-center rounded-md text-xs font-bold"
                        style={{
                            width:      28,
                            height:     28,
                            background: "oklch(0.40 0.12 142)",
                            color:      "oklch(0.90 0.04 145)",
                            fontFamily: "var(--font-jetbrains-mono), monospace",
                            fontSize:   10,
                            letterSpacing: "0.05em",
                        }}
                    >
                        {getRoleAbbr(role)}
                    </span>

                    <Avatar className="size-8 cursor-pointer">
                        <AvatarImage src={image ?? ""} alt={name ?? "User"} />
                        <AvatarFallback
                            style={{
                                background: "oklch(0.46 0.14 142)",
                                color:      "#fff",
                                fontSize:   11,
                                fontWeight: 600,
                            }}
                        >
                            {getInitials(name)}
                        </AvatarFallback>
                    </Avatar>

                    <span className="hidden max-w-[120px] truncate text-sm font-medium md:block">
                        {name ?? "User"}
                    </span>
                    <ChevronDown className="hidden size-3.5 text-muted-foreground md:block" />
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                    <div className="flex items-center gap-3 py-1">
                        <Avatar className="size-8">
                            <AvatarImage src={image ?? ""} alt={name ?? "User"} />
                            <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                                {getInitials(name)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold">{name ?? "User"}</p>
                            <p className="truncate text-xs text-muted-foreground">{email}</p>
                        </div>
                    </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                    <Link href={getDashboardUrl(role)} className="cursor-pointer gap-2">
                        <LayoutDashboard className="size-4" />
                        Dashboard
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer gap-2">
                        <User className="size-4" />
                        My Profile
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    onClick={handleSignOut}
                    className="cursor-pointer gap-2 text-destructive focus:text-destructive"
                >
                    <LogOut className="size-4" />
                    Sign Out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

// ── Layout ────────────────────────────────────────────────────────────────────
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { data: session, isPending } = authClient.useSession()
    const role      = (session?.user as any)?.role as string | undefined
    const breadcrumb = useBreadcrumb()
    const userInfo   = { role: role ?? "" }

    if (isPending) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="size-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <SidebarProvider>
            {/* ── Sidebar ────────────────────────────────────────────── */}
            <AppSidebar admin={userInfo} seller={userInfo} customer={userInfo} />

            {/* ── Main area ──────────────────────────────────────────── */}
            <div className="flex flex-1 flex-col min-w-0 overflow-hidden">

                {/* Top bar */}
                <header
                    className="flex h-14 shrink-0 items-center gap-3 border-b px-4"
                    style={{ borderColor: "var(--border)" }}
                >
                    <SidebarTrigger className="-ml-1" />

                    {/* Divider */}
                    <div className="h-5 w-px bg-border" />

                    {/* Breadcrumb */}
                    <p className="flex-1 text-sm font-medium text-muted-foreground truncate">
                        {breadcrumb || "Dashboard"}
                    </p>

                    {/* User menu */}
                    <DashboardUserMenu role={role} />
                </header>

                {/* Page content */}
                <main className="flex flex-1 flex-col gap-4 p-4 md:p-6 overflow-auto">
                    {children}
                </main>
            </div>
        </SidebarProvider>
    )
}
