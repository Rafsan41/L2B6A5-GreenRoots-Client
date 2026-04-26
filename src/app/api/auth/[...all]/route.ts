import { type NextRequest } from 'next/server'

export const runtime = 'edge'

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL!

async function handler(req: NextRequest): Promise<Response> {
  const path = req.nextUrl.pathname   // /api/auth/callback/google
  const search = req.nextUrl.search   // ?state=...&code=...
  const target = `${BACKEND}${path}${search}`

  const headers = new Headers()
  for (const [key, value] of req.headers.entries()) {
    if (key.toLowerCase() === 'host') continue
    headers.set(key, value)
  }

  const init: RequestInit = {
    method: req.method,
    headers,
    redirect: 'manual',
  }

  if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
    // @ts-expect-error duplex is required for streaming bodies in some runtimes
    init.duplex = 'half'
    init.body = req.body
  }

  const res = await fetch(target, init)

  const resHeaders = new Headers()
  for (const [key, value] of res.headers.entries()) {
    if (key.toLowerCase() === 'set-cookie') {
      resHeaders.append(key, value)
    } else {
      resHeaders.set(key, value)
    }
  }

  return new Response(res.body, {
    status: res.status,
    statusText: res.statusText,
    headers: resHeaders,
  })
}

export const GET = handler
export const POST = handler
export const PUT = handler
export const PATCH = handler
export const DELETE = handler
