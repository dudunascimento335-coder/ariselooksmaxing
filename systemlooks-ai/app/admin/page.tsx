import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { AdminDashboard } from "@/components/dashboard/AdminDashboard";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-background px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="font-display text-2xl font-bold">Painel Administrativo</h1>
        <p className="mt-1 text-white/45">Visão geral de usuários, assinaturas e receita.</p>
        <AdminDashboard />
      </div>
    </div>
  );
}
