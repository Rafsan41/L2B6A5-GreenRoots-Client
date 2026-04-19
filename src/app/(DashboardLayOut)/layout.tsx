"use client"

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
import { authClient } from "@/lib/auth-client"
import { ROLE } from "@/constants/role"
import { Loader2 } from "lucide-react"

export default function DashboardLayout({
    admin,
    customer,
    seller,
}: {
    admin: React.ReactNode
    customer: React.ReactNode
    seller: React.ReactNode
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
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbPage className="capitalize">
                                    {role?.toLowerCase() ?? "Dashboard"}
                                </BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4">
                    {role === ROLE.admin
                        ? admin
                        : role === ROLE.customer
                        ? customer
                        : seller}
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
