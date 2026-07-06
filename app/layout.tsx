import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../lib/env'
import { Providers } from './providers'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-display' })

export const metadata: Metadata = {
  title: 'SystemLooks AI - Ative seu Sistema',
  description: 'Analise sua aparência com IA e receba recomendações personalizadas',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
