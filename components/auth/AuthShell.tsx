import Link from 'next/link'

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-2xl font-bold text-transparent">
            SystemLooks
          </Link>
        </div>
        <div className="glass-strong rounded-2xl p-8">
          <h1 className="font-display text-xl font-bold">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-white/50">{subtitle}</p>}
          <div className="mt-6">{children}</div>
        </div>
      </div>
    </div>
  )
}
