"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, UploadCloud, ImageIcon } from "lucide-react";
import { UploadDropzone } from "@/lib/uploadthing";
import { SystemReveal } from "@/components/system/SystemReveal";
import { AttributeResult } from "@/lib/attributes";

type Stage = "idle" | "uploading" | "analyzing" | "done" | "error";

export default function SystemPage() {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<{ overallScore: number; attributes: AttributeResult[] } | null>(null);

  async function runAnalysis(imageUrl: string) {
    setStage("analyzing");
    setErrorMsg(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl }),
      });
      const json = await res.json();

      if (!res.ok) {
        setStage("error");
        setErrorMsg(json.error ?? "Não foi possível concluir a análise.");
        return;
      }

      setResult({
        overallScore: json.analysis.overallScore,
        attributes: json.analysis.attributes,
      });
      setStage("done");
      router.refresh();
    } catch {
      setStage("error");
      setErrorMsg("Erro de conexão. Tente novamente.");
    }
  }

  if (stage === "done" && result) {
    return (
      <div>
        <SystemReveal overallScore={result.overallScore} attributes={result.attributes} />
        <button
          onClick={() => {
            setStage("idle");
            setResult(null);
            setPreviewUrl(null);
          }}
          className="btn-secondary mt-8"
        >
          Fazer nova análise
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="font-display text-2xl font-bold">Nova Análise</h1>
      <p className="mt-1 text-white/45">
        Envie uma foto de rosto, com boa iluminação e olhando para a câmera, para ativar seu Sistema.
      </p>

      <div className="glass-strong mt-8 rounded-2xl border-neon-blue/20 p-8">
        {stage === "idle" && (
          <>
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" className="mx-auto h-48 w-48 rounded-xl object-cover" />
            ) : (
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-white/5">
                <ImageIcon className="h-8 w-8 text-white/30" />
              </div>
            )}

            <UploadDropzone
              endpoint="profilePhoto"
              onUploadBegin={() => setStage("uploading")}
              onClientUploadComplete={(files) => {
                const url = files?.[0]?.url;
                if (url) {
                  setPreviewUrl(url);
                  runAnalysis(url);
                }
              }}
              onUploadError={(err) => {
                setStage("error");
                setErrorMsg(err.message);
              }}
              appearance={{
                container: "mt-6 border-neon-blue/30 bg-transparent rounded-xl",
                label: "text-white/70",
                allowedContent: "text-white/30 text-xs",
                button: "bg-gradient-to-r from-neon-blue to-neon-purple",
              }}
            />
          </>
        )}

        {(stage === "uploading" || stage === "analyzing") && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-4 py-10 text-center">
            <Loader2 className="h-10 w-10 animate-spin text-neon-blue-bright" />
            <p className="font-display text-sm tracking-widest text-neon-blue-bright">
              {stage === "uploading" ? "ENVIANDO IMAGEM..." : "[ SYSTEM ] ANALISANDO..."}
            </p>
            <p className="text-xs text-white/30">Isso pode levar alguns segundos.</p>
          </motion.div>
        )}

        {stage === "error" && (
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <p className="text-sm text-rose-400">{errorMsg}</p>
            <button onClick={() => setStage("idle")} className="btn-secondary">
              Tentar novamente
            </button>
          </div>
        )}
      </div>

      <p className="mt-4 text-center text-xs text-white/30">
        A análise é uma estimativa gerada por IA e não substitui avaliação médica ou profissional.
      </p>
    </div>
  );
}
