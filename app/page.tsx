"use client";
export const dynamic = "force-dynamic";
import { MetricCard } from "@/components/ui/MetricCard";
import { Hero } from "@/components/ui/Hero";
import { Avatar } from "@/components/ui/Avatar";
import Link from "next/link";
import { projects, tasks, users } from "@/lib/mock";

type Priority = "alta" | "media" | "baja";
type Status = "pendiente" | "en_progreso" | "completada";

const PRIORITY_CONFIG: Record<Priority, { label: string; className: string }> = {
  alta: {
    label: "Alta",
    className: "bg-red-100 text-red-700 border border-red-200",
  },
  media: {
    label: "Media",
    className: "bg-amber-100 text-amber-700 border border-amber-200",
  },
  baja: {
    label: "Baja",
    className: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  },
};

const STATUS_CONFIG: Record<Status, { label: string; className: string; dot: string }> = {
  pendiente: {
    label: "Pendiente",
    className: "bg-slate-100 text-slate-600 border border-slate-200",
    dot: "bg-slate-400",
  },
  en_progreso: {
    label: "En progreso",
    className: "bg-blue-100 text-blue-700 border border-blue-200",
    dot: "bg-blue-500",
  },
  completada: {
    label: "Completada",
    className: "bg-emerald-100 text-emerald-700 border border-emerald-200",
    dot: "bg-emerald-500",
  },
};

interface MetricCardProps {
  title: string;
  value: number | string;
  subtitle: string;
  icon: React.ReactNode;
  accent: string;
  trend?: string;
}

