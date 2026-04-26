import { env } from '@/env'
import { cookies } from 'next/headers'

export const userService = {
    /**
     * Fetch the current session from the auth server.
     *
     * @param cookieOverride - Pass `request.headers.get('cookie')` when calling
     *   from middleware / Edge runtime, where `next/headers` cookies() is not
     *   available.  Omit (or pass undefined) in Server Components / Route
     *   Handlers where `next/headers` works normally.
     * @param baseUrlOverride - Override the auth base URL (used in middleware to
     *   derive it from the request origin instead of relying on AUTH_URL env var).
     */
    getSession: async function (cookieOverride?: string, baseUrlOverride?: string) {
        try {
            let cookieHeader: string

            if (cookieOverride !== undefined) {
                // Middleware / Edge context — use the raw header string
                cookieHeader = cookieOverride
            } else {
                // Server Component context — use next/headers
                const cookieStore = await cookies()
                cookieHeader = cookieStore.toString()
            }

            const authBase = baseUrlOverride ?? env.AUTH_URL
            const res = await fetch(`${authBase}/get-session`, {
                headers: { cookie: cookieHeader },
                cache: "no-store",
            })

            const session = await res.json()

            if (session === null) {
                return { data: null, error: { message: "Session missing" } }
            }

            return { data: session, error: null }

        } catch (error) {
            console.error("[userService.getSession]", error)
            return { data: null, error: { message: "Something went wrong" } }
        }
    }
}

