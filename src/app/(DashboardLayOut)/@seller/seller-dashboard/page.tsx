"use client"

import { useEffect, useState, useCallback } from "react"
import {
  Loader2, Package, TrendingUp, Users, Star, DollarSign,
  Clock, Truck, CheckCircle2, XCircle, Plus, Pencil, Trash2,
  FlaskConical, AlertTriangle, ToggleLeft, ToggleRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts"
import { toast } from "sonner"
import {
  sellerService,
  type DashboardStats, type SellerMedicine,
  type SellerOrderEntry, type SellerOrderStatus,
  type MedicineFormData, type MedicineReviewEntry,
} from "@/services/seller.service"
import { AUTH_BASE_URL } from "@/lib/auth-client"

// ── Colour palette ────────────────────────────────────────
const PIE_COLORS = ["#10b981","#3b82f6","#f59e0b","#8b5cf6","#ef4444","#06b6d4","#ec4899"]

const STATUS_COLOR: Record<SellerOrderStatus, string> = {
  PLACED:     "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  PROCESSING: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  SHIPPED:    "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  DELIVERED:  "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  CANCELLED:  "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
}

const STATUS_LABEL: Record<SellerOrderStatus, string> = {
  PLACED:"Placed", PROCESSING:"Processing", SHIPPED:"Shipped", DELIVERED:"Delivered", CANCELLED:"Cancelled",
}

const NEXT_STATUSES: Record<SellerOrderStatus, SellerOrderStatus[]> = {
  PLACED:["PROCESSING","CANCELLED"], PROCESSING:["SHIPPED"], SHIPPED:["DELIVERED"], DELIVERED:[], CANCELLED:[],
}

// ────────────────────────────────────────────────────────────
// OVERVIEW TAB
// ────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, sub, color }: {
  icon: React.ElementType; label: string; value: string | number; sub?: string; color: string
}) {
  return (
    <div className="rounded-xl border bg-card p-5 flex items-center gap-4">
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

function OverviewTab({ stats }: { stats: DashboardStats }) {
  const { orders, sales, medicines, reviews, customers } = stats

  const orderBarData = [
    { name: "Placed",     value: orders.totalPlaced,     fill: "#3b82f6" },
    { name: "Processing", value: orders.totalProcessing, fill: "#f59e0b" },
    { name: "Shipped",    value: orders.totalShipped,    fill: "#8b5cf6" },
    { name: "Delivered",  value: orders.totalDelivered,  fill: "#10b981" },
    { name: "Cancelled",  value: orders.totalCancelled,  fill: "#ef4444" },
  ]

  const totalOrders = orderBarData.reduce((s, d) => s + d.value, 0)

  const stockPieData = medicines.stockByCategory.map((c, i) => ({
    name: c.category,
    value: c.totalStock,
    fill: PIE_COLORS[i % PIE_COLORS.length],
  }))

  return (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-5">
        <StatCard icon={DollarSign}   label="Total Revenue"   value={`৳${sales.totalSales.toFixed(0)}`}
          color="bg-green-100 text-green-600 dark:bg-green-900/30" />
        <StatCard icon={Package}      label="Total Orders"    value={totalOrders}
          color="bg-blue-100 text-blue-600 dark:bg-blue-900/30" />
        <StatCard icon={FlaskConical} label="Medicines"       value={medicines.totalMedicines}
          sub={`${medicines.totalStock} units in stock`}
          color="bg-purple-100 text-purple-600 dark:bg-purple-900/30" />
        <StatCard icon={Users}        label="Customers"       value={customers.totalCustomers}
          color="bg-orange-100 text-orange-600 dark:bg-orange-900/30" />
        <StatCard icon={Star}         label="Manager Rating"
          value={reviews.sellerRating > 0 ? reviews.sellerRating.toFixed(1) : "—"}
          sub={`${reviews.totalSellerReviews} reviews`}
          color="bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Bar chart — orders by status */}
        <div className="rounded-xl border bg-card p-5">
          <p className="mb-4 text-sm font-semibold">Orders by Status</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={orderBarData} margin={{ top: 4, right: 8, bottom: 0, left: -16 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {orderBarData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart — stock by category */}
        <div className="rounded-xl border bg-card p-5">
          <p className="mb-4 text-sm font-semibold">Stock by Category</p>
          {stockPieData.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">No stock data</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={stockPieData} dataKey="value" nameKey="name"
                  cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) =>
                    `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                  } labelLine={false}>
                  {stockPieData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
                  formatter={(v) => [`${v} units`]}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Stock by category table */}
      {medicines.stockByCategory.length > 0 && (
        <div className="rounded-xl border bg-card p-5">
          <p className="mb-3 text-sm font-semibold">Inventory Summary</p>
          <div className="divide-y">
            {medicines.stockByCategory.map((c) => (
              <div key={c.category} className="flex items-center justify-between py-2.5 text-sm">
                <span>{c.category}</span>
                <div className="flex gap-6 text-muted-foreground">
                  <span>{c.medicineCount} medicine{c.medicineCount !== 1 ? "s" : ""}</span>
                  <span className="font-medium text-foreground">{c.totalStock} units</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ────────────────────────────────────────────────────────────
// MEDICINES TAB
// ────────────────────────────────────────────────────────────
interface Category { id: string; name: string; slug: string }

const EMPTY_FORM: MedicineFormData = {
  name: "", slug: "", description: "", price: 0, stock: 0,
  manufacturer: "", categoryId: "", form: "", dosage: "",
  prescriptionRequired: false, isFeatured: false,
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
}

function MedicineForm({ medicine, categories, onSave, onCancel }: {
  medicine?: SellerMedicine | null
  categories: Category[]
  onSave: (data: any) => Promise<void>
  onCancel: () => void
}) {
  const [form, setForm] = useState<MedicineFormData>(() =>
    medicine
      ? {
          name: medicine.name, slug: medicine.slug,
          description: medicine.description, price: parseFloat(medicine.price),
          stock: medicine.stock, manufacturer: medicine.manufacturer,
          categoryId: medicine.categoryId, form: medicine.form ?? "",
          dosage: medicine.dosage ?? "",
          prescriptionRequired: medicine.prescriptionRequired,
          isFeatured: medicine.isFeatured,
        }
      : EMPTY_FORM
  )
  const [saving, setSaving] = useState(false)

  const set = (k: keyof MedicineFormData, v: any) =>
    setForm((f) => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await onSave(form)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Name *</Label>
          <Input value={form.name} onChange={(e) => {
            set("name", e.target.value)
            if (!medicine) set("slug", slugify(e.target.value))
          }} required />
        </div>
        <div className="space-y-1.5">
          <Label>Slug *</Label>
          <Input value={form.slug} onChange={(e) => set("slug", e.target.value)} required />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label>Description *</Label>
          <textarea
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            rows={3}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label>Price (৳) *</Label>
          <Input type="number" min={0.01} step={0.01} value={form.price}
            onChange={(e) => set("price", parseFloat(e.target.value))} required />
        </div>
        <div className="space-y-1.5">
          <Label>Stock *</Label>
          <Input type="number" min={0} value={form.stock}
            onChange={(e) => set("stock", parseInt(e.target.value))} required />
        </div>
        <div className="space-y-1.5">
          <Label>Manufacturer *</Label>
          <Input value={form.manufacturer}
            onChange={(e) => set("manufacturer", e.target.value)} required />
        </div>
        <div className="space-y-1.5">
          <Label>Category *</Label>
          <select
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            value={form.categoryId}
            onChange={(e) => set("categoryId", e.target.value)}
            required
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label>Form</Label>
          <select
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            value={form.form ?? ""}
            onChange={(e) => set("form", e.target.value)}
          >
            <option value="">Select form</option>
            {["Tablet","Capsule","Syrup","Cream","Drops","Spray","Injection","Powder"].map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label>Dosage</Label>
          <Input value={form.dosage ?? ""} onChange={(e) => set("dosage", e.target.value)}
            placeholder="e.g. 1 tablet twice daily" />
        </div>
        <div className="flex items-center gap-4 sm:col-span-2">
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input type="checkbox" checked={form.prescriptionRequired}
              onChange={(e) => set("prescriptionRequired", e.target.checked)}
              className="rounded border-input" />
            Prescription Required
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input type="checkbox" checked={form.isFeatured}
              onChange={(e) => set("isFeatured", e.target.checked)}
              className="rounded border-input" />
            Featured
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-3 border-t pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={saving}>
          {saving && <Loader2 className="mr-2 size-4 animate-spin" />}
          {medicine ? "Save Changes" : "Add Medicine"}
        </Button>
      </div>
    </form>
  )
}

function StockEditor({ medicine, onUpdate }: { medicine: SellerMedicine; onUpdate: (id: string, stock: number) => void }) {
  const [val, setVal] = useState(String(medicine.stock))
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    const n = parseInt(val)
    if (isNaN(n) || n < 0) { toast.error("Invalid stock value"); return }
    setSaving(true)
    try {
      await sellerService.updateMedicine(medicine.id, { stock: n })
      onUpdate(medicine.id, n)
      toast.success("Stock updated")
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex items-center gap-1">
      <Input className="h-7 w-16 text-center text-xs" value={val}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSave()} />
      <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" disabled={saving} onClick={handleSave}>
        {saving ? <Loader2 className="size-3 animate-spin" /> : "✓"}
      </Button>
    </div>
  )
}

function MedicinesTab({ categories }: { categories: Category[] }) {
  const [medicines, setMedicines] = useState<SellerMedicine[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<SellerMedicine | null | "new">(null)

  useEffect(() => {
    sellerService.getMedicines()
      .then(setMedicines)
      .catch(() => toast.error("Failed to load medicines"))
      .finally(() => setLoading(false))
  }, [])

  const handleCreate = async (data: MedicineFormData) => {
    const result = await sellerService.createMedicine(data) as SellerMedicine
    setMedicines((prev) => [result, ...prev])
    setEditing(null)
    toast.success(`${result.name} added`)
  }

  const handleUpdate = async (data: Partial<MedicineFormData>) => {
    if (!editing || editing === "new") return
    const result = await sellerService.updateMedicine(editing.id, data) as SellerMedicine
    setMedicines((prev) => prev.map((m) => m.id === result.id ? result : m))
    setEditing(null)
    toast.success("Medicine updated")
  }

  const handleToggle = async (med: SellerMedicine) => {
    try {
      if (med.isActive) {
        await sellerService.deleteMedicine(med.id)
        setMedicines((prev) => prev.map((m) => m.id === med.id ? { ...m, isActive: false } : m))
        toast.success(`${med.name} deactivated`)
      } else {
        const result = await sellerService.updateMedicine(med.id, { stock: med.stock }) as SellerMedicine
        setMedicines((prev) => prev.map((m) => m.id === med.id ? { ...m, isActive: true } : m))
        toast.success(`${med.name} reactivated`)
      }
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  const handleStockUpdate = (id: string, stock: number) => {
    setMedicines((prev) => prev.map((m) => m.id === id ? { ...m, stock } : m))
  }

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="size-7 animate-spin text-primary" /></div>

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{medicines.length} medicine{medicines.length !== 1 ? "s" : ""}</p>
        <Button size="sm" className="gap-1.5" onClick={() => setEditing("new")}>
          <Plus className="size-4" />Add Medicine
        </Button>
      </div>

      {/* Form panel */}
      {editing && (
        <div className="rounded-xl border bg-card p-5">
          <p className="mb-4 text-base font-semibold">
            {editing === "new" ? "Add New Medicine" : `Edit: ${(editing as SellerMedicine).name}`}
          </p>
          <MedicineForm
            medicine={editing === "new" ? null : editing as SellerMedicine}
            categories={categories}
            onSave={editing === "new" ? handleCreate : handleUpdate}
            onCancel={() => setEditing(null)}
          />
        </div>
      )}

      {medicines.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
          <FlaskConical className="size-10 text-muted-foreground" />
          <p className="text-muted-foreground">No medicines yet. Add your first one!</p>
        </div>
      ) : (
        <div className="rounded-xl border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/30">
                <tr>
                  {["Name","Category","Form","Price","Stock","Status","Actions"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {medicines.map((med) => (
                  <tr key={med.id} className={!med.isActive ? "opacity-50" : ""}>
                    <td className="px-4 py-3">
                      <p className="font-medium line-clamp-1">{med.name}</p>
                      <p className="text-xs text-muted-foreground">{med.manufacturer}</p>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{med.category.name}</td>
                    <td className="px-4 py-3">
                      {med.form ? <Badge variant="secondary" className="text-xs">{med.form}</Badge> : "—"}
                    </td>
                    <td className="px-4 py-3 font-semibold text-primary">৳{parseFloat(med.price).toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <StockEditor medicine={med} onUpdate={handleStockUpdate} />
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                        med.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}>
                        {med.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Button size="icon" variant="ghost" className="size-7"
                          onClick={() => setEditing(med)} title="Edit">
                          <Pencil className="size-3.5" />
                        </Button>
                        <Button size="icon" variant="ghost"
                          className={`size-7 ${med.isActive ? "text-destructive hover:text-destructive" : "text-primary hover:text-primary"}`}
                          onClick={() => handleToggle(med)}
                          title={med.isActive ? "Deactivate" : "Reactivate"}>
                          {med.isActive ? <ToggleLeft className="size-3.5" /> : <ToggleRight className="size-3.5" />}
                        </Button>
                      </div>
                    </td>
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
// ORDERS TAB
// ────────────────────────────────────────────────────────────
const STATUS_FILTERS: (SellerOrderStatus | "ALL")[] = ["ALL","PLACED","PROCESSING","SHIPPED","DELIVERED","CANCELLED"]

function OrderRow({ entry, onUpdate }: {
  entry: SellerOrderEntry
  onUpdate: (orderId: string, status: SellerOrderStatus) => void
}) {
  const [updating, setUpdating] = useState(false)
  const { order } = entry
  const nextStatuses = NEXT_STATUSES[entry.status]
  const sellerItems = order.items.filter((i) => i.medicine.sellerId === entry.sellerId)
  const sellerTotal = sellerItems.reduce((s, i) => s + parseFloat(i.subtotal), 0)

  const handleStatusChange = async (status: SellerOrderStatus) => {
    setUpdating(true)
    try {
      await sellerService.updateOrderStatus(order.id, status)
      onUpdate(order.id, status)
      toast.success(`${order.orderNumber} → ${STATUS_LABEL[status]}`)
    } catch (err: any) { toast.error(err.message) }
    finally { setUpdating(false) }
  }

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-muted/30 px-4 py-3 text-sm">
        <span className="font-mono font-semibold">{order.orderNumber}</span>
        <span className="text-muted-foreground">
          {new Date(order.createdAt).toLocaleDateString("en-GB", { day:"numeric", month:"short", year:"numeric" })}
        </span>
        <div>
          <p className="text-xs text-muted-foreground">Customer</p>
          <p className="font-medium">{order.customer.name}</p>
          <p className="text-xs text-muted-foreground">{order.customer.email}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Your items total</p>
          <p className="font-bold text-primary">৳{sellerTotal.toFixed(2)}</p>
        </div>
        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_COLOR[entry.status]}`}>
          {STATUS_LABEL[entry.status]}
        </span>
      </div>
      <div className="px-4 py-3 space-y-3">
        <div className="space-y-1">
          {sellerItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground line-clamp-1 flex-1">{item.medicine.name}</span>
              <span className="ml-3 shrink-0">×{item.quantity} · ৳{parseFloat(item.subtotal).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          Ship to: {order.shippingAddress}, {order.shippingCity}
        </p>
        {nextStatuses.length > 0 && (
          <>
            <Separator />
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground">Update:</span>
              {nextStatuses.map((s) => (
                <button key={s} disabled={updating} onClick={() => handleStatusChange(s)}
                  className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold hover:opacity-80 disabled:opacity-50 ${STATUS_COLOR[s]}`}>
                  {updating && <Loader2 className="size-3 animate-spin" />}
                  Mark as {STATUS_LABEL[s]}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function OrdersTab() {
  const [orders, setOrders] = useState<SellerOrderEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<SellerOrderStatus | "ALL">("ALL")

  useEffect(() => {
    sellerService.getOrders()
      .then(setOrders)
      .catch(() => toast.error("Failed to load orders"))
      .finally(() => setLoading(false))
  }, [])

  const handleUpdate = (orderId: string, status: SellerOrderStatus) =>
    setOrders((prev) => prev.map((e) => e.order.id === orderId ? { ...e, status } : e))

  const counts = {
    PLACED:     orders.filter((o) => o.status === "PLACED").length,
    PROCESSING: orders.filter((o) => o.status === "PROCESSING").length,
    SHIPPED:    orders.filter((o) => o.status === "SHIPPED").length,
    DELIVERED:  orders.filter((o) => o.status === "DELIVERED").length,
    CANCELLED:  orders.filter((o) => o.status === "CANCELLED").length,
  }

  const filtered = filter === "ALL" ? orders : orders.filter((o) => o.status === filter)

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="size-7 animate-spin text-primary" /></div>

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`rounded-full px-3 py-1 text-xs font-semibold border transition-colors ${
              filter === s ? "bg-primary text-primary-foreground border-primary"
                : "bg-muted text-muted-foreground border-transparent hover:border-muted-foreground/30"
            }`}>
            {s === "ALL" ? `All (${orders.length})` : `${STATUS_LABEL[s as SellerOrderStatus]} (${counts[s as SellerOrderStatus]})`}
          </button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
          <Package className="size-10 text-muted-foreground" />
          <p className="text-muted-foreground">No {filter !== "ALL" ? STATUS_LABEL[filter as SellerOrderStatus].toLowerCase() : ""} orders</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((entry) => <OrderRow key={entry.id} entry={entry} onUpdate={handleUpdate} />)}
        </div>
      )}
    </div>
  )
}

// ────────────────────────────────────────────────────────────
// REVIEWS TAB
// ────────────────────────────────────────────────────────────
function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`size-3.5 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`} />
      ))}
    </div>
  )
}

function ReviewsTab() {
  const [data, setData] = useState<{
    medicineReviews: MedicineReviewEntry[]
    sellerReviews: any[]
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<"medicine" | "seller">("medicine")

  useEffect(() => {
    sellerService.getCustomerStats()
      .then((d) => setData({ medicineReviews: d.medicineReviewsPerCustomer, sellerReviews: d.sellerReviewsPerCustomer }))
      .catch(() => toast.error("Failed to load reviews"))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="size-7 animate-spin text-primary" /></div>

  const reviews = tab === "medicine" ? (data?.medicineReviews ?? []) : (data?.sellerReviews ?? [])

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(["medicine","seller"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold border transition-colors capitalize ${
              tab === t ? "bg-primary text-primary-foreground border-primary"
                : "bg-muted text-muted-foreground border-transparent"
            }`}>
            {t === "medicine" ? "Medicine Reviews" : "Manager Reviews"}
          </button>
        ))}
      </div>

      {reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
          <Star className="size-10 text-muted-foreground" />
          <p className="text-muted-foreground">No {tab} reviews yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((r: any, i: number) => (
            <div key={i} className="rounded-xl border bg-card p-4 space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">{r.customerName}</p>
                  {tab === "medicine" && (
                    <p className="text-xs text-primary">{r.medicineName}</p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <StarRow rating={r.rating} />
                  <p className="text-xs text-muted-foreground">
                    {new Date(r.createdAt).toLocaleDateString("en-GB", { day:"numeric", month:"short", year:"numeric" })}
                  </p>
                </div>
              </div>
              {r.comment && (
                <p className="text-sm text-muted-foreground leading-relaxed">{r.comment}</p>
              )}
              {r.replies?.length > 0 && (
                <div className="ml-4 space-y-2 border-l-2 border-primary/20 pl-4">
                  {r.replies.map((reply: any, j: number) => (
                    <div key={j}>
                      <p className="text-xs font-semibold">{reply.customer?.name ?? "Reply"}</p>
                      <p className="text-xs text-muted-foreground">{reply.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ────────────────────────────────────────────────────────────
// ROOT PAGE
// ────────────────────────────────────────────────────────────
export default function SellerDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      sellerService.getDashboardStats(),
      fetch(`${AUTH_BASE_URL}/api/categories`, { credentials: "include" })
        .then((r) => r.json()).then((j) => j.data ?? []),
    ]).then(([s, cats]) => {
      setStats(s)
      setCategories(cats)
    }).catch(() => toast.error("Failed to load dashboard"))
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
        <h1 className="text-2xl font-bold">Manager Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your store — analytics, medicines, orders, and reviews</p>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="mb-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="medicines">Medicines</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          {stats && <OverviewTab stats={stats} />}
        </TabsContent>

        <TabsContent value="orders">
          <OrdersTab />
        </TabsContent>

        <TabsContent value="medicines">
          <MedicinesTab categories={categories} />
        </TabsContent>

        <TabsContent value="reviews">
          <ReviewsTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
