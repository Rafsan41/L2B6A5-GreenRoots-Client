"use client"

import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import {
  adminService,
  type AdminUser,
  type UserStatus,
} from "@/services/admin.service"
import { USER_STATUS_COLOR, StatusChip } from "./admin-shared"

const USER_STATUS_OPTIONS: UserStatus[] = ["ACTIVE", "BANNED", "PENDING", "SUSPENDED"]
const ROLE_FILTERS = ["ALL", "ADMIN", "SELLER", "CUSTOMER"] as const

export default function UsersSection() {
  const [users, setUsers]       = useState<AdminUser[]>([])
  const [loading, setLoading]   = useState(true)
  const [roleFilter, setRoleFilter] = useState<"ALL" | "ADMIN" | "SELLER" | "CUSTOMER">("ALL")
  const [search, setSearch]     = useState("")
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    adminService
      .getUsers()
      .then(setUsers)
      .catch(() => toast.error("Failed to load users"))
      .finally(() => setLoading(false))
  }, [])

  const handleStatusChange = async (userId: string, status: UserStatus) => {
    setUpdating(userId)
    try {
      const updated = (await adminService.updateUserStatus(userId, status)) as AdminUser
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, status: updated.status } : u))
      )
      toast.success("User status updated")
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setUpdating(null)
    }
  }

  const filtered = users.filter((u) => {
    const matchRole = roleFilter === "ALL" || u.role === roleFilter
    const matchSearch =
      !search ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    return matchRole && matchSearch
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
          placeholder="Search by name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-8 max-w-xs text-sm"
        />
        <div className="flex gap-1.5">
          {ROLE_FILTERS.map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`rounded-full px-3 py-1 text-xs font-semibold border transition-colors ${
                roleFilter === r
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-muted text-muted-foreground border-transparent"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
        <span className="ml-auto text-xs text-muted-foreground">{filtered.length} users</span>
      </div>

      <div className="rounded-xl border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/30">
              <tr>
                {["User", "Role", "Status", "Joined", "Actions"].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground"
                  >
                    {h}
                  </th>
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
                    <Badge variant="outline" className="text-xs">
                      {user.role}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <StatusChip status={user.status} colorMap={USER_STATUS_COLOR} />
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={user.status}
                      disabled={updating === user.id}
                      onChange={(e) =>
                        handleStatusChange(user.id, e.target.value as UserStatus)
                      }
                      className="rounded-md border border-input bg-background px-2 py-1 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
                    >
                      {USER_STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    {updating === user.id && (
                      <Loader2 className="ml-1 inline size-3 animate-spin" />
                    )}
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
