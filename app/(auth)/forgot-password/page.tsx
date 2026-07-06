"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader as Loader2, MailCheck } from "lucide-react";
import { forgotPasswordSchema } from "@/lib/validations";
import { AuthShell } from "@/components/auth/AuthShell";
import { z } from "zod";

type FormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(forgotPasswordSchema) });

  async function onSubmit(data: FormData) {
    setLoading(true);
    await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setLoading(false);
    setSent(true);
  }

  if (sent) {
    return (
      <AuthShell title="Verifique seu email" subtitle="">
        <div className="flex flex-col items-center gap-4 py-6 text-center">
          <MailCheck className="h-12 w-12 text-neon-blue-bright" />
          <p className="text-sm text-white/60">
            Se este email existir em nossa base, você receberá um link para redefinir sua senha
            em instantes.
          </p>
          <Link href="/login" className="btn-secondary mt-2 w-full">
            Voltar ao login
          </Link>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Esqueceu sua senha?"
      subtitle="Digite seu email e enviaremos um link para redefinição."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm text-white/60">Email</label>
          <input type="email" className="input-field" placeholder="voce@email.com" {...register("email")} />
          {errors.email && <p className="mt-1 text-xs text-rose-400">{errors.email.message}</p>}
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Enviar link"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-white/40">
        <Link href="/login" className="font-medium text-neon-blue-bright hover:underline">
          Voltar ao login
        </Link>
      </p>
    </AuthShell>
  );
}
