export default function ForgotPasswordPage() {
  return (
    <main className="max-w-md mx-auto px-4 py-20">
      <h1 className="text-3xl font-semibold mb-2">Forgot Password</h1>
      <p className="text-muted-foreground mb-8">
        Enter your email and we&apos;ll send you a reset link.
      </p>
      <form className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="your@email.com"
          className="border rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <button
          type="submit"
          className="bg-primary text-primary-foreground rounded-md px-4 py-2.5 text-sm font-medium"
        >
          Send reset link
        </button>
      </form>
    </main>
  )
}
