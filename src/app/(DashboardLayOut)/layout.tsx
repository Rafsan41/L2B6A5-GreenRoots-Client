"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Loader2, LayoutDashboard, User, LogOut, ChevronDown } from "lucide-react"

import { AppSidebar } from "@/components/app-sidebar"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
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

function getInitials(name?: string | null) {
    if (!name) return "?"
    return name
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
}

function getDashboardUrl(role?: string) {
    const r = role?.toUpperCase()
    if (r === ROLE.admin)  return "/admin-dashboard"
    if (r === ROLE.seller) return "/seller-dashboard"
    return "/dashboard"
}

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
                    <Avatar className="size-8 cursor-pointer">
                        <AvatarImage src={image ?? ""} alt={name ?? "User"} />
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
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

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { data: session, isPending } = authClient.useSession()
    const role = (session?.user as any)?.role as string | undefined

    const userInfo = { role: role ?? "" }

    if (isPending) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="size-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <SidebarProvider>
            <AppSidebar admin={userInfo} seller={userInfo} customer={userInfo} />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator
                        orientation="vertical"
                        className="mr-2 data-vertical:h-4 data-vertical:self-auto"
                    />
                    <Breadcrumb className="flex-1">
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbPage className="capitalize">
                                    {role?.toLowerCase() ?? "Dashboard"}
                                </BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    {/* Profile dropdown — right side of header */}
                    <DashboardUserMenu role={role} />
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
