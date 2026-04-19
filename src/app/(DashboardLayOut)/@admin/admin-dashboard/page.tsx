"use client"

import { useEffect, useState } from "react"
import {
  Loader2, Users, ShoppingBag, Package, Tag, TrendingUp,
  Ban, CheckCircle2, Clock, UserX, Pencil, Trash2,
  Plus, FlaskConical, Star, UserCheck, Store, ChevronDown, ChevronUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts"
import { toast } from "sonner"
import {
  adminService,
  type AdminStats, type AdminUser, type AdminMedicine,
  type AdminOrder, type AdminCategory, type UserStatus, type OrderStatus,
} from "@/services/admin.service"

// ── Helpers ───────────────────────────────────────────────
const PIE_COLORS = ["#10b981","#3b82f6","#f59e0b","#8b5cf6","#ef4444","#06b6d4"]

const USER_STATUS_COLOR: Record<UserStatus, string> = {
  ACTIVE:    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  BANNED:    "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  PENDING:   "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  SUSPENDED: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
}

const ORDER_STATUS_COLOR: Record<OrderStatus, string> = {
  PLACED:     "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  PROCESSING: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  SHIPPED:    "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  DELIVERED:  "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  CANCELLED:  "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
}

function StatusChip({ status, colorMap }: { status: string; colorMap: Record<string, string> }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${colorMap[status] ?? "bg-muted text-muted-foreground"}`}>
      {status}
    </span>
  )
}

function StatCard({ icon: Icon, label, value, sub, color }: {
  icon: React.ElementType; label: string; value: string | number; sub?: string; color: string
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border bg-card p-5">
      <div className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${color}`}>
        <Icon className="size-6" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
        {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────
// OVERVIEW TAB
// ────────────────────────────────────────────────────────────
function OverviewTab({ stats }: { stats: AdminStats }) {
  const { users, sellers, medicines } = stats

  const totalOrders = sellers.salesBySeller.reduce((s, x) => s + x.totalOrders, 0)
  const totalRevenue = sellers.salesBySeller.reduce((s, x) => s + x.totalRevenue, 0)

  const sellerBarData = sellers.salesBySeller
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, 8)
    .map((s) => ({ name: s.sellerName, revenue: Math.round(s.totalRevenue), orders: s.totalOrders }))

  const sellerStatusPie = [
    { name: "Active",    value: sellers.totalApprovedSellers,  fill: "#10b981" },
    { name: "Pending",   value: sellers.totalPendingSellers,   fill: "#f59e0b" },
    { name: "Suspended", value: sellers.totalSuspendedSellers, fill: "#f97316" },
    { name: "Banned",    value: sellers.totalRejectedSellers,  fill: "#ef4444" },
  ].filter((d) => d.value > 0)

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-5">
        <StatCard icon={Users}        label="Total Users"     value={users.totalUsers}
          color="bg-blue-100 text-blue-600 dark:bg-blue-900/30" />
        <StatCard icon={Users}        label="Customers"       value={users.totalCustomers}
          sub={`${users.totalBannedCustomers} banned`}
          color="bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30" />
        <StatCard icon={ShoppingBag}  label="Sellers"          value={sellers.totalSellers}
          sub={`${sellers.totalPendingSellers} pending`}
          color="bg-purple-100 text-purple-600 dark:bg-purple-900/30" />
        <StatCard icon={FlaskConical} label="Medicines"       value={medicines.totalMedicines}
          sub={`${medicines.totalCategories} categories`}
          color="bg-green-100 text-green-600 dark:bg-green-900/30" />
        <StatCard icon={TrendingUp}   label="Total Revenue"   value={`৳${totalRevenue.toFixed(0)}`}
          sub={`${totalOrders} orders`}
          color="bg-orange-100 text-orange-600 dark:bg-orange-900/30" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Revenue by seller */}
        <div className="rounded-xl border bg-card p-5">
          <p className="mb-4 text-sm font-semibold">Revenue by Seller</p>
          {sellerBarData.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">No sales data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={sellerBarData} margin={{ top: 4, right: 8, bottom: 0, left: -16 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
                  formatter={(v) => [`৳${v}`, "Revenue"]}
                />
                <Bar dataKey="revenue" fill="#10b981" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Seller status distribution */}
        <div className="rounded-xl border bg-card p-5">
          <p className="mb-4 text-sm font-semibold">Seller Status Distribution</p>
          {sellerStatusPie.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">No sellers yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={sellerStatusPie} dataKey="value" nameKey="name"
                  cx="50%" cy="50%" outerRadius={80}
                  label={({ name, percent }) => `${name} ${((percent ?? 0)*100).toFixed(0)}%`}
                  labelLine={false}>
                  {sellerStatusPie.map((e, i) => <Cell key={i} fill={e.fill} />)}
                </Pie>
                <Tooltip
                  contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Top sellers table */}
      {sellerBarData.length > 0 && (
        <div className="rounded-xl border bg-card p-5">
          <p className="mb-3 text-sm font-semibold">Top Sellers</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr>
                  {["Seller","Total Orders","Total Revenue"].map((h) => (
                    <th key={h} className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {sellerBarData.map((s, i) => (
                  <tr key={i}>
                    <td className="px-3 py-2 font-medium">{s.name}</td>
                    <td className="px-3 py-2 text-muted-foreground">{s.orders}</td>
                    <td className="px-3 py-2 font-semibold text-primary">৳{s.revenue.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

// ────────────────────────────────────────────────────────────
// USERS TAB
// ────────────────────────────────────────────────────────────
const USER_STATUS_OPTIONS: UserStatus[] = ["ACTIVE","BANNED","PENDING","SUSPENDED"]
const ROLE_FILTERS = ["ALL","ADMIN","SELLER","CUSTOMER"] as const

function UsersTab() {
  const [users, setUsers]     = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [roleFilter, setRoleFilter] = useState<"ALL"|"ADMIN"|"SELLER"|"CUSTOMER">("ALL")
  const [search, setSearch]   = useState("")
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    adminService.getUsers()
      .then(setUsers)
      .catch(() => toast.error("Failed to load users"))
      .finally(() => setLoading(false))
  }, [])

  const handleStatusChange = async (userId: string, status: UserStatus) => {
    setUpdating(userId)
    try {
      const updated = await adminService.updateUserStatus(userId, status) as AdminUser
      setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, status: updated.status } : u))
      toast.success("User status updated")
    } catch (err: any) { toast.error(err.message) }
    finally { setUpdating(null) }
  }

  const filtered = users.filter((u) => {
    const matchRole   = roleFilter === "ALL" || u.role === roleFilter
    const matchSearch = !search || u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    return matchRole && matchSearch
  })

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="size-7 animate-spin text-primary" /></div>

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <Input placeholder="Search by name or email…" value={search}
          onChange={(e) => setSearch(e.target.value)} className="h-8 max-w-xs text-sm" />
        <div className="flex gap-1.5">
          {ROLE_FILTERS.map((r) => (
            <button key={r} onClick={() => setRoleFilter(r)}
              className={`rounded-full px-3 py-1 text-xs font-semibold border transition-colors ${
                roleFilter === r ? "bg-primary text-primary-foreground border-primary"
                  : "bg-muted text-muted-foreground border-transparent"
              }`}>
              {r}
            </button>
          ))}
        </div>
        <span className="text-xs text-muted-foreground ml-auto">{filtered.length} users</span>
      </div>

      <div className="rounded-xl border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/30">
              <tr>
                {["User","Role","Status","Joined","Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((user) => (
                <tr key={user.id}>
                  <td className="px-4 py-3">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className="text-xs">{user.role}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <StatusChip status={user.status} colorMap={USER_STATUS_COLOR} />
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString("en-GB", { day:"numeric", month:"short", year:"numeric" })}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={user.status}
                      disabled={updating === user.id}
                      onChange={(e) => handleStatusChange(user.id, e.target.value as UserStatus)}
                      className="rounded-md border border-input bg-background px-2 py-1 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
                    >
                      {USER_STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    {updating === user.id && <Loader2 className="ml-1 inline size-3 animate-spin" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="py-12 text-center text-sm text-muted-foreground">No users found</p>
          )}
        </div>
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────
// ORDERS TAB
// ────────────────────────────────────────────────────────────
const ORDER_STATUSES = ["ALL","PLACED","PROCESSING","SHIPPED","DELIVERED","CANCELLED"] as const

const ORDER_STATUS_OPTIONS: OrderStatus[] = ["PLACED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]

const BUYER_FILTERS = ["ALL", "CUSTOMER", "SELLER"] as const
type BuyerFilter = typeof BUYER_FILTERS[number]

function OrdersTab() {
  const [orders, setOrders]   = useState<AdminOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<"ALL"|OrderStatus>("ALL")
  const [buyerFilter, setBuyerFilter]   = useState<BuyerFilter>("ALL")
  const [expanded, setExpanded] = useState<string | null>(null)
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null)

  useEffect(() => {
    adminService.getOrders()
      .then(setOrders)
      .catch(() => toast.error("Failed to load orders"))
      .finally(() => setLoading(false))
  }, [])

  const handleOrderStatusChange = async (orderId: string, status: OrderStatus) => {
    setUpdatingOrder(orderId)
    try {
      await adminService.updateOrderStatus(orderId, status)
      setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status } : o))
      toast.success("Order status updated")
    } catch (err: any) { toast.error(err.message) }
    finally { setUpdatingOrder(null) }
  }

  const effectiveRole = (o: AdminOrder) => o.customer.role ?? "CUSTOMER"

  const filtered = orders.filter((o) => {
    const matchStatus = statusFilter === "ALL" || o.status === statusFilter
    const matchBuyer  = buyerFilter  === "ALL" || effectiveRole(o) === buyerFilter
    return matchStatus && matchBuyer
  })

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="size-7 animate-spin text-primary" /></div>

  const sellerOrderCount   = orders.filter((o) => effectiveRole(o) === "SELLER").length
  const customerOrderCount = orders.filter((o) => effectiveRole(o) === "CUSTOMER").length

  return (
    <div className="space-y-4">
      {/* Buyer type filter */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-muted-foreground">Buyer:</span>
        {(["ALL", "CUSTOMER", "SELLER"] as const).map((b) => {
          const count = b === "ALL" ? orders.length : b === "SELLER" ? sellerOrderCount : customerOrderCount
          return (
            <button key={b} onClick={() => setBuyerFilter(b)}
              className={`rounded-full px-3 py-1 text-xs font-semibold border transition-colors ${
                buyerFilter === b
                  ? b === "SELLER"
                    ? "bg-purple-600 text-white border-purple-600"
                    : "bg-primary text-primary-foreground border-primary"
                  : "bg-muted text-muted-foreground border-transparent"
              }`}>
              {b === "SELLER" ? "🏪 Seller Bulk" : b} ({count})
            </button>
          )
        })}
      </div>

      {/* Status filter */}
      <div className="flex flex-wrap gap-2">
        {ORDER_STATUSES.map((s) => {
          const count = s === "ALL"
            ? filtered.length
            : orders.filter((o) => {
                const matchBuyer = buyerFilter === "ALL" || effectiveRole(o) === buyerFilter
                return o.status === s && matchBuyer
              }).length
          return (
            <button key={s} onClick={() => setStatusFilter(s as any)}
              className={`rounded-full px-3 py-1 text-xs font-semibold border transition-colors ${
                statusFilter === s ? "bg-primary text-primary-foreground border-primary"
                  : "bg-muted text-muted-foreground border-transparent"
              }`}>
              {s} ({count})
            </button>
          )
        })}
      </div>

      <div className="rounded-xl border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/30">
              <tr>
                {["Order","Buyer","Date","Items","Total","Status","Update Status"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((order) => {
                const isSeller = effectiveRole(order) === "SELLER"
                const sellerCount = new Set(order.items.map((i) => i.medicine.seller.id)).size
                return (
                  <>
                    <tr key={order.id}
                      className={isSeller ? "bg-purple-500/5" : ""}>
                      <td className="px-4 py-3">
                        <p className="font-mono text-xs font-semibold">{order.orderNumber}</p>
                        <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                          {isSeller && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-semibold text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                              🏪 Seller Bulk
                            </span>
                          )}
                          <button
                            onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                            className="inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[10px] text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                          >
                            {expanded === order.id ? <><ChevronUp className="size-3" /> Hide</> : <><ChevronDown className="size-3" /> Details</>}
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium">{order.customer.name}</p>
                        <p className="text-xs text-muted-foreground">{order.customer.email}</p>
                        <span className={`text-[10px] font-semibold ${isSeller ? "text-purple-500" : "text-blue-500"}`}>
                          {effectiveRole(order)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString("en-GB", { day:"numeric", month:"short", year:"numeric" })}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                        {sellerCount > 1 && (
                          <p className="text-xs">{sellerCount} sellers</p>
                        )}
                      </td>
                      <td className="px-4 py-3 font-semibold text-primary">৳{parseFloat(order.total).toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <StatusChip status={order.status} colorMap={ORDER_STATUS_COLOR} />
                      </td>
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={order.status}
                          disabled={updatingOrder === order.id}
                          onChange={(e) => handleOrderStatusChange(order.id, e.target.value as OrderStatus)}
                          className="rounded-md border border-input bg-background px-2 py-1 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
                        >
                          {ORDER_STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                        {updatingOrder === order.id && <Loader2 className="ml-1 inline size-3 animate-spin" />}
                      </td>
                    </tr>
                    {expanded === order.id && (
                      <tr key={`${order.id}-exp`}>
                        <td colSpan={7} className="bg-muted/10 px-6 py-4">
                          <div className="space-y-2 text-xs">
                            <p className="text-muted-foreground">
                              Ship to: {order.shippingAddress}, {order.shippingCity}
                              {order.shippingPostalCode && ` - ${order.shippingPostalCode}`}
                            </p>
                            <div className="divide-y rounded-lg border overflow-hidden">
                              {order.items.map((item) => (
                                <div key={item.id} className="flex items-center justify-between bg-background px-3 py-2">
                                  <div className="space-y-1">
                                    <p className="font-medium">{item.medicine.name}</p>
                                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                                      <Store className="size-2.5" />
                                      {item.medicine.seller.name}
                                    </span>
                                  </div>
                                  <div className="text-right">
                                    <p>×{item.quantity}</p>
                                    <p className="font-semibold text-primary">৳{parseFloat(item.subtotal).toFixed(2)}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                )
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="py-12 text-center text-sm text-muted-foreground">No orders found</p>
          )}
        </div>
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────
// MEDICINES TAB
// ────────────────────────────────────────────────────────────
function MedicinesTab() {
  const [medicines, setMedicines] = useState<AdminMedicine[]>([])
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState("")
  const [filter, setFilter]       = useState<"ALL"|"ACTIVE"|"INACTIVE">("ALL")
  const [toggling, setToggling]   = useState<string | null>(null)

  useEffect(() => {
    adminService.getMedicines()
      .then(setMedicines)
      .catch(() => toast.error("Failed to load medicines"))
      .finally(() => setLoading(false))
  }, [])

  const handleToggle = async (med: AdminMedicine) => {
    setToggling(med.id)
    try {
      await adminService.toggleMedicine(med.id)
      setMedicines((prev) => prev.map((m) => m.id === med.id ? { ...m, isActive: !m.isActive } : m))
      toast.success(`${med.name} ${med.isActive ? "deactivated" : "activated"}`)
    } catch (err: any) { toast.error(err.message) }
    finally { setToggling(null) }
  }

  const filtered = medicines.filter((m) => {
    const matchFilter = filter === "ALL" || (filter === "ACTIVE" ? m.isActive : !m.isActive)
    const matchSearch = !search || m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.seller.name.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="size-7 animate-spin text-primary" /></div>

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Input placeholder="Search by name or seller…" value={search}
          onChange={(e) => setSearch(e.target.value)} className="h-8 max-w-xs text-sm" />
        {(["ALL","ACTIVE","INACTIVE"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`rounded-full px-3 py-1 text-xs font-semibold border transition-colors ${
              filter === f ? "bg-primary text-primary-foreground border-primary"
                : "bg-muted text-muted-foreground border-transparent"
            }`}>
            {f}
          </button>
        ))}
        <span className="ml-auto text-xs text-muted-foreground">{filtered.length} medicines</span>
      </div>

      <div className="rounded-xl border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/30">
              <tr>
                {["Medicine","Seller","Category","Form","Price","Stock","Status","Toggle"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((med) => (
                <tr key={med.id} className={!med.isActive ? "opacity-60" : ""}>
                  <td className="px-4 py-3">
                    <p className="font-medium line-clamp-1">{med.name}</p>
                    <p className="text-xs text-muted-foreground">{med.manufacturer}</p>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{med.seller.name}</td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{med.category.name}</td>
                  <td className="px-4 py-3">
                    {med.form ? <Badge variant="secondary" className="text-xs">{med.form}</Badge> : "—"}
                  </td>
                  <td className="px-4 py-3 font-semibold text-primary">৳{parseFloat(med.price).toFixed(2)}</td>
                  <td className="px-4 py-3">{med.stock}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                      med.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}>
                      {med.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Button size="sm" variant="outline"
                      className={`h-7 px-2 text-xs ${med.isActive ? "border-destructive text-destructive hover:bg-destructive hover:text-white" : "border-primary text-primary"}`}
                      disabled={toggling === med.id}
                      onClick={() => handleToggle(med)}>
                      {toggling === med.id
                        ? <Loader2 className="size-3 animate-spin" />
                        : med.isActive ? "Deactivate" : "Activate"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="py-12 text-center text-sm text-muted-foreground">No medicines found</p>
          )}
        </div>
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────
// CATEGORIES TAB
// ────────────────────────────────────────────────────────────
function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
}

function CategoryForm({ category, onSave, onCancel }: {
  category?: AdminCategory | null
  onSave: (data: { name: string; slug: string; description: string }) => Promise<void>
  onCancel: () => void
}) {
  const [form, setForm] = useState({ name: category?.name ?? "", slug: category?.slug ?? "", description: category?.description ?? "" })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try { await onSave(form) } finally { setSaving(false) }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Name *</Label>
          <Input value={form.name} onChange={(e) => {
            const name = e.target.value
            setForm((f) => ({ ...f, name, slug: category ? f.slug : slugify(name) }))
          }} required />
        </div>
        <div className="space-y-1.5">
          <Label>Slug *</Label>
          <Input value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} required />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label>Description</Label>
          <Input value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
        </div>
      </div>
      <div className="flex justify-end gap-3 border-t pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={saving}>
          {saving && <Loader2 className="mr-2 size-4 animate-spin" />}
          {category ? "Save Changes" : "Create Category"}
        </Button>
      </div>
    </form>
  )
}

function CategoriesTab() {
  const [categories, setCategories] = useState<AdminCategory[]>([])
  const [loading, setLoading]       = useState(true)
  const [editing, setEditing]       = useState<AdminCategory | null | "new">(null)
  const [deleting, setDeleting]     = useState<string | null>(null)

  useEffect(() => {
    adminService.getCategories()
      .then(setCategories)
      .catch(() => toast.error("Failed to load categories"))
      .finally(() => setLoading(false))
  }, [])

  const handleCreate = async (data: { name: string; slug: string; description: string }) => {
    const result = await adminService.createCategory(data)
    setCategories((prev) => [...prev, result])
    setEditing(null)
    toast.success(`Category "${result.name}" created`)
  }

  const handleUpdate = async (data: { name: string; slug: string; description: string }) => {
    if (!editing || editing === "new") return
    const result = await adminService.updateCategory((editing as AdminCategory).id, data)
    setCategories((prev) => prev.map((c) => c.id === result.id ? result : c))
    setEditing(null)
    toast.success("Category updated")
  }

  const handleDelete = async (cat: AdminCategory) => {
    if (!confirm(`Delete "${cat.name}"? This cannot be undone.`)) return
    setDeleting(cat.id)
    try {
      await adminService.deleteCategory(cat.id)
      setCategories((prev) => prev.filter((c) => c.id !== cat.id))
      toast.success(`"${cat.name}" deleted`)
    } catch (err: any) { toast.error(err.message) }
    finally { setDeleting(null) }
  }

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="size-7 animate-spin text-primary" /></div>

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{categories.length} categories</p>
        <Button size="sm" className="gap-1.5" onClick={() => setEditing("new")}>
          <Plus className="size-4" />Add Category
        </Button>
      </div>

      {editing && (
        <div className="rounded-xl border bg-card p-5">
          <p className="mb-4 text-base font-semibold">
            {editing === "new" ? "New Category" : `Edit: ${(editing as AdminCategory).name}`}
          </p>
          <CategoryForm
            category={editing === "new" ? null : editing as AdminCategory}
            onSave={editing === "new" ? handleCreate : handleUpdate}
            onCancel={() => setEditing(null)}
          />
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => (
          <div key={cat.id} className="rounded-xl border bg-card p-4 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-semibold">{cat.name}</p>
              <p className="text-xs text-muted-foreground font-mono">{cat.slug}</p>
              {cat.description && (
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{cat.description}</p>
              )}
            </div>
            <div className="flex shrink-0 gap-1">
              <Button size="icon" variant="ghost" className="size-7" onClick={() => setEditing(cat)}>
                <Pencil className="size-3.5" />
              </Button>
              <Button size="icon" variant="ghost"
                className="size-7 text-destructive hover:text-destructive"
                disabled={deleting === cat.id}
                onClick={() => handleDelete(cat)}>
                {deleting === cat.id ? <Loader2 className="size-3.5 animate-spin" /> : <Trash2 className="size-3.5" />}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────
// APPROVALS TAB
// ────────────────────────────────────────────────────────────
function ApprovalsTab() {
  const [sellers, setSellers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    adminService.getUsers()
      .then((users) => setSellers(users.filter((u) => u.role === "SELLER" && u.status === "PENDING")))
      .catch(() => toast.error("Failed to load pending sellers"))
      .finally(() => setLoading(false))
  }, [])

  const handleAction = async (userId: string, status: UserStatus) => {
    setUpdating(userId)
    try {
      await adminService.updateUserStatus(userId, status)
      setSellers((prev) => prev.filter((s) => s.id !== userId))
      toast.success(
        status === "ACTIVE"    ? "Seller approved — they can now log in." :
        status === "SUSPENDED" ? "Seller suspended."                       : "Status updated."
      )
    } catch (err: any) { toast.error(err.message) }
    finally { setUpdating(null) }
  }

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="size-7 animate-spin text-primary" /></div>

  if (sellers.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed bg-muted/20 py-20 text-center">
        <CheckCircle2 className="size-10 text-muted-foreground/40" />
        <p className="text-sm font-semibold">All caught up!</p>
        <p className="text-xs text-muted-foreground">No pending seller approvals right now.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        {sellers.length} pending approval{sellers.length !== 1 ? "s" : ""}
      </p>

      <div className="space-y-3">
        {sellers.map((seller) => (
          <div
            key={seller.id}
            className="flex flex-col gap-4 rounded-xl border bg-card p-5 sm:flex-row sm:items-center sm:justify-between"
          >
            {/* Seller info */}
            <div className="flex items-center gap-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/30">
                <Store className="size-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="font-semibold">{seller.name}</p>
                <p className="text-sm text-muted-foreground">{seller.email}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Registered{" "}
                  {new Date(seller.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric", month: "short", year: "numeric",
                  })}
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
              {/* Keep Pending — visual only */}
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5 cursor-default border-yellow-300 text-yellow-600 hover:bg-yellow-50 dark:border-yellow-700 dark:text-yellow-400"
                disabled
              >
                <Clock className="size-3.5" />
                Pending
              </Button>

              {/* Suspend */}
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5 border-destructive/50 text-destructive hover:bg-destructive hover:text-white"
                disabled={!!updating}
                onClick={() => handleAction(seller.id, "SUSPENDED")}
              >
                {updating === seller.id
                  ? <Loader2 className="size-3.5 animate-spin" />
                  : <Ban className="size-3.5" />}
                Suspend
              </Button>

              {/* Approve */}
              <Button
                size="sm"
                className="gap-1.5 bg-green-600 text-white hover:bg-green-700"
                disabled={!!updating}
                onClick={() => handleAction(seller.id, "ACTIVE")}
              >
                {updating === seller.id
                  ? <Loader2 className="size-3.5 animate-spin" />
                  : <UserCheck className="size-3.5" />}
                Approve
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────
// ROOT PAGE
// ────────────────────────────────────────────────────────────
export default function AdminDashboardPage() {
  const [stats, setStats]     = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminService.getStats()
      .then(setStats)
      .catch(() => toast.error("Failed to load statistics"))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6 p-2">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">Platform overview — users, orders, medicines, and categories</p>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="mb-2 flex-wrap h-auto gap-1">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="approvals" className="gap-1.5">
            Approvals
            {(stats?.sellers.totalPendingSellers ?? 0) > 0 && (
              <span className="flex size-4 items-center justify-center rounded-full bg-yellow-500 text-[10px] font-bold text-white">
                {stats!.sellers.totalPendingSellers}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="medicines">Medicines</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          {stats && <OverviewTab stats={stats} />}
        </TabsContent>
        <TabsContent value="approvals">
          <ApprovalsTab />
        </TabsContent>
        <TabsContent value="users">
          <UsersTab />
        </TabsContent>
        <TabsContent value="orders">
          <OrdersTab />
        </TabsContent>
        <TabsContent value="medicines">
          <MedicinesTab />
        </TabsContent>
        <TabsContent value="categories">
          <CategoriesTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
