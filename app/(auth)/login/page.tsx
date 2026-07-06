"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Zap, Loader as Loader2 } from "lucide-react";
import { loginSchema, LoginInput } from "@/lib/validations";
import { AuthShell } from "@/components/auth/AuthShell";

export default function LoginPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(data: LoginInput) {
    setServerError(null);
    setLoading(true);

    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      if (result.error === "EMAIL_NAO_VERIFICADO") {
        setServerError("Confirme seu email antes de entrar. Verifique sua caixa de entrada.");
      } else {
        setServerError("Email ou senha incorretos.");
      }
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <AuthShell title="Bem-vindo de volta" subtitle="Acesse seu Sistema para continuar sua evolução.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm text-white/60">Email</label>
          <input type="email" className="input-field" placeholder="voce@email.com" {...register("email")} />
          {errors.email && <p className="mt-1 text-xs text-rose-400">{errors.email.message}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-sm text-white/60">Senha</label>
          <input type="password" className="input-field" placeholder="••••••••" {...register("password")} />
          {errors.password && <p className="mt-1 text-xs text-rose-400">{errors.password.message}</p>}
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-white/50">
            <input type="checkbox" className="rounded border-border" {...register("remember")} />
            Lembrar login
          </label>
          <Link href="/forgot-password" className="text-neon-blue-bright hover:underline">
            Esqueci minha senha
          </Link>
        </div>

        {serverError && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-rose-400">
            {serverError}
          </motion.p>
        )}

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Entrar"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-white/40">
        Ainda não tem conta?{" "}
        <Link href="/register" className="font-medium text-neon-blue-bright hover:underline">
          Criar conta
        </Link>
      </p>
    </AuthShell>
  );
}
