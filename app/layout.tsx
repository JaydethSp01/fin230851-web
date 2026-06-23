export const dynamic = "force-dynamic";
import "./globals.css";
import { ProtectedShell } from "@/components/ui/ProtectedShell";

const NAV = [{ href: "/", label: "Inicio" }, { href: "/prioridad", label: "Prioridad" }, { href: "/proyecto", label: "Proyecto" }, { href: "/tarea", label: "Tarea" }, { href: "/usuarios", label: "Usuarios" }];

export const metadata = { title: "TaskFlow — Gestión de Tareas", description: "Generado con ScrumDev AI" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <ProtectedShell items={NAV} title="TaskFlow — Gestión de Tareas">{children}</ProtectedShell>
      </body>
    </html>
  );
}
