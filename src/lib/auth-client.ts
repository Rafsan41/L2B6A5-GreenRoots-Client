import { createAuthClient } from "better-auth/react"

export const AUTH_BASE_URL = ""

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_FRONTEND_URL,
})
