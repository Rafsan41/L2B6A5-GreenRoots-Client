import { env } from '@/env'
import { cookies } from 'next/headers'

const AUTH_URL = env.AUTH_URL

export const userService = {
    /**
     * Fetch the current session from the auth server.
     *
     * @param cookieOverride - Pass `request.headers.get('cookie')` when calling
     *   from middleware / Edge runtime, where `next/headers` cookies() is not
     *   available.  Omit (or pass undefined) in Server Components / Route
     *   Handlers where `next/headers` works normally.
     */
    getSession: async function (cookieOverride?: string) {
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

            const res = await fetch(`${AUTH_URL}/get-session`, {
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

