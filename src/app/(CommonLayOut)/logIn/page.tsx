import Link from "next/link"
import { LoginForm } from "@/components/login-form"
import LoginBrandPanel from "@/components/auth/LoginBrandPanel"

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">

      {/* ── Left: Form side ──────────────────────────────────── */}
      <div className="flex flex-col bg-background">

        {/* Logo bar */}
        <header className="flex items-center gap-3 p-6 md:p-8">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <svg
              width="26" height="26"
              viewBox="0 0 32 32"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.2}
              style={{ color: "var(--moss)" }}
            >
              <path d="M16 4 C 16 4, 12 8, 12 13 C 12 17, 14 19, 16 19 C 18 19, 20 17, 20 13 C 20 8, 16 4, 16 4 Z" />
              <path d="M16 19 L 16 28" />
              <path d="M12 22 C 9 22, 8 24, 8 26" />
              <path d="M20 22 C 23 22, 24 24, 24 26" />
            </svg>
            <span
              style={{
                fontFamily: "var(--font-cormorant), Georgia, serif",
                fontWeight: 500,
                fontSize:   22,
                lineHeight: 1,
                color:      "var(--ink)",
              }}
            >
              GreenRoots
              <span style={{ color: "var(--clay)", marginLeft: 1 }}>☘</span>
            </span>
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
          <p
            style={{
              fontFamily: "var(--font-cormorant), Georgia, serif",
              fontStyle:  "italic",
              fontSize:   13,
              color:      "var(--bark-2)",
            }}
          >
            By signing in you agree to our{" "}
            <Link href="/terms" style={{ color: "var(--moss)", textDecoration: "underline", textUnderlineOffset: 3 }}>
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" style={{ color: "var(--moss)", textDecoration: "underline", textUnderlineOffset: 3 }}>
              Privacy Policy
            </Link>
            .
          </p>
        </footer>
      </div>

      {/* ── Right: Brand panel ───────────────────────────────── */}
      <LoginBrandPanel />
    </div>
  )
}
