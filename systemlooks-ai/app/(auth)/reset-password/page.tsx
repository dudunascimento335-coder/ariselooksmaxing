"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, CheckCircle2 } from "lucide-react";
import { resetPasswordSchema, ResetPasswordInput } from "@/lib/validations";
import { AuthShell } from "@/components/auth/AuthShell";

function ResetPasswordForm() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token") ?? "";

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token },
  });

  async function onSubmit(data: ResetPasswordInput) {
    setLoading(true);
    setServerError(null);

    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, token }),
    });
    const json = await res.json();
    setLoading(false);

    if (!res.ok) {
      setServerError(json.error ?? "Erro ao redefinir senha.");
      return;
    }

    setSuccess(true);
    setTimeout(() => router.push("/login"), 2000);
  }

  if (!token) {
    return (
      <AuthShell title="Link inválido" subtitle="">
        <p className="text-sm text-white/60">
          Este link de redefinição é inválido. Solicite um novo através da página{" "}
          <Link href="/forgot-password" className="text-neon-blue-bright hover:underline">
            Esqueci minha senha
          </Link>
          .
        </p>
      </AuthShell>
    );
  }

  if (success) {
    return (
      <AuthShell title="Senha atualizada" subtitle="">
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <CheckCircle2 className="h-12 w-12 text-emerald-400" />
          <p className="text-sm text-white/60">Redirecionando para o login...</p>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Crie uma nova senha" subtitle="Escolha uma senha forte para sua conta.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm text-white/60">Nova senha</label>
          <input type="password" className="input-field" placeholder="••••••••" {...register("password")} />
          {errors.password && <p className="mt-1 text-xs text-rose-400">{errors.password.message}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-sm text-white/60">Confirmar nova senha</label>
          <input type="password" className="input-field" placeholder="••••••••" {...register("confirmPassword")} />
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-rose-400">{errors.confirmPassword.message}</p>
          )}
        </div>

        {serverError && <p className="text-sm text-rose-400">{serverError}</p>}

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Redefinir senha"}
        </button>
      </form>
    </AuthShell>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
