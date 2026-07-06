import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <h1 className="font-display text-4xl font-bold sm:text-5xl">
        <span className="bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
          SystemLooks AI
        </span>
      </h1>
      <p className="mt-4 max-w-md text-white/60">
        Analise sua aparência com IA e receba recomendações personalizadas de estilo, skincare, treino e mais.
      </p>
      <div className="mt-8 flex gap-4">
        <Link href="/login" className="btn-primary">
          Entrar
        </Link>
        <Link href="/register" className="btn-secondary">
          Criar conta
        </Link>
      </div>
    </div>
  )
}
