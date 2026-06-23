"use client";
export const dynamic = "force-dynamic";
import { UsersManager } from "@/components/ui/UsersManager";
import { PageHeader } from "@/components/ui/PageHeader";

export default function UsuariosPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Usuarios y roles" subtitle="Gestiona accesos, crea usuarios y define roles." />
      <UsersManager />
    </div>
  );
}
