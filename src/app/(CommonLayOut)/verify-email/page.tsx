"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { CheckCircle2, XCircle, Loader2, Pill } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AUTH_BASE_URL } from "@/lib/auth-client"

type Status = "verifying" | "success" | "error"

export default function VerifyEmailPage() {
  const searchParams = useSearchParams()
  const router       = useRouter()
  const [status, setStatus] = useState<Status>("verifying")
  const [errMsg, setErrMsg] = useState("")

  useEffect(() => {
    const token = searchParams.get("token")

    if (!token) {
      setErrMsg("No verification token found. The link may be invalid or expired.")
      setStatus("error")
      return
    }

    // Navigate the browser to the backend verify endpoint.
    // The backend verifies the token, creates a session (autoSignInAfterVerification),
    // sets the session cookie, then redirects to callbackURL.
    const callbackURL = `${window.location.origin}/home`
    window.location.href = `${AUTH_BASE_URL}/api/auth/verify-email?token=${encodeURIComponent(token)}&callbackURL=${encodeURIComponent(callbackURL)}`

    // We set a fallback in case the redirect is slow
    const timer = setTimeout(() => setStatus("success"), 4000)
    return () => clearTimeout(timer)
  }, [searchParams])

  // ── Layouts ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-svh flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-sm rounded-2xl border bg-background shadow-lg p-8 text-center space-y-5">

        {/* Logo */}
        <div className="flex items-center justify-center gap-2 text-primary">
          <div className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Pill className="size-4" />
          </div>
          <span className="text-xl font-bold tracking-tight">MediStore</span>
        </div>

        {/* State icon */}
        {status === "verifying" && (
          <div className="space-y-3">
            <div className="flex justify-center">
              <Loader2 className="size-12 animate-spin text-primary" />
            </div>
            <h2 className="text-lg font-semibold">Verifying your email…</h2>
            <p className="text-sm text-muted-foreground">
              Please wait while we confirm your email address.
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-3">
            <div className="flex justify-center">
              <CheckCircle2 className="size-12 text-primary" />
            </div>
            <h2 className="text-lg font-semibold">Email verified!</h2>
            <p className="text-sm text-muted-foreground">
              Your account is active. You are being signed in…
            </p>
            <Button className="w-full" onClick={() => router.push("/home")}>
              Go to Home
            </Button>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-3">
            <div className="flex justify-center">
              <XCircle className="size-12 text-destructive" />
            </div>
            <h2 className="text-lg font-semibold">Verification failed</h2>
            <p className="text-sm text-muted-foreground">
              {errMsg || "This verification link is invalid or has expired."}
            </p>
            <div className="flex flex-col gap-2 pt-1">
              <Button className="w-full" onClick={() => router.push("/login")}>
                Back to Sign In
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push("/register")}
              >
                Create a new account
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
