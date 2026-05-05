"use client"

import { useState } from "react"
import { Bell, Lock, Palette, Shield, Trash2, Loader2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"

// ── Section card ──────────────────────────────────────────────────────────────
function SettingsCard({ icon: Icon, title, description, children }: {
  icon: React.ElementType
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-xl border bg-card">
      <div className="flex items-start gap-4 p-5 border-b">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-5" />
        </div>
        <div>
          <p className="font-semibold text-sm">{title}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        </div>
      </div>
      <div className="p-5">{children}</div>
    </div>
  )
}

// ── Toggle row ────────────────────────────────────────────────────────────────
function ToggleRow({ label, description, checked, onChange }: {
  label: string
  description: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
          checked ? "bg-primary" : "bg-muted"
        }`}
        role="switch"
        aria-checked={checked}
      >
        <span className={`pointer-events-none inline-block size-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          checked ? "translate-x-4" : "translate-x-0"
        }`} />
      </button>
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────────
export default function SettingsPage() {
  const router = useRouter()

  // Notification prefs
  const [notifs, setNotifs] = useState({
    orderUpdates:     true,
    promotions:       false,
    newsletter:       true,
    reviewAlerts:     true,
    securityAlerts:   true,
  })

  // Password change
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" })
  const [pwSaving, setPwSaving] = useState(false)
  const [pwSaved, setPwSaved]   = useState(false)

  // Delete account
  const [deleteConfirm, setDeleteConfirm] = useState("")
  const [deleting, setDeleting]           = useState(false)

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    if (pwForm.next !== pwForm.confirm) {
      toast.error("New passwords do not match")
      return
    }
    if (pwForm.next.length < 8) {
      toast.error("Password must be at least 8 characters")
      return
    }
    setPwSaving(true)
    try {
      await authClient.changePassword({
        currentPassword: pwForm.current,
        newPassword: pwForm.next,
        revokeOtherSessions: false,
      })
      setPwSaved(true)
      setPwForm({ current: "", next: "", confirm: "" })
      toast.success("Password changed successfully")
      setTimeout(() => setPwSaved(false), 3000)
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to change password")
    } finally {
      setPwSaving(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== "DELETE") {
      toast.error('Type "DELETE" to confirm')
      return
    }
    setDeleting(true)
    try {
      await authClient.deleteUser()
      toast.success("Account deleted")
      router.push("/")
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to delete account")
      setDeleting(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 py-8 px-4">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your account preferences and security
        </p>
      </div>

      {/* ── Notifications ── */}
      <SettingsCard
        icon={Bell}
        title="Notifications"
        description="Choose what updates you want to receive"
      >
        <div className="divide-y">
          <ToggleRow
            label="Order updates"
            description="Get notified when your order status changes"
            checked={notifs.orderUpdates}
            onChange={(v) => setNotifs((p) => ({ ...p, orderUpdates: v }))}
          />
          <ToggleRow
            label="Promotions & offers"
            description="Receive discount codes and seasonal offers"
            checked={notifs.promotions}
            onChange={(v) => setNotifs((p) => ({ ...p, promotions: v }))}
          />
          <ToggleRow
            label="The Herb Letter"
            description="Weekly newsletter with herbal wellness tips"
            checked={notifs.newsletter}
            onChange={(v) => setNotifs((p) => ({ ...p, newsletter: v }))}
          />
          <ToggleRow
            label="Review alerts"
            description="Know when someone reviews your purchase"
            checked={notifs.reviewAlerts}
            onChange={(v) => setNotifs((p) => ({ ...p, reviewAlerts: v }))}
          />
          <ToggleRow
            label="Security alerts"
            description="Important alerts about your account security"
            checked={notifs.securityAlerts}
            onChange={(v) => setNotifs((p) => ({ ...p, securityAlerts: v }))}
          />
        </div>
        <div className="mt-4 flex justify-end">
          <Button size="sm" onClick={() => toast.success("Notification preferences saved")}>
            Save preferences
          </Button>
        </div>
      </SettingsCard>

      {/* ── Password ── */}
      <SettingsCard
        icon={Lock}
        title="Change Password"
        description="Update your password to keep your account secure"
      >
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="current-pw">Current password</Label>
            <Input
              id="current-pw"
              type="password"
              placeholder="Enter current password"
              value={pwForm.current}
              onChange={(e) => setPwForm((p) => ({ ...p, current: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="new-pw">New password</Label>
            <Input
              id="new-pw"
              type="password"
              placeholder="Min. 8 characters"
              value={pwForm.next}
              onChange={(e) => setPwForm((p) => ({ ...p, next: e.target.value }))}
              required
              minLength={8}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="confirm-pw">Confirm new password</Label>
            <Input
              id="confirm-pw"
              type="password"
              placeholder="Re-enter new password"
              value={pwForm.confirm}
              onChange={(e) => setPwForm((p) => ({ ...p, confirm: e.target.value }))}
              required
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" size="sm" disabled={pwSaving}>
              {pwSaving ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : pwSaved ? (
                <Check className="mr-2 size-4 text-green-500" />
              ) : null}
              {pwSaved ? "Password changed!" : "Update password"}
            </Button>
          </div>
        </form>
      </SettingsCard>

      {/* ── Privacy & Security ── */}
      <SettingsCard
        icon={Shield}
        title="Privacy & Security"
        description="Control your privacy and data settings"
      >
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <p className="font-medium">Two-factor authentication</p>
              <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
            </div>
            <span className="text-xs rounded-full bg-muted px-2.5 py-0.5 font-medium text-muted-foreground">
              Coming soon
            </span>
          </div>
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <p className="font-medium">Active sessions</p>
              <p className="text-xs text-muted-foreground">Manage devices logged into your account</p>
            </div>
            <Button size="sm" variant="outline"
              onClick={() => toast.info("Session management coming soon")}>
              Manage
            </Button>
          </div>
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <p className="font-medium">Download my data</p>
              <p className="text-xs text-muted-foreground">Export your orders, reviews, and profile</p>
            </div>
            <Button size="sm" variant="outline"
              onClick={() => toast.info("Data export coming soon")}>
              Export
            </Button>
          </div>
        </div>
      </SettingsCard>

      {/* ── Danger zone ── */}
      <SettingsCard
        icon={Trash2}
        title="Danger Zone"
        description="Irreversible actions — proceed with caution"
      >
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Deleting your account will permanently remove all your data including orders,
            reviews, and profile information. This action <strong>cannot be undone</strong>.
          </p>
          <Separator />
          <div className="space-y-2">
            <Label htmlFor="delete-confirm" className="text-sm">
              Type <span className="font-mono font-bold text-destructive">DELETE</span> to confirm
            </Label>
            <div className="flex gap-2">
              <Input
                id="delete-confirm"
                placeholder="DELETE"
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                className="max-w-[200px] border-destructive/50 focus-visible:ring-destructive"
              />
              <Button
                variant="destructive"
                size="sm"
                disabled={deleteConfirm !== "DELETE" || deleting}
                onClick={handleDeleteAccount}
              >
                {deleting && <Loader2 className="mr-2 size-4 animate-spin" />}
                Delete account
              </Button>
            </div>
          </div>
        </div>
      </SettingsCard>
    </div>
  )
}
