"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Camera, Mail, User, Shield, Save, Loader2,
  LogOut, LayoutDashboard, Phone, MapPin, Building2, Hash
} from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

import { authClient } from "@/lib/auth-client"
import { ROLE } from "@/constants/role"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// ── Types ─────────────────────────────────────────────────────────────────────
interface DeliveryInfo {
  phone:      string
  address:    string
  city:       string
  district:   string
  postalCode: string
  country:    string
}

const EMPTY_DELIVERY: DeliveryInfo = {
  phone: "", address: "", city: "", district: "", postalCode: "", country: "",
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function getInitials(name?: string | null): string {
  if (!name) return "?"
  return name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
}

function getDashboardUrl(role?: string | null): string {
  if (role === ROLE.admin)  return "/admin-dashboard"
  if (role === ROLE.seller) return "/seller-dashboard"
  return "/dashboard"
}

function getRoleBadgeVariant(role?: string | null): "default" | "secondary" | "destructive" | "outline" {
  if (role === ROLE.admin)  return "destructive"
  if (role === ROLE.seller) return "default"
  return "secondary"
}

function getRoleLabel(role?: string | null): string {
  if (role === ROLE.admin)  return "Admin"
  if (role === ROLE.seller) return "Seller"
  return "Customer"
}

function storageKey(userId: string) {
  return `medistore_delivery_${userId}`
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()

  // ── Account info state ──────────────────────────────────────────────────────
  const [name,      setName]      = useState("")
  const [isSaving,  setIsSaving]  = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  // ── Delivery info state ─────────────────────────────────────────────────────
  const [delivery,        setDelivery]        = useState<DeliveryInfo>(EMPTY_DELIVERY)
  const [isSavingDelivery, setIsSavingDelivery] = useState(false)

  // Seed name once session loads
  if (!isPending && session?.user && !isEditing && name === "") {
    setName(session.user.name ?? "")
  }

  // Load saved delivery info from localStorage when user is known
  useEffect(() => {
    if (!session?.user?.id) return
    try {
      const saved = localStorage.getItem(storageKey(session.user.id))
      if (saved) setDelivery(JSON.parse(saved) as DeliveryInfo)
    } catch { /* ignore */ }
  }, [session?.user?.id])

  const handleSignOut = async () => {
    await authClient.signOut()
    router.push("/login")
    router.refresh()
  }

  // ── Save account info ───────────────────────────────────────────────────────
  const handleSaveAccount = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) { toast.error("Name cannot be empty."); return }
    setIsSaving(true)
    const { error } = await authClient.updateUser({ name: name.trim() })
    setIsSaving(false)
    if (error) { toast.error(error.message ?? "Failed to update profile."); return }
    toast.success("Profile updated!")
    setIsEditing(false)
    router.refresh()
  }

  // ── Save delivery info ──────────────────────────────────────────────────────
  const handleSaveDelivery = (e: React.FormEvent) => {
    e.preventDefault()
    if (!session?.user?.id) return
    setIsSavingDelivery(true)
    try {
      localStorage.setItem(storageKey(session.user.id), JSON.stringify(delivery))
      toast.success("Delivery info saved!")
    } catch {
      toast.error("Could not save delivery info.")
    }
    setIsSavingDelivery(false)
  }

  const setDeliveryField = (field: keyof DeliveryInfo) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setDelivery((prev) => ({ ...prev, [field]: e.target.value }))

  // ── Loading ─────────────────────────────────────────────────────────────────
  if (isPending) {
    return (
      <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    )
  }

  // ── Not logged in ───────────────────────────────────────────────────────────
  if (!session?.user) {
    return (
      <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <Shield className="size-16 text-muted-foreground" />
        <h2 className="text-2xl font-bold">You&apos;re not signed in</h2>
        <p className="text-muted-foreground">Please log in to view your profile.</p>
        <Button asChild><Link href="/login">Go to Login</Link></Button>
      </div>
    )
  }

  const { name: userName, email, image, role } = session.user as {
    name?: string; email?: string; image?: string; role?: string
  }

  const rawCreatedAt = (session.user as unknown as { createdAt?: string | Date }).createdAt
  const joinedDate = rawCreatedAt
    ? new Date(rawCreatedAt).toLocaleDateString("en-US", {
        year: "numeric", month: "long", day: "numeric",
      })
    : null

  return (
    <div className="container mx-auto max-w-3xl px-4 py-10">

      {/* ── Page title ──────────────────────────────────────────────────── */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
        <p className="mt-1 text-muted-foreground">
          Manage your account details and preferences.
        </p>
      </div>

      {/* ── Avatar card ─────────────────────────────────────────────────── */}
      <Card className="mb-6">
        <CardContent className="flex flex-col items-center gap-4 pt-8 pb-6 sm:flex-row sm:items-start sm:gap-6">
          <div className="relative shrink-0">
            <Avatar className="size-24 ring-4 ring-primary/20">
              <AvatarImage src={image ?? ""} alt={userName ?? "User"} />
              <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                {getInitials(userName)}
              </AvatarFallback>
            </Avatar>
            <div className="absolute bottom-0 right-0 flex size-7 cursor-pointer items-center justify-center rounded-full border-2 border-background bg-primary text-primary-foreground shadow">
              <Camera className="size-3.5" />
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-2 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <h2 className="text-xl font-bold">{userName ?? "User"}</h2>
              <Badge variant={getRoleBadgeVariant(role)} className="text-xs">
                {getRoleLabel(role)}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{email}</p>
            {joinedDate && (
              <p className="text-xs text-muted-foreground">Member since {joinedDate}</p>
            )}
            {/* show saved phone/location under name if filled */}
            {(delivery.phone || delivery.city) && (
              <div className="flex flex-wrap justify-center gap-3 text-xs text-muted-foreground sm:justify-start">
                {delivery.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="size-3" />{delivery.phone}
                  </span>
                )}
                {delivery.city && (
                  <span className="flex items-center gap-1">
                    <MapPin className="size-3" />
                    {[delivery.city, delivery.country].filter(Boolean).join(", ")}
                  </span>
                )}
              </div>
            )}
            <div className="mt-2 flex flex-wrap justify-center gap-2 sm:justify-start">
              <Button asChild size="sm" variant="outline" className="gap-1.5">
                <Link href={getDashboardUrl(role)}>
                  <LayoutDashboard className="size-3.5" />Dashboard
                </Link>
              </Button>
              <Button size="sm" variant="destructive" className="gap-1.5" onClick={handleSignOut}>
                <LogOut className="size-3.5" />Sign Out
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Account information ──────────────────────────────────────────── */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>Update your display name.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveAccount} className="space-y-5">

            <div className="space-y-1.5">
              <Label htmlFor="profile-name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="profile-name"
                  type="text"
                  placeholder="Your name"
                  className="pl-10"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setIsEditing(true) }}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="profile-email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="profile-email"
                  type="email"
                  value={email ?? ""}
                  readOnly
                  className="pl-10 cursor-not-allowed bg-muted/40 text-muted-foreground"
                />
              </div>
              <p className="text-xs text-muted-foreground">Email cannot be changed here.</p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="profile-role">Role</Label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="profile-role"
                  type="text"
                  value={getRoleLabel(role)}
                  readOnly
                  className="pl-10 cursor-not-allowed bg-muted/40 text-muted-foreground"
                />
              </div>
            </div>

            <Separator />

            <Button type="submit" className="gap-2" disabled={isSaving}>
              {isSaving ? (
                <><Loader2 className="size-4 animate-spin" />Saving…</>
              ) : (
                <><Save className="size-4" />Save Changes</>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* ── Delivery address & contact ───────────────────────────────────── */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <MapPin className="size-5 text-primary" />
            <div>
              <CardTitle>Delivery Address &amp; Contact</CardTitle>
              <CardDescription className="mt-0.5">
                Used for order deliveries. Saved on this device.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveDelivery} className="space-y-5">

            {/* Phone */}
            <div className="space-y-1.5">
              <Label htmlFor="delivery-phone">Contact Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="delivery-phone"
                  type="tel"
                  placeholder="+880 1XXX-XXXXXX"
                  className="pl-10"
                  value={delivery.phone}
                  onChange={setDeliveryField("phone")}
                />
              </div>
            </div>

            {/* Address line */}
            <div className="space-y-1.5">
              <Label htmlFor="delivery-address">Street Address</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="delivery-address"
                  type="text"
                  placeholder="House no., Road no., Area"
                  className="pl-10"
                  value={delivery.address}
                  onChange={setDeliveryField("address")}
                />
              </div>
            </div>

            {/* City + District */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="delivery-city">City</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="delivery-city"
                    type="text"
                    placeholder="e.g. Dhaka"
                    className="pl-10"
                    value={delivery.city}
                    onChange={setDeliveryField("city")}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="delivery-district">District</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="delivery-district"
                    type="text"
                    placeholder="e.g. Dhaka South"
                    className="pl-10"
                    value={delivery.district}
                    onChange={setDeliveryField("district")}
                  />
                </div>
              </div>
            </div>

            {/* Postal code + Country */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="delivery-postal">Postal Code</Label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="delivery-postal"
                    type="text"
                    placeholder="e.g. 1212"
                    className="pl-10"
                    value={delivery.postalCode}
                    onChange={setDeliveryField("postalCode")}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="delivery-country">Country</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="delivery-country"
                    type="text"
                    placeholder="e.g. Bangladesh"
                    className="pl-10"
                    value={delivery.country}
                    onChange={setDeliveryField("country")}
                  />
                </div>
              </div>
            </div>

            <Separator />

            <Button type="submit" className="gap-2" disabled={isSavingDelivery}>
              {isSavingDelivery ? (
                <><Loader2 className="size-4 animate-spin" />Saving…</>
              ) : (
                <><Save className="size-4" />Save Delivery Info</>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

    </div>
  )
}
