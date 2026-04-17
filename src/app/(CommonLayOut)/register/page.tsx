import Link from "next/link"
import { Pill } from "lucide-react"
import { SignupForm } from "@/components/signup-form"
import RegisterBrandPanel from "@/components/auth/RegisterBrandPanel"

// ── Page ───────────────────────────────────────────────────
export default function RegisterPage() {
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

        {/* Form — scrollable if viewport is short */}
        <main className="flex flex-1 items-start justify-center overflow-y-auto px-6 py-6 md:items-center md:px-10">
          <div className="w-full max-w-sm">
            <SignupForm />
          </div>
        </main>

        {/* Footer */}
        <footer className="p-6 text-center md:p-8">
          <p className="text-xs text-muted-foreground">
            Protected by industry-standard encryption.{" "}
            <Link href="/privacy" className="underline underline-offset-4 hover:text-foreground">
              Privacy Policy
            </Link>
          </p>
        </footer>
      </div>

      {/* ── Right: Brand panel ─────────────────────────────── */}
      <RegisterBrandPanel />
    </div>
  )
}
