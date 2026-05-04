"use client"

import { useEffect, useState } from "react"
import { Loader2, CheckCircle2, Store, Clock, Ban, UserCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import {
  adminService,
  type AdminUser,
  type UserStatus,
} from "@/services/admin.service"

export default function ApprovalsSection() {
  const [sellers, setSellers]   = useState<AdminUser[]>([])
  const [loading, setLoading]   = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    adminService
      .getUsers()
      .then((users) =>
        setSellers(users.filter((u) => u.role === "SELLER" && u.status === "PENDING"))
      )
      .catch(() => toast.error("Failed to load pending sellers"))
      .finally(() => setLoading(false))
  }, [])

  const handleAction = async (userId: string, status: UserStatus) => {
    setUpdating(userId)
    try {
      await adminService.updateUserStatus(userId, status)
      setSellers((prev) => prev.filter((s) => s.id !== userId))
      toast.success(
        status === "ACTIVE"
          ? "Manager approved — they can now log in."
          : status === "SUSPENDED"
          ? "Manager suspended."
          : "Status updated."
      )
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setUpdating(null)
    }
  }

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="size-7 animate-spin text-primary" />
      </div>
    )

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
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5 cursor-default border-yellow-300 text-yellow-600 hover:bg-yellow-50 dark:border-yellow-700 dark:text-yellow-400"
                disabled
              >
                <Clock className="size-3.5" />
                Pending
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5 border-destructive/50 text-destructive hover:bg-destructive hover:text-white"
                disabled={!!updating}
                onClick={() => handleAction(seller.id, "SUSPENDED")}
              >
                {updating === seller.id ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Ban className="size-3.5" />
                )}
                Suspend
              </Button>
              <Button
                size="sm"
                className="gap-1.5 bg-green-600 text-white hover:bg-green-700"
                disabled={!!updating}
                onClick={() => handleAction(seller.id, "ACTIVE")}
              >
                {updating === seller.id ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <UserCheck className="size-3.5" />
                )}
                Approve
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
