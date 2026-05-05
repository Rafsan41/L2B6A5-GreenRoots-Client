"use client"

import { useEffect, useState } from "react"
import {
  Loader2, Plus, Pencil, ToggleLeft, ToggleRight,
  FlaskConical, Search, ChevronLeft, ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import {
  sellerService,
  type SellerMedicine,
  type MedicineFormData,
} from "@/services/seller.service"

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:5000"
const PAGE_SIZE = 10

interface Category { id: string; name: string; slug: string }

const EMPTY_FORM: MedicineFormData = {
  name: "", slug: "", description: "", price: 0, stock: 0,
  manufacturer: "", categoryId: "", form: "", dosage: "",
  prescriptionRequired: false, isFeatured: false,
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
}

// ── Stock inline editor ────────────────────────────────────────────────────────
function StockEditor({ medicine, onUpdate }: {
  medicine: SellerMedicine
  onUpdate: (id: string, stock: number) => void
}) {
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
      <Button size="sm" variant="ghost" className="h-7 px-2 text-xs"
        disabled={saving} onClick={handleSave}>
        {saving ? <Loader2 className="size-3 animate-spin" /> : "✓"}
      </Button>
    </div>
  )
}

// ── Medicine form ──────────────────────────────────────────────────────────────
function MedicineForm({ medicine, categories, onSave, onCancel }: {
  medicine?: SellerMedicine | null
  categories: Category[]
  onSave: (data: any) => Promise<void>
  onCancel: () => void
}) {
  const [form, setForm] = useState<MedicineFormData>(() =>
    medicine ? {
      name: medicine.name, slug: medicine.slug,
      description: medicine.description, price: parseFloat(medicine.price),
      stock: medicine.stock, manufacturer: medicine.manufacturer,
      categoryId: medicine.categoryId, form: medicine.form ?? "",
      dosage: medicine.dosage ?? "",
      prescriptionRequired: medicine.prescriptionRequired,
      isFeatured: medicine.isFeatured,
    } : EMPTY_FORM
  )
  const [saving, setSaving] = useState(false)

  const set = (k: keyof MedicineFormData, v: any) => setForm((f) => ({ ...f, [k]: v }))

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
            value={form.description} onChange={(e) => set("description", e.target.value)}
            rows={3} required
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
          <Input value={form.manufacturer} onChange={(e) => set("manufacturer", e.target.value)} required />
        </div>
        <div className="space-y-1.5">
          <Label>Category *</Label>
          <select
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            value={form.categoryId} onChange={(e) => set("categoryId", e.target.value)} required
          >
            <option value="">Select category</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label>Form</Label>
          <select
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            value={form.form ?? ""} onChange={(e) => set("form", e.target.value)}
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

// ── Page ───────────────────────────────────────────────────────────────────────
export default function SellerMedicinesPage() {
  const [medicines, setMedicines] = useState<SellerMedicine[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading]   = useState(true)
  const [editing, setEditing]   = useState<SellerMedicine | null | "new">(null)
  const [search, setSearch]     = useState("")
  const [page, setPage]         = useState(1)

  useEffect(() => {
    Promise.all([
      sellerService.getMedicines(),
      fetch(`${BACKEND}/api/categories`, { credentials: "include" })
        .then((r) => r.json()).then((j) => j.data ?? []),
    ]).then(([meds, cats]) => {
      setMedicines(meds)
      setCategories(cats)
    }).catch(() => toast.error("Failed to load medicines"))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { setPage(1) }, [search])

  const handleCreate = async (data: MedicineFormData) => {
    const result = await sellerService.createMedicine(data) as SellerMedicine
    setMedicines((prev) => [result, ...prev])
    setEditing(null)
    toast.success(`${result.name} added`)
  }

  const handleUpdate = async (data: Partial<MedicineFormData>) => {
    if (!editing || editing === "new") return
    const result = await sellerService.updateMedicine((editing as SellerMedicine).id, data) as SellerMedicine
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
        await sellerService.updateMedicine(med.id, { stock: med.stock })
        setMedicines((prev) => prev.map((m) => m.id === med.id ? { ...m, isActive: true } : m))
        toast.success(`${med.name} reactivated`)
      }
    } catch (err: any) { toast.error(err.message) }
  }

  const handleStockUpdate = (id: string, stock: number) =>
    setMedicines((prev) => prev.map((m) => m.id === id ? { ...m, stock } : m))

  const filtered = medicines.filter((m) =>
    !search ||
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.manufacturer.toLowerCase().includes(search.toLowerCase()) ||
    m.category.name.toLowerCase().includes(search.toLowerCase())
  )

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  if (loading) return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Loader2 className="size-8 animate-spin text-primary" />
    </div>
  )

  return (
    <div className="space-y-6 p-2">
      <div>
        <h1 className="text-2xl font-bold">My Medicines</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Add, edit, update stock, and manage your medicine listings
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, manufacturer, category…"
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="h-9 pl-8 text-sm"
          />
        </div>
        <span className="text-xs text-muted-foreground ml-auto">
          {filtered.length} medicine{filtered.length !== 1 ? "s" : ""}
        </span>
        <Button size="sm" className="gap-1.5" onClick={() => { setEditing("new"); window.scrollTo({ top: 0, behavior: "smooth" }) }}>
          <Plus className="size-4" /> Add Medicine
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

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
          <FlaskConical className="size-10 text-muted-foreground" />
          <p className="text-muted-foreground">
            {search ? "No medicines match your search." : "No medicines yet. Add your first one!"}
          </p>
        </div>
      ) : (
        <>
          <div className="rounded-xl border bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b bg-muted/30">
                  <tr>
                    {["Name", "Category", "Form", "Price", "Stock", "Status", "Actions"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {paginated.map((med) => (
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
                          med.isActive ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between text-sm">
              <p className="text-muted-foreground text-xs">
                Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
              </p>
              <div className="flex items-center gap-1">
                <Button variant="outline" size="icon" className="size-8"
                  disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
                  <ChevronLeft className="size-4" />
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                  .reduce<(number | "…")[]>((acc, p, idx, arr) => {
                    if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("…")
                    acc.push(p)
                    return acc
                  }, [])
                  .map((p, i) =>
                    p === "…" ? (
                      <span key={`e-${i}`} className="px-1 text-muted-foreground">…</span>
                    ) : (
                      <Button key={p} variant={page === p ? "default" : "outline"} size="icon"
                        className="size-8 text-xs" onClick={() => setPage(p as number)}>
                        {p}
                      </Button>
                    )
                  )}
                <Button variant="outline" size="icon" className="size-8"
                  disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
