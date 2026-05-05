"use client"

import { useEffect, useState } from "react"
import { Loader2, Users, Package, ShoppingCart, TrendingUp, Star, UserCheck } from "lucide-react"
import { toast } from "sonner"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts"
import { adminService, type AdminStats } from "@/services/admin.service"

const COLORS = ["#10b981","#3b82f6","#f59e0b","#8b5cf6","#ef4444","#06b6d4","#ec4899","#84cc16"]

function KpiCard({ icon: Icon, label, value, sub, color }: {
  icon: React.ElementType; label: string; value: string | number; sub?: string; color: string
}) {
  return (
    <div className="rounded-xl border bg-card p-5 flex items-start gap-4">
      <div className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${color}`}>
        <Icon className="size-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="mt-0.5 text-2xl font-bold">{value}</p>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border bg-card p-5">
      <p className="mb-4 text-sm font-semibold">{title}</p>
      {children}
    </div>
  )
}

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminService.getStats()
      .then(setStats)
      .catch(() => toast.error("Failed to load analytics"))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-muted-foreground">
        No analytics data available.
      </div>
    )
  }

  const { users, sellers, medicines } = stats

  // ── Seller status breakdown for pie
  const sellerStatusData = [
    { name: "Approved",  value: sellers.totalApprovedSellers,  fill: "#10b981" },
    { name: "Pending",   value: sellers.totalPendingSellers,   fill: "#f59e0b" },
    { name: "Rejected",  value: sellers.totalRejectedSellers,  fill: "#ef4444" },
    { name: "Suspended", value: sellers.totalSuspendedSellers, fill: "#8b5cf6" },
  ].filter((d) => d.value > 0)

  // ── User breakdown for pie
  const userBreakdown = [
    { name: "Customers", value: users.totalCustomers,  fill: "#3b82f6" },
    { name: "Sellers",   value: sellers.totalSellers,  fill: "#10b981" },
  ]

  // ── Revenue by seller bar chart
  const revenueData = sellers.salesBySeller
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, 10)
    .map((s, i) => ({
      name:    s.sellerName.split(" ")[0],
      revenue: s.totalRevenue,
      orders:  s.totalOrders,
      fill:    COLORS[i % COLORS.length],
    }))

  return (
    <div className="space-y-6 p-2">
      <div>
        <h1 className="text-2xl font-bold">Platform Analytics</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Full platform overview — users, sellers, medicines, and revenue
        </p>
      </div>

      {/* ── KPI row ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
        <KpiCard icon={Users}     label="Total Users"    value={users.totalUsers}
          sub={`${users.totalBannedCustomers} banned`}
          color="bg-blue-100 text-blue-600 dark:bg-blue-900/30" />
        <KpiCard icon={UserCheck} label="Customers"      value={users.totalCustomers}
          color="bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30" />
        <KpiCard icon={TrendingUp} label="Total Sellers" value={sellers.totalSellers}
          sub={`${sellers.totalApprovedSellers} approved`}
          color="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30" />
        <KpiCard icon={Star}      label="Pending"        value={sellers.totalPendingSellers}
          color="bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30" />
        <KpiCard icon={Package}   label="Medicines"      value={medicines.totalMedicines}
          sub={`${medicines.totalCategories} categories`}
          color="bg-purple-100 text-purple-600 dark:bg-purple-900/30" />
        <KpiCard icon={ShoppingCart} label="Sellers Revenue"
          value={`৳${sellers.salesBySeller.reduce((s, x) => s + x.totalRevenue, 0).toFixed(0)}`}
          color="bg-orange-100 text-orange-600 dark:bg-orange-900/30" />
      </div>

      {/* ── Status row ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Approved Sellers",  val: sellers.totalApprovedSellers,  color: "bg-emerald-500/10 text-emerald-600" },
          { label: "Pending Sellers",   val: sellers.totalPendingSellers,   color: "bg-yellow-500/10  text-yellow-600"  },
          { label: "Rejected Sellers",  val: sellers.totalRejectedSellers,  color: "bg-red-500/10     text-red-600"     },
          { label: "Suspended Sellers", val: sellers.totalSuspendedSellers, color: "bg-purple-500/10  text-purple-600"  },
        ].map((b) => (
          <div key={b.label} className={`rounded-xl border p-4 text-center ${b.color}`}>
            <p className="text-3xl font-bold">{b.val}</p>
            <p className="mt-1 text-xs font-medium">{b.label}</p>
          </div>
        ))}
      </div>

      {/* ── Charts row 1 ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard title="Revenue by Seller (Top 10)">
          {revenueData.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">No revenue data</p>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={revenueData} margin={{ top: 4, right: 8, bottom: 0, left: -8 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `৳${v >= 1000 ? (v/1000).toFixed(0)+"k" : v}`} />
                <Tooltip
                  contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
                  formatter={(v: any) => [`৳${Number(v).toLocaleString()}`, "Revenue"]}
                />
                <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
                  {revenueData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="Seller Status Distribution">
          {sellerStatusData.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">No seller data</p>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={sellerStatusData} dataKey="value" nameKey="name"
                  cx="50%" cy="50%" outerRadius={85}
                  label={({ name, value }) => `${name}: ${value}`} labelLine={false}
                >
                  {sellerStatusData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                </Pie>
                <Tooltip
                  contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>

      {/* ── Charts row 2 ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard title="User Breakdown">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={userBreakdown} dataKey="value" nameKey="name"
                cx="50%" cy="50%" outerRadius={85}
                label={({ name, value }) => `${name}: ${value}`} labelLine={false}
              >
                {userBreakdown.map((d, i) => <Cell key={i} fill={d.fill} />)}
              </Pie>
              <Tooltip
                contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Orders per Seller">
          {revenueData.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">No order data</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={revenueData} margin={{ top: 4, right: 8, bottom: 0, left: -16 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
                  formatter={(v: any) => [v, "Orders"]}
                />
                <Bar dataKey="orders" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>

      {/* ── Top sellers table ─────────────────────────────────────────── */}
      {sellers.salesBySeller.length > 0 && (
        <div className="rounded-xl border bg-card p-5">
          <p className="mb-4 text-sm font-semibold">Top Sellers Performance</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/30">
                <tr>
                  {["#", "Seller", "Total Orders", "Total Revenue", "Avg per Order"].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {sellers.salesBySeller
                  .sort((a, b) => b.totalRevenue - a.totalRevenue)
                  .map((s, i) => {
                    const avg = s.totalOrders > 0 ? (s.totalRevenue / s.totalOrders).toFixed(0) : "0"
                    return (
                      <tr key={s.sellerId} className={i === 0 ? "bg-emerald-500/5" : ""}>
                        <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{i + 1}</td>
                        <td className="px-4 py-3 font-medium flex items-center gap-2">
                          <span className="size-6 flex items-center justify-center rounded-full text-xs font-bold text-white"
                            style={{ background: COLORS[i % COLORS.length] }}>
                            {s.sellerName.charAt(0)}
                          </span>
                          {s.sellerName}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{s.totalOrders}</td>
                        <td className="px-4 py-3 font-bold text-primary">৳{s.totalRevenue.toLocaleString()}</td>
                        <td className="px-4 py-3 text-muted-foreground">৳{avg}</td>
                      </tr>
                    )
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
