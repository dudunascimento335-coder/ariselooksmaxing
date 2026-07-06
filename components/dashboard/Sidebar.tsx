'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  LayoutDashboard,
  Sparkles,
  Scissors,
  User,
  Dumbbell,
  Utensils,
  Droplets,
  Palette,
  CheckSquare,
  CreditCard,
  LogOut,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const links = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/system', label: 'Nova Análise', icon: Sparkles },
  { href: '/haircut', label: 'Corte', icon: Scissors },
  { href: '/beard', label: 'Barba', icon: User },
  { href: '/skincare', label: 'Skincare', icon: Droplets },
  { href: '/workout', label: 'Treino', icon: Dumbbell },
  { href: '/diet', label: 'Dieta', icon: Utensils },
  { href: '/style', label: 'Estilo', icon: Palette },
  { href: '/hygiene', label: 'Higiene', icon: CheckSquare },
  { href: '/missions', label: 'Missões', icon: CheckSquare },
  { href: '/plans', label: 'Planos', icon: CreditCard },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed inset-y-0 left-0 w-64 border-r border-white/5 bg-background/80 backdrop-blur-sm">
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center border-b border-white/5 px-6">
          <Link href="/" className="bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-lg font-bold text-transparent">
            SystemLooks
          </Link>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {links.map((link) => {
            const isActive = pathname.startsWith(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-white/10 text-white'
                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                )}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-white/5 p-4">
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/60 hover:bg-white/5 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </div>
      </div>
    </aside>
  )
}
