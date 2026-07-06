import { NextRequest } from 'next/server'
import { headers } from 'next/headers'

const limits: Record<string, { windowMs: number; max: number }> = {
  auth: { windowMs: 60_000, max: 5 },
  forgotPassword: { windowMs: 60_000, max: 3 },
  analyze: { windowMs: 60_000, max: 1 },
}

const requests = new Map<string, { count: number; resetAt: number }>()

export function getClientIp(headers: Headers): string {
  return headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
}

export async function consumeRateLimit(
  type: keyof typeof limits,
  key: string
): Promise<{ allowed: boolean; message?: string }> {
  const config = limits[type]
  if (!config) return { allowed: true }

  const now = Date.now()
  const record = requests.get(key)

  if (!record || record.resetAt < now) {
    requests.set(key, { count: 1, resetAt: now + config.windowMs })
    return { allowed: true }
  }

  if (record.count >= config.max) {
    const waitMs = record.resetAt - now
    return {
      allowed: false,
      message: `Muitas tentativas. Aguarde ${Math.ceil(waitMs / 1000)} segundos.`,
    }
  }

  record.count++
  return { allowed: true }
}
