"use client"

import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import {
  adminService,
  type AdminMedicine,
} from "@/services/admin.service"

export default function MedicinesSection() {
  const [medicines, setMedicines] = useState<AdminMedicine[]>([])
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState("")
  const [filter, setFilter]       = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL")
  const [toggling, setToggling]   = useState<string | null>(null)

  useEffect(() => {
    adminService
      .getMedicines()
      .then(setMedicines)
      .catch(() => toast.error("Failed to load medicines"))
      .finally(() => setLoading(false))
  }, [])

  const handleToggle = async (med: AdminMedicine) => {
    setToggling(med.id)
    try {
      await adminService.toggleMedicine(med.id)
      setMedicines((prev) =>
        prev.map((m) => (m.id === med.id ? { ...m, isActive: !m.isActive } : m))
      )
      toast.success(`${med.name} ${med.isActive ? "deactivated" : "activated"}`)
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setToggling(null)
    }
  }

  const filtered = medicines.filter((m) => {
    const matchFilter =
      filter === "ALL" || (filter === "ACTIVE" ? m.isActive : !m.isActive)
    const matchSearch =
      !search ||
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.seller.name.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="size-7 animate-spin text-primary" />
      </div>
    )

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Input
          placeholder="Search by name or seller…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-8 max-w-xs text-sm"
        />
        {(["ALL", "ACTIVE", "INACTIVE"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-3 py-1 text-xs font-semibold border transition-colors ${
              filter === f
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-muted text-muted-foreground border-transparent"
            }`}
          >
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
                {["Medicine", "Manager", "Category", "Form", "Price", "Stock", "Status", "Toggle"].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground"
                    >
                      {h}
                    </th>
                  )
                )}
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
                    {med.form ? (
                      <Badge variant="secondary" className="text-xs">
                        {med.form}
                      </Badge>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-3 font-semibold text-primary">
                    ৳{parseFloat(med.price).toFixed(2)}
                  </td>
                  <td className="px-4 py-3">{med.stock}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                        med.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {med.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Button
                      size="sm"
                      variant="outline"
                      className={`h-7 px-2 text-xs ${
                        med.isActive
                          ? "border-destructive text-destructive hover:bg-destructive hover:text-white"
                          : "border-primary text-primary"
                      }`}
                      disabled={toggling === med.id}
                      onClick={() => handleToggle(med)}
                    >
                      {toggling === med.id ? (
                        <Loader2 className="size-3 animate-spin" />
                      ) : med.isActive ? (
                        "Deactivate"
                      ) : (
                        "Activate"
                      )}
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
