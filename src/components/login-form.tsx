"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, MailCheck } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { authClient } from "@/lib/auth-client"
import { ROLE } from "@/constants/role"

export function LoginForm({ className, ...props }: React.ComponentProps<"form">) {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [needsVerification, setNeedsVerification] = useState(false)
  const [resending, setResending] = useState(false)

  const handleGoogleLogIn = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/home`,
    })
  }

  const handleResendVerification = async () => {
    if (!email) {
      toast.error("Enter your email address first.")
      return
    }
    setResending(true)
    try {
      await authClient.sendVerificationEmail({ email, callbackURL: "/home" })
      toast.success("Verification email sent! Check your inbox.")
    } catch {
      toast.error("Could not resend verification email. Try again later.")
    } finally {
      setResending(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setNeedsVerification(false)

    const { data, error } = await authClient.signIn.email({
      email,
      password,
    })

    setIsLoading(false)

    if (error) {
      const msg = (error.message ?? "").toLowerCase()
      if (msg.includes("verify") || msg.includes("verified") || error.code === "EMAIL_NOT_VERIFIED") {
        setNeedsVerification(true)
        toast.error("Please verify your email before signing in.")
      } else {
        toast.error(error.message ?? "Sign in failed. Please try again.")
      }
      return
    }

    const user = data?.user as { role?: string; status?: string } | null
    const role = user?.role?.toUpperCase()
    const status = user?.status?.toUpperCase()

    if (status === "PENDING") {
      await authClient.signOut()
      toast.error("Your seller account is pending admin approval. You'll be notified once approved.")
      return
    }

    if (status === "BANNED" || status === "SUSPENDED") {
      await authClient.signOut()
      toast.error("Your account has been suspended. Please contact support.")
      return
    }

    toast.success("Welcome back!")

    if (role === ROLE.admin) router.push("/admin-dashboard")
    else if (role === ROLE.seller) router.push("/seller-dashboard")
    else router.push("/home")

    router.refresh()
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("space-y-5", className)}
      {...props}
    >
      {/* Heading */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Sign in to your MediStore account to continue
        </p>
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <Label htmlFor="login-email">Email address</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="login-email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            required
            className="pl-10"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="login-password">Password</Label>
          <Link
            href="/forgot-password"
            className="text-xs text-primary underline-offset-4 hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="login-password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            autoComplete="current-password"
            required
            className="pl-10 pr-10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button

            type="button"
            onClick={() => setShowPassword((p) => !p)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
          >
            {showPassword ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        </div>
      </div>

      {/* Email not verified banner */}
      {needsVerification && (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3 dark:border-yellow-800/50 dark:bg-yellow-900/20">
          <div className="flex items-start gap-2.5">
            <MailCheck className="mt-0.5 size-4 shrink-0 text-yellow-600 dark:text-yellow-400" />
            <div className="flex-1 space-y-1.5">
              <p className="text-xs font-medium text-yellow-800 dark:text-yellow-300">
                Email not verified
              </p>
              <p className="text-xs text-yellow-700 dark:text-yellow-400">
                Check your inbox and click the verification link. Didn&apos;t receive it?
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 gap-1.5 border-yellow-300 text-yellow-700 text-xs hover:bg-yellow-100 dark:border-yellow-700 dark:text-yellow-300 dark:hover:bg-yellow-900/40"
                disabled={resending}
                onClick={handleResendVerification}
              >
                {resending
                  ? <><Loader2 className="size-3 animate-spin" />Sending…</>
                  : "Resend verification email"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Submit */}
      <Button
        type="submit"
        className="w-full gap-2"
        size="lg"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Signing in…
          </>
        ) : (
          <>
            Sign In
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
      <Button onClick={() => handleGoogleLogIn()}
        variant="outline"
        type="button"
        className="w-full gap-2.5"
        size="lg"
      >
        {/* Google colour logo */}
        <svg className="size-4 shrink-0" viewBox="0 0 24 24" aria-hidden>
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        Continue with Google
      </Button>

      {/* Sign up link */}
      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-semibold text-primary underline-offset-4 hover:underline"
        >
          Create one free
        </Link>
      </p>
    </form>
  )
}
