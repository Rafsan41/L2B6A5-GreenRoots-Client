"use client"

import { useEffect, useState } from "react"
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import {
  adminService,
  type AdminCategory,
} from "@/services/admin.service"

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

function CategoryForm({
  category,
  onSave,
  onCancel,
}: {
  category?: AdminCategory | null
  onSave: (data: { name: string; slug: string; description: string }) => Promise<void>
  onCancel: () => void
}) {
  const [form, setForm] = useState({
    name:        category?.name        ?? "",
    slug:        category?.slug        ?? "",
    description: category?.description ?? "",
  })
  const [saving, setSaving] = useState(false)

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
          <Input
            value={form.name}
            onChange={(e) => {
              const name = e.target.value
              setForm((f) => ({ ...f, name, slug: category ? f.slug : slugify(name) }))
            }}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label>Slug *</Label>
          <Input
            value={form.slug}
            onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
            required
          />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label>Description</Label>
          <Input
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          />
        </div>
      </div>
      <div className="flex justify-end gap-3 border-t pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={saving}>
          {saving && <Loader2 className="mr-2 size-4 animate-spin" />}
          {category ? "Save Changes" : "Create Category"}
        </Button>
      </div>
    </form>
  )
}

export default function CategoriesSection() {
  const [categories, setCategories] = useState<AdminCategory[]>([])
  const [loading, setLoading]       = useState(true)
  const [editing, setEditing]       = useState<AdminCategory | null | "new">(null)
  const [deleting, setDeleting]     = useState<string | null>(null)

  useEffect(() => {
    adminService
      .getCategories()
      .then(setCategories)
      .catch(() => toast.error("Failed to load categories"))
      .finally(() => setLoading(false))
  }, [])

  const handleCreate = async (data: {
    name: string
    slug: string
    description: string
  }) => {
    const result = await adminService.createCategory(data)
    setCategories((prev) => [...prev, result])
    setEditing(null)
    toast.success(`Category "${result.name}" created`)
  }

  const handleUpdate = async (data: {
    name: string
    slug: string
    description: string
  }) => {
    if (!editing || editing === "new") return
    const result = await adminService.updateCategory((editing as AdminCategory).id, data)
    setCategories((prev) => prev.map((c) => (c.id === result.id ? result : c)))
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
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setDeleting(null)
    }
  }

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="size-7 animate-spin text-primary" />
      </div>
    )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{categories.length} categories</p>
        <Button size="sm" className="gap-1.5" onClick={() => setEditing("new")}>
          <Plus className="size-4" /> Add Category
        </Button>
      </div>

      {editing && (
        <div className="rounded-xl border bg-card p-5">
          <p className="mb-4 text-base font-semibold">
            {editing === "new"
              ? "New Category"
              : `Edit: ${(editing as AdminCategory).name}`}
          </p>
          <CategoryForm
            category={editing === "new" ? null : (editing as AdminCategory)}
            onSave={editing === "new" ? handleCreate : handleUpdate}
            onCancel={() => setEditing(null)}
          />
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="rounded-xl border bg-card p-4 flex items-start justify-between gap-3"
          >
            <div className="min-w-0">
              <p className="font-semibold">{cat.name}</p>
              <p className="text-xs text-muted-foreground font-mono">{cat.slug}</p>
              {cat.description && (
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                  {cat.description}
                </p>
              )}
            </div>
            <div className="flex shrink-0 gap-1">
              <Button
                size="icon"
                variant="ghost"
                className="size-7"
                onClick={() => setEditing(cat)}
              >
                <Pencil className="size-3.5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="size-7 text-destructive hover:text-destructive"
                disabled={deleting === cat.id}
                onClick={() => handleDelete(cat)}
              >
                {deleting === cat.id ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Trash2 className="size-3.5" />
                )}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
