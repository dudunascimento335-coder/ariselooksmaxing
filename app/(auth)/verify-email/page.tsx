"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CircleCheck as CheckCircle2, Circle as XCircle, Loader as Loader2 } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";

function VerifyEmailContent() {
  const params = useSearchParams();
  const token = params.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Link de verificação inválido.");
      return;
    }

    fetch("/api/auth/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(json.error);
        setStatus("success");
      })
      .catch((err) => {
        setStatus("error");
        setMessage(err.message ?? "Não foi possível verificar seu email.");
      });
  }, [token]);

  return (
    <AuthShell title="Verificação de email" subtitle="">
      <div className="flex flex-col items-center gap-4 py-6 text-center">
        {status === "loading" && <Loader2 className="h-12 w-12 animate-spin text-neon-blue-bright" />}
        {status === "success" && (
          <>
            <CheckCircle2 className="h-12 w-12 text-emerald-400" />
            <p className="text-sm text-white/60">
              Seu email foi confirmado. Seu Sistema está ativado.
            </p>
            <Link href="/login" className="btn-primary w-full">
              Fazer login
            </Link>
          </>
        )}
        {status === "error" && (
          <>
            <XCircle className="h-12 w-12 text-rose-400" />
            <p className="text-sm text-white/60">{message}</p>
            <Link href="/login" className="btn-secondary w-full">
              Voltar ao login
            </Link>
          </>
        )}
      </div>
    </AuthShell>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailContent />
    </Suspense>
  );
}
