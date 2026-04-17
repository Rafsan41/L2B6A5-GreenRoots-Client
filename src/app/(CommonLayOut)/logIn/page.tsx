import Link from "next/link"
import { Pill } from "lucide-react"
import { LoginForm } from "@/components/login-form"
import LoginBrandPanel from "@/components/auth/LoginBrandPanel"

// ── Page ───────────────────────────────────────────────────
export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* ── Left: Form side ────────────────────────────────── */}
      <div className="flex flex-col bg-background">
        {/* Logo bar */}
        <header className="flex items-center gap-3 p-6 md:p-8">
          <Link href="/" className="flex items-center gap-2.5 font-semibold">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <Pill className="size-4.5" />
            </div>
            <span className="text-xl font-bold tracking-tight">MediStore</span>
          </Link>
        </header>

        {/* Form centred */}
        <main className="flex flex-1 items-center justify-center px-6 py-10 md:px-10">
          <div className="w-full max-w-sm">
            <LoginForm />
          </div>
        </main>

        {/* Footer */}
        <footer className="p-6 text-center md:p-8">
          <p className="text-xs text-muted-foreground">
            By signing in you agree to our{" "}
            <Link href="/terms" className="underline underline-offset-4 hover:text-foreground">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline underline-offset-4 hover:text-foreground">
              Privacy Policy
            </Link>
            .
          </p>
        </footer>
      </div>

      {/* ── Right: Brand panel ─────────────────────────────── */}
      <LoginBrandPanel />
    </div>
  )
}
