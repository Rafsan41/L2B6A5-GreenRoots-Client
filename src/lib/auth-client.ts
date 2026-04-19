import { createAuthClient } from "better-auth/react"

// All API calls go through the Next.js proxy (/api/* → Vercel backend).
// This keeps cookies on the same origin (localhost:3000) so sessions work.
export const AUTH_BASE_URL = ""

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_FRONTEND_URL ?? "http://localhost:3000",
})