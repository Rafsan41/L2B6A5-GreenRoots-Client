"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  User, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2,
} from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { authClient } from "@/lib/auth-client"

// ── Password strength ─────────────────────────────────────────────────────────
function getStrength(password: string): 0 | 1 | 2 | 3 | 4 {
  if (!password) return 0
  let score = 0
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  return score as 0 | 1 | 2 | 3 | 4
}

const strengthMeta = [
  { label: "",       color: "bg-border" },
  { label: "Weak",   color: "bg-destructive" },
  { label: "Fair",   color: "bg-orange-400" },
  { label: "Good",   color: "bg-yellow-400" },
  { label: "Strong", color: "bg-primary" },
] as const

// ── Component ─────────────────────────────────────────────────────────────────
export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter()

  const [role, setRole]                 = useState<"customer" | "seller">("customer")
  const [name, setName]                 = useState("")
  const [email, setEmail]               = useState("")
  const [password, setPassword]         = useState("")
  const [confirmPassword, setConfirm]   = useState("")
  const [showPassword, setShowPass]     = useState(false)
  const [showConfirm, setShowConfirm]   = useState(false)
  const [agreed, setAgreed]             = useState(false)
  const [isLoading, setIsLoading]       = useState(false)

  const strength = getStrength(password)
  const meta     = strengthMeta[strength]

  // ── Google OAuth ─────────────────────────────────────────────────────────────
  const handleGoogleSignUp = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/home`,
    })
  }

  // ── Email / password sign-up ──────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!agreed) return

    if (password !== confirmPassword) {
      toast.error("Passwords do not match. Please try again.")
      return
    }
    if (strength < 2) {
      toast.error("Please choose a stronger password.")
      return
    }

    setIsLoading(true)

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (authClient.signUp.email as any)({
        name,
        email,
        password,
        role: role.toUpperCase(),
      })

      if (error) {
        toast.error(error.message ?? "Sign up failed. Please try again.")
        return
      }

      const isSeller = role === "seller"
      toast.success(
        isSeller
          ? "Account created! Verify your email, then wait for admin approval before logging in."
          : "Account created! Check your inbox for a verification email.",
        { duration: 8000 }
      )
      if (isSeller) router.push("/seller-dashboard")
      else          router.push("/home")
    } catch {
      toast.error("Cannot reach the server. Make sure the backend is running.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("space-y-4", className)}
      {...props}
    >
      {/* Heading */}
      <div style={{ marginBottom: 4 }}>
        <h1
          style={{
            fontFamily:    "var(--font-cormorant), Georgia, serif",
            fontWeight:    500,
            fontSize:      36,
            lineHeight:    1.05,
            letterSpacing: "-0.02em",
            color:         "var(--ink)",
            marginBottom:  6,
          }}
        >
          Create your{" "}
          <em style={{ color: "var(--moss)", fontStyle: "italic" }}>account.</em>
        </h1>
        <p
          style={{
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontStyle:  "italic",
            fontSize:   16,
            color:      "var(--bark)",
            lineHeight: 1.5,
          }}
        >
          Join our community of herb enthusiasts
        </p>
      </div>

      {/* Role toggle */}
      <div className="space-y-1.5">
        <Label
          style={{
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontStyle:  "italic",
            fontSize:   14,
            color:      "var(--bark)",
          }}
        >
          I am a
        </Label>
        <div
          className="flex p-1"
          style={{
            borderRadius: 12,
            border:       "1px solid var(--rule)",
            background:   "var(--cream)",
          }}
        >
          {(["customer", "seller"] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg py-2 transition-all duration-200"
              style={
                role === r
                  ? {
                      background:  "var(--background)",
                      color:       "var(--ink)",
                      fontFamily:  "var(--font-cormorant), Georgia, serif",
                      fontSize:    14,
                      fontWeight:  500,
                      boxShadow:   "0 1px 4px oklch(0 0 0 / 0.10)",
                      border:      "1px solid var(--rule)",
                    }
                  : {
                      background:  "transparent",
                      color:       "var(--bark)",
                      fontFamily:  "var(--font-cormorant), Georgia, serif",
                      fontStyle:   "italic",
                      fontSize:    14,
                      border:      "1px solid transparent",
                    }
              }
            >
              <span style={{ fontSize: 14 }}>
                {r === "customer" ? "☘" : "❧"}
              </span>
              {r === "customer" ? "Customer" : "Seller / Grower"}
            </button>
          ))}
        </div>
      </div>

      {/* Full name */}
      <div className="space-y-1.5">
        <Label htmlFor="signup-name">Full name</Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="signup-name"
            type="text"
            placeholder="Rafsan Ahmed"
            autoComplete="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <Label htmlFor="signup-email">Email address</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="signup-email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <Label htmlFor="signup-password">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="signup-password"
            type={showPassword ? "text" : "password"}
            placeholder="Min. 8 characters"
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPass((p) => !p)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>

        {/* Strength meter */}
        {password.length > 0 && (
          <div className="space-y-1">
            <div className="flex gap-1">
              {([1, 2, 3, 4] as const).map((level) => (
                <div
                  key={level}
                  className={cn(
                    "h-1 flex-1 rounded-full transition-all duration-300",
                    level <= strength ? meta.color : "bg-border"
                  )}
                />
              ))}
            </div>
            {meta.label && (
              <p
                className={cn(
                  "text-xs font-medium",
                  strength === 1 && "text-destructive",
                  strength === 2 && "text-orange-400",
                  strength === 3 && "text-yellow-500",
                  strength === 4 && "text-primary"
                )}
              >
                {meta.label} password
                {strength < 3 && (
                  <span className="ml-1 font-normal text-muted-foreground">
                    — add uppercase, numbers or symbols
                  </span>
                )}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Confirm password */}
      <div className="space-y-1.5">
        <Label htmlFor="signup-confirm">Confirm password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="signup-confirm"
            type={showConfirm ? "text" : "password"}
            placeholder="Repeat your password"
            autoComplete="new-password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirm(e.target.value)}
            className={cn(
              "pl-10 pr-10",
              confirmPassword && password !== confirmPassword && "border-destructive focus-visible:ring-destructive"
            )}
          />
          <button
            type="button"
            onClick={() => setShowConfirm((p) => !p)}
            aria-label={showConfirm ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
          >
            {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
        {confirmPassword && password !== confirmPassword && (
          <p className="text-xs text-destructive">Passwords do not match</p>
        )}
      </div>

      {/* Terms */}
      <div className="flex items-start gap-2.5 pt-1">
        <Checkbox
          id="signup-terms"
          checked={agreed}
          onCheckedChange={(v) => setAgreed(v === true)}
          className="mt-0.5"
        />
        <label
          htmlFor="signup-terms"
          className="cursor-pointer text-sm leading-snug text-muted-foreground"
        >
          I agree to GreenRoots&apos;{" "}
          <Link href="/terms" style={{ color: "var(--moss)", textDecoration: "underline", textUnderlineOffset: 3 }}>
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" style={{ color: "var(--moss)", textDecoration: "underline", textUnderlineOffset: 3 }}>
            Privacy Policy
          </Link>
        </label>
      </div>

      {/* Submit */}
      <Button
        type="submit"
        className="w-full gap-2"
        size="lg"
        disabled={isLoading || !agreed}
      >
        {isLoading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Creating account…
          </>
        ) : (
          <>
            Create Account
            <ArrowRight className="size-4" />
          </>
        )}
      </Button>

      {/* Divider */}
      <div className="relative flex items-center">
        <Separator className="flex-1" />
        <span className="mx-3 text-xs text-muted-foreground">or</span>
        <Separator className="flex-1" />
      </div>

      {/* Google OAuth */}
      <Button
        onClick={handleGoogleSignUp}
        variant="outline"
        type="button"
        className="w-full gap-2.5"
        size="lg"
      >
        <svg className="size-4 shrink-0" viewBox="0 0 24 24" aria-hidden>
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
        Continue with Google
      </Button>

      {/* Sign in link */}
      <p
        style={{
          textAlign:  "center",
          fontFamily: "var(--font-cormorant), Georgia, serif",
          fontStyle:  "italic",
          fontSize:   15,
          color:      "var(--bark)",
        }}
      >
        Already have an account?{" "}
        <Link
          href="/login"
          style={{ color: "var(--moss)", fontWeight: 600, fontStyle: "normal", textDecoration: "underline", textUnderlineOffset: 3 }}
        >
          Sign in
        </Link>
      </p>
    </form>
  )
}
