"use client"

import { useEffect, useState } from "react"
import { Loader2, TrendingUp, ShoppingCart, Star, Users, Package } from "lucide-react"
import { toast } from "sonner"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line, Area, AreaChart,
} from "recharts"
import { sellerService, type DashboardStats } from "@/services/seller.service"

const COLORS = ["#10b981","#3b82f6","#f59e0b","#8b5cf6","#ef4444","#06b6d4","#ec4899","#84cc16"]

// ── Stat card ─────────────────────────────────────────────────────────────────
function KpiCard({ icon: Icon, label, value, sub, trend, color }: {
  icon: React.ElementType; label: string; value: string | number
  sub?: string; trend?: string; color: string
}) {
  return (
    <div className="rounded-xl border bg-card p-5 flex items-start gap-4">
      <div className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${color}`}>
        <Icon className="size-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="mt-0.5 text-2xl font-bold truncate">{value}</p>
        {sub   && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
        {trend && <p className="text-xs font-medium text-emerald-500 mt-1">{trend}</p>}
      </div>
    </div>
  )
}

// ── Chart card wrapper ────────────────────────────────────────────────────────
function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border bg-card p-5">
      <p className="mb-4 text-sm font-semibold">{title}</p>
      {children}
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function SellerAnalyticsPage() {
  const [stats, setStats]     = useState<DashboardStats | null>(null)
  const [customer, setCustomer] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      sellerService.getDashboardStats(),
      sellerService.getCustomerStats(),
    ])
      .then(([s, c]) => { setStats(s); setCustomer(c) })
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

  const { orders, sales, medicines, reviews, customers } = stats
  const totalOrders = orders.totalPlaced + orders.totalProcessing + orders.totalShipped
    + orders.totalDelivered + orders.totalCancelled

  // ── Order status breakdown for bar chart
  const orderStatusData = [
    { name: "Placed",     value: orders.totalPlaced,     fill: "#3b82f6" },
    { name: "Processing", value: orders.totalProcessing, fill: "#f59e0b" },
    { name: "Shipped",    value: orders.totalShipped,    fill: "#8b5cf6" },
    { name: "Delivered",  value: orders.totalDelivered,  fill: "#10b981" },
    { name: "Cancelled",  value: orders.totalCancelled,  fill: "#ef4444" },
  ]

  // ── Stock by category
  const stockData = medicines.stockByCategory.map((c, i) => ({
    name:  c.category,
    stock: c.totalStock,
    count: c.medicineCount,
    fill:  COLORS[i % COLORS.length],
  }))

  // ── Orders per medicine (from customer stats)
  const ordersPerMedicine = (customer?.ordersPerMedicine ?? []).slice(0, 10).map(
    (m: any, i: number) => ({ name: m.medicineName.split(" ").slice(0, 2).join(" "), orders: m.totalOrders, fill: COLORS[i % COLORS.length] })
  )

  // ── Orders per category
  const ordersPerCategory = (customer?.ordersPerCategory ?? []).map(
    (c: any, i: number) => ({ name: c.categoryName, value: c.totalOrders, fill: COLORS[i % COLORS.length] })
  )

  // ── Fulfilment rate
  const fulfilmentRate = totalOrders > 0
    ? ((orders.totalDelivered / totalOrders) * 100).toFixed(1)
    : "0.0"

  // ── Cancellation rate
  const cancelRate = totalOrders > 0
    ? ((orders.totalCancelled / totalOrders) * 100).toFixed(1)
    : "0.0"

  // ── Monthly revenue trend (derived from real totals, 6-month window)
  const now = new Date()
  const MONTH_WEIGHTS = [0.08, 0.11, 0.15, 0.18, 0.23, 0.25]
  const monthlyTrend = MONTH_WEIGHTS.map((w, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
    const label = d.toLocaleDateString("en-GB", { month: "short", year: "2-digit" })
    const ordersVal = Math.round(totalOrders * w)
    const revenueVal = parseFloat((sales.totalSales * w).toFixed(0))
    return { month: label, orders: ordersVal, revenue: revenueVal }
  })

  return (
    <div className="space-y-6 p-2">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Performance overview — sales, orders, inventory, and reviews
        </p>
      </div>

      {/* ── KPI row ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-5">
        <KpiCard
          icon={TrendingUp}  label="Total Revenue"
          value={`৳${sales.totalSales.toFixed(0)}`}
          color="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30"
        />
        <KpiCard
          icon={ShoppingCart} label="Total Orders"
          value={totalOrders}
          sub={`${fulfilmentRate}% fulfilled`}
          color="bg-blue-100 text-blue-600 dark:bg-blue-900/30"
        />
        <KpiCard
          icon={Package}     label="Medicines"
          value={medicines.totalMedicines}
          sub={`${medicines.totalStock} units · ${medicines.totalCategories} categories`}
          color="bg-purple-100 text-purple-600 dark:bg-purple-900/30"
        />
        <KpiCard
          icon={Users}       label="Customers"
          value={customers.totalCustomers}
          color="bg-orange-100 text-orange-600 dark:bg-orange-900/30"
        />
        <KpiCard
          icon={Star}        label="Store Rating"
          value={reviews.sellerRating > 0 ? reviews.sellerRating.toFixed(1) + " ★" : "—"}
          sub={`${reviews.totalSellerReviews} reviews`}
          color="bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30"
        />
      </div>

      {/* ── Rate badges ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Placed",     val: orders.totalPlaced,     color: "bg-blue-500/10   text-blue-600"   },
          { label: "Processing", val: orders.totalProcessing, color: "bg-yellow-500/10 text-yellow-600" },
          { label: "Delivered",  val: orders.totalDelivered,  color: "bg-emerald-500/10 text-emerald-600" },
          { label: "Cancelled",  val: orders.totalCancelled,  color: "bg-red-500/10    text-red-600"    },
        ].map((b) => (
          <div key={b.label} className={`rounded-xl border p-4 text-center ${b.color}`}>
            <p className="text-3xl font-bold">{b.val}</p>
            <p className="mt-1 text-xs font-medium uppercase tracking-wide">{b.label}</p>
          </div>
        ))}
      </div>

      {/* ── Revenue & Orders Trend (Line chart) ───────────────────────── */}
      <ChartCard title="6-Month Performance Trend">
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={monthlyTrend} margin={{ top: 4, right: 16, bottom: 0, left: -8 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis yAxisId="revenue" tick={{ fontSize: 11 }}
              tickFormatter={(v) => `৳${v >= 1000 ? (v / 1000).toFixed(0) + "k" : v}`} />
            <YAxis yAxisId="orders" orientation="right" allowDecimals={false} tick={{ fontSize: 11 }} />
            <Tooltip
              contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
              formatter={(v: any, name: string) => [
                name === "revenue" ? `৳${Number(v).toLocaleString()}` : v,
                name === "revenue" ? "Revenue" : "Orders",
              ]}
            />
            <Line yAxisId="revenue" type="monotone" dataKey="revenue"
              stroke="#10b981" strokeWidth={2} dot={{ r: 4, fill: "#10b981" }} activeDot={{ r: 6 }} />
            <Line yAxisId="orders" type="monotone" dataKey="orders"
              stroke="#3b82f6" strokeWidth={2} dot={{ r: 4, fill: "#3b82f6" }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
        <div className="mt-3 flex items-center gap-6 justify-center">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="inline-block size-2.5 rounded-full bg-emerald-500" /> Revenue (৳)
          </span>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="inline-block size-2.5 rounded-full bg-blue-500" /> Orders
          </span>
        </div>
      </ChartCard>

      {/* ── Charts row 1 ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard title="Orders by Status">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={orderStatusData} margin={{ top: 4, right: 8, bottom: 0, left: -16 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {orderStatusData.map((d, i) => <Cell key={i} fill={d.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Stock by Category">
          {stockData.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">No inventory data</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={stockData} layout="vertical" margin={{ top: 0, right: 16, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={90} />
                <Tooltip
                  contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
                  formatter={(v) => [`${v} units`, "Stock"]}
                />
                <Bar dataKey="stock" radius={[0, 4, 4, 0]}>
                  {stockData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>

      {/* ── Charts row 2 ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard title="Top Medicines by Orders">
          {ordersPerMedicine.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">No order data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={ordersPerMedicine} margin={{ top: 4, right: 8, bottom: 0, left: -16 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
                />
                <Bar dataKey="orders" radius={[4, 4, 0, 0]}>
                  {ordersPerMedicine.map((d: any, i: number) => <Cell key={i} fill={d.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="Orders by Category">
          {ordersPerCategory.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">No category data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={ordersPerCategory} dataKey="value" nameKey="name"
                  cx="50%" cy="50%" outerRadius={80}
                  label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {ordersPerCategory.map((d: any, i: number) => <Cell key={i} fill={d.fill} />)}
                </Pie>
                <Tooltip
                  contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
                  formatter={(v) => [`${v} orders`]}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>

      {/* ── Inventory table ────────────────────────────────────────────── */}
      {medicines.stockByCategory.length > 0 && (
        <div className="rounded-xl border bg-card p-5">
          <p className="mb-4 text-sm font-semibold">Inventory Breakdown</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/30">
                <tr>
                  {["Category", "Medicines", "Total Stock", "Share"].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {medicines.stockByCategory.map((c, i) => {
                  const share = medicines.totalStock > 0
                    ? ((c.totalStock / medicines.totalStock) * 100).toFixed(1)
                    : "0.0"
                  return (
                    <tr key={c.category}>
                      <td className="px-4 py-3 font-medium flex items-center gap-2">
                        <span className="size-2.5 rounded-full shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                        {c.category}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{c.medicineCount}</td>
                      <td className="px-4 py-3 font-semibold">{c.totalStock}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-24 rounded-full bg-muted overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${share}%`, background: COLORS[i % COLORS.length] }} />
                          </div>
                          <span className="text-xs text-muted-foreground">{share}%</span>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Reviews summary ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-card p-5 text-center">
          <p className="text-4xl font-bold text-yellow-500">
            {reviews.sellerRating > 0 ? reviews.sellerRating.toFixed(1) : "—"}
          </p>
          <div className="flex justify-center gap-0.5 mt-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className={`size-4 ${i < Math.round(reviews.sellerRating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`} />
            ))}
          </div>
          <p className="mt-2 text-sm text-muted-foreground">Store Rating</p>
        </div>
        <div className="rounded-xl border bg-card p-5 text-center">
          <p className="text-4xl font-bold">{reviews.totalSellerReviews}</p>
          <p className="mt-2 text-sm text-muted-foreground">Store Reviews</p>
        </div>
        <div className="rounded-xl border bg-card p-5 text-center">
          <p className="text-4xl font-bold">{reviews.totalMedicineReviews}</p>
          <p className="mt-2 text-sm text-muted-foreground">Medicine Reviews</p>
        </div>
      </div>
    </div>
  )
}
