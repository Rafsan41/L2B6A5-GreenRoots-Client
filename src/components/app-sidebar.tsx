"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Leaf } from "lucide-react"
import { cn } from "@/lib/utils"

import adminRoutes    from "@/app/routes/adminRoutes"
import sellerRoutes   from "@/app/routes/sellerRoutes"
import customerRoutes from "@/app/routes/customerRoutes"
import type { RouteGroup } from "@/app/types"

// ── Sidebar width token ───────────────────────────────────────────────────────
export const SIDEBAR_WIDTH = 220

// ── Context so layout can read open state ────────────────────────────────────
export const SidebarContext = React.createContext<{
  open: boolean
  setOpen: (v: boolean) => void
}>({ open: true, setOpen: () => {} })

export function useSidebar() {
  return React.useContext(SidebarContext)
}

// ── Provider (used by layout) ─────────────────────────────────────────────────
export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(true)
  return (
    <SidebarContext.Provider value={{ open, setOpen }}>
      <div className="flex min-h-screen w-full">
        {children}
      </div>
    </SidebarContext.Provider>
  )
}

// ── Trigger button (hamburger in topbar) ──────────────────────────────────────
export function SidebarTrigger({ className }: { className?: string }) {
  const { open, setOpen } = useSidebar()
  return (
    <button
      onClick={() => setOpen(!open)}
      aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
      className={cn(
        "flex size-8 items-center justify-center rounded-md transition-colors hover:bg-muted",
        className
      )}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="2.5" width="14" height="1.5" rx="0.75" fill="currentColor" />
        <rect x="1" y="7.25" width="14" height="1.5" rx="0.75" fill="currentColor" />
        <rect x="1" y="12" width="14" height="1.5" rx="0.75" fill="currentColor" />
      </svg>
    </button>
  )
}

// ── Main sidebar ──────────────────────────────────────────────────────────────
interface AppSidebarProps {
  admin:    { role: string }
  seller?:  { role: string }
  customer?: { role: string }
}

export function AppSidebar({ admin }: AppSidebarProps) {
  const { open } = useSidebar()
  const pathname  = usePathname()

  const roleLower = admin.role?.toLowerCase()
  let routes: RouteGroup[] = []
  if (roleLower === "admin")    routes = adminRoutes
  else if (roleLower === "seller")   routes = sellerRoutes
  else if (roleLower === "customer") routes = customerRoutes

  const isActive = (url: string) => pathname === url

  return (
    <aside
      style={{
        width:          open ? SIDEBAR_WIDTH : 0,
        minWidth:       open ? SIDEBAR_WIDTH : 0,
        background:     "oklch(0.10 0.035 145)",   /* --moss-deep */
        borderRight:    "1px solid oklch(0.22 0.05 145)",
        transition:     "width 0.25s ease, min-width 0.25s ease",
        overflow:       "hidden",
        flexShrink:     0,
        display:        "flex",
        flexDirection:  "column",
        position:       "sticky",
        top:            0,
        height:         "100vh",
        zIndex:         40,
      }}
    >
      {/* ── Logo ──────────────────────────────────────────────────────── */}
      <div style={{ padding: "20px 16px 12px" }}>
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 transition-colors hover:bg-white/5"
          style={{ textDecoration: "none" }}
        >
          <span
            className="flex size-8 shrink-0 items-center justify-center rounded-md"
            style={{ background: "oklch(0.46 0.14 142)", color: "#fff" }}
          >
            <Leaf size={16} />
          </span>
          <span
            className="truncate font-semibold tracking-tight"
            style={{
              fontFamily: "var(--font-cormorant), Georgia, serif",
              fontSize:   20,
              color:      "oklch(0.95 0.02 90)",
              letterSpacing: "-0.01em",
            }}
          >
            GreenRoots
          </span>
        </Link>
      </div>

      {/* ── Nav groups ────────────────────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto" style={{ padding: "8px 10px 16px" }}>
        {routes.map((group) => (
          <div key={group.title} style={{ marginBottom: 24 }}>
            {/* Group label */}
            <p
              style={{
                fontSize:      10,
                fontWeight:    600,
                letterSpacing: "0.10em",
                textTransform: "uppercase",
                color:         "oklch(0.50 0.04 145)",
                padding:       "0 8px",
                marginBottom:  6,
              }}
            >
              {group.title}
            </p>

            {/* Items */}
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 2 }}>
              {group.items?.map((item) => {
                const active = isActive(item.url)
                const Icon   = item.icon

                return (
                  <li key={item.title}>
                    <Link
                      href={item.url}
                      style={{
                        display:        "flex",
                        alignItems:     "center",
                        gap:            10,
                        borderRadius:   8,
                        padding:        "8px 10px",
                        fontSize:       13.5,
                        fontWeight:     active ? 600 : 400,
                        color:          active
                          ? "oklch(0.96 0.02 90)"
                          : "oklch(0.68 0.04 145)",
                        background:     active
                          ? "oklch(0.40 0.12 142)"
                          : "transparent",
                        textDecoration: "none",
                        transition:     "background 0.15s ease, color 0.15s ease",
                      }}
                      className="group hover:bg-white/[0.06] hover:text-[oklch(0.88_0.04_145)]"
                    >
                      {Icon && (
                        <Icon
                          size={15}
                          style={{
                            color:    active ? "oklch(0.78 0.14 142)" : "oklch(0.55 0.06 145)",
                            flexShrink: 0,
                          }}
                        />
                      )}
                      <span className="truncate">{item.title}</span>

                      {/* Active indicator dot */}
                      {active && (
                        <span
                          className="ml-auto"
                          style={{
                            width:        6,
                            height:       6,
                            borderRadius: "50%",
                            background:   "oklch(0.72 0.16 142)",
                            flexShrink:   0,
                          }}
                        />
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* ── Bottom role badge ──────────────────────────────────────────── */}
      <div
        style={{
          padding:    "12px 16px",
          borderTop:  "1px solid oklch(0.18 0.04 145)",
        }}
      >
        <p
          style={{
            fontSize:      9,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color:         "oklch(0.40 0.04 145)",
            textAlign:     "center",
          }}
        >
          {roleLower} panel · GreenRoots
        </p>
      </div>
    </aside>
  )
}
