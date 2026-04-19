"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Pill } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import adminRoutes from "@/app/routes/adminRoutes"
import sellerRoutes from "@/app/routes/sellerRoutes"
import customerRoutes from "@/app/routes/customerRoutes"
import type { RouteGroup } from "@/app/types"

export function AppSidebar({
  admin,
  ...props
}: {
  admin: { role: string }
  seller: { role: string }
  customer: { role: string }
} & React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  const roleLower = admin.role?.toLowerCase()
  let routes: RouteGroup[] = []
  if (roleLower === "admin")    routes = adminRoutes
  else if (roleLower === "seller")   routes = sellerRoutes
  else if (roleLower === "customer") routes = customerRoutes

  const isActive = (url: string) => pathname === url

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <Link
          href="/"
          className="mx-2 my-3 flex items-center gap-2 rounded-lg border bg-primary/10 px-3 py-2.5 text-lg font-bold text-foreground transition-colors hover:bg-primary/15 hover:text-primary"
        >
          <Pill className="size-5 text-primary" />
          <span className="tracking-tight">MediStore</span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {routes.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items?.map((item) => {
                  const hasChildren = item.items && item.items.length > 0

                  if (hasChildren) {
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          asChild
                          isActive={isActive(item.url)}
                          className="font-medium"
                        >
                          <Link href={item.url}>{item.title}</Link>
                        </SidebarMenuButton>
                        <SidebarMenuSub>
                          {item.items!.map((child) => (
                            <SidebarMenuSubItem key={child.title}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={isActive(child.url)}
                              >
                                <Link href={child.url}>{child.title}</Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </SidebarMenuItem>
                    )
                  }

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive(item.url)}
                      >
                        <Link href={item.url}>{item.title}</Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  )
}