function MetricCard({ title, value, subtitle, icon, accent, trend }: MetricCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col gap-4 hover:shadow-md transition-shadow">
      <Hero title="Dashboard" subtitle="Resumen de tu operación de un vistazo." />
      <div className="flex items-center justify-between">
        <div className={`p-3 rounded-xl ${accent}`}>{icon}</div>
        {trend && (
          <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100">
            {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-3xl font-bold text-slate-800 tracking-tight">{value}</p>
        <p className="text-sm font-medium text-slate-500 mt-0.5">{title}</p>
        <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
      </div>
    </div>
  );
}

function Avatar({ name, size = "sm" }: { name: string; size?: "sm" | "md" }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const colors = [
    "bg-indigo-500",
    "bg-violet-500",
    "bg-rose-500",
    "bg-amber-500",
    "bg-teal-500",
    "bg-sky-500",
  ];
  const color = colors[name.charCodeAt(0) % colors?.length];
  const sizeClass = size === "sm" ? "w-7 h-7 text-xs" : "w-9 h-9 text-sm";
  return (
    <div
      className={`${sizeClass} ${color} rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0`}
    >
      {initials}
    </div>
  );
}

export default function DashboardPage() {
  const totalProjects = projects?.length;
  const totalTasks = tasks?.length;
  const completedTasks = (tasks ?? []).filter((t) => t.status === "completada").length;
  const inProgressTasks = (tasks ?? []).filter((t) => t.status === "en_progreso").length;
  const highPriorityPending = (tasks ?? []).filter(
    (t) => t.priority === "alta" && t.status !== "completada"
  ).length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const recentTasks = [...tasks]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8);

  const projectMap = Object.fromEntries((projects ?? []).map((p) => [p.id, p]));
  const userMap = Object.fromEntries((users ?? []).map((u) => [u.id, u]));

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-100 flex flex-col py-6 px-4 min-h-screen fixed top-0 left-0 z-10">
        <div className="flex items-center gap-2.5 px-2 mb-8">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <span className="text-lg font-bold text-slate-800">TaskFlow</span>
        </div>
        <nav className="flex flex-col gap-1">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-indigo-50 text-indigo-700 font-medium text-sm"
          >
            <svg className="w-4.5 h-4.5 w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Dashboard
          </Link>
          <Link
            href="/projects"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-800 font-medium text-sm transition-colors"
          >
            <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            Proyectos
          </Link>
          <Link
            href="/tasks"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-800 font-medium text-sm transition-colors"
          >
            <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            Tareas
          </Link>
          <Link
            href="/users"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-800 font-medium text-sm transition-colors"
          >
            <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Usuarios
          </Link>
        </nav>
        <div className="mt-auto px-2">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
            <Avatar name="Ana García" size="md" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-700 truncate">Ana García</p>
              <p className="text-xs text-slate-400 truncate">Team Lead</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Resumen general · {new Date().toLocaleDateString("es-ES", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
          <Link
            href="/tasks/new"
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors shadow-sm shadow-indigo-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nueva Tarea
          </Link>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
          <MetricCard
            title="Proyectos Activos"
            value={totalProjects}
            subtitle={`${users?.length} miembros de equipo`}
            accent="bg-indigo-50 text-indigo-600"
            trend="+2 este mes"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
            }
          />
          <MetricCard
            title="Total de Tareas"
            value={totalTasks}
            subtitle={`${inProgressTasks} en progreso ahora`}
            accent="bg-violet-50 text-violet-600"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            }
          />
          <MetricCard
            title="Completadas"
            value={completedTasks}
            subtitle={`${completionRate}% tasa de finalización`}
            accent="bg-emerald-50 text-emerald-600"
            trend={`${completionRate}% ratio`}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <MetricCard
            title="Alta Prioridad"
            value={highPriorityPending}
            subtitle="requieren atención urgente"
            accent="bg-red-50 text-red-600"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            }
          />
        </div>

        {/* Progress bar global */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-semibold text-slate-700">Progreso global del equipo</p>
              <p className="text-xs text-slate-400 mt-0.5">{completedTasks} de {totalTasks} tareas completadas</p>
            </div>
            <span className="text-2xl font-bold text-slate-800">{completionRate}%</span>
          </div>
          <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-700"
              style={{ width: `${completionRate}%` }}
            />
          </div>
          <div className="flex gap-6 mt-4">
            {(["pendiente", "en_progreso", "completada"] as Status[]).map((s) => {
              const count = (tasks ?? []).filter((t) => t.status === s).length;
              const cfg = STATUS_CONFIG[s];
              return (
                <div key={s} className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                  <span className="text-xs text-slate-500">{cfg.label}</span>
                  <span className="text-xs font-semibold text-slate-700">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tasks Table */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-50">
            <div>
              <h2 className="text-base font-semibold text-slate-800">Tareas recientes</h2>
              <p className="text-xs text-slate-400 mt-0.5">Últimas {recentTasks?.length} tareas actualizadas</p>
            </div>
            <Link
              href="/tasks"
              className="text-xs font-medium text-indigo-600 hover:text-indigo-800 hover:underline underline-offset-2 transition-colors"
            >
              Ver todas →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-50 bg-slate-50/60">
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-6 py-3">
                    Tarea
                  </th>
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-3">
                    Proyecto
                  </th>
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-3">
                    Prioridad
                  </th>
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-3">
                    Estado
                  </th>
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-3">
                    Asignado
                  </th>
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-3">
                    Vence
                  </th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {(recentTasks ?? []).map((task) => {
                  const project = projectMap[task.projectId];
                  const assignee = userMap[task.assigneeId];
                  const priority = task.priority as Priority;
                  const status = task.status as Status;
                  const isOverdue =
                    task.dueDate &&
                    new Date(task.dueDate) < new Date() &&
                    status !== "completada";

                  return (
                    <tr key={task.id} className="hover:bg-slate-50/70 transition-colors group">
                      <td className="px-6 py-4 max-w-[220px]">
                        <p className="font-medium text-slate-700 truncate group-hover:text-indigo-700 transition-colors">
                          {task.title}
                        </p>
                        {task.description && (
                          <p className="text-xs text-slate-400 truncate mt-0.5">{task.description}</p>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        {project ? (
                          <div className="flex items-center gap-2">
                            <div
                              className="w-2 h-2 rounded-full flex-shrink-0"
                              style={{ backgroundColor: project.color ?? "#6366f1" }}
                            />
                            <span className="text-slate-600 truncate max-w-[120px] text-xs font-medium">
                              {project.name}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-300 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${PRIORITY_CONFIG[priority]?.className ?? ""}`}
                        >
                          {PRIORITY_CONFIG[priority]?.label ?? priority}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_CONFIG[status]?.className ?? ""}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${STATUS_CONFIG[status]?.dot ?? ""}`} />
                          {STATUS_CONFIG[status]?.label ?? status}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        {assignee ? (
                          <div className="flex items-center gap-2">
                            <Avatar name={assignee.name} />
                            <span className="text-slate-600 text-xs font-medium truncate max-w-[90px]">
                              {assignee.name.split(" ")[0]}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-300 text-xs">Sin asignar</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        {task.dueDate ? (
                          <span
                            className={`text-xs font-medium ${
                              isOverdue ? "text-red-600" : "text-slate-500"
                            }`}
                          >
                            {isOverdue && "⚠ "}
                            {new Date(task.dueDate).toLocaleDateString("es-ES", {
                              day: "2-digit",
                              month: "short",
                            })}
                          </span>
                        ) : (
                          <span className="text-slate-300 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/tasks/${task.id}`}
                          className="text-xs font-medium text-slate-400 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          Ver →
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}