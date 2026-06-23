"use client";
export const dynamic = "force-dynamic";
import { useState } from "react";
import { prioridades as mockPrioridades } from "@/lib/mock";
import Link from "next/link";
import { Flag, Plus, Pencil, Trash2, X, Check, AlertCircle } from "lucide-react";

interface Prioridad {
  id: number;
  nombre: string;
  nivel: number;
  color: string;
  descripcion: string;
}

const FORM_EMPTY: Omit<Prioridad, "id"> = {
  nombre: "",
  nivel: 3,
  color: "#3B82F6",
  descripcion: "",
};

const COLOR_OPTIONS = [
  { label: "Rojo",    value: "#EF4444" },
  { label: "Naranja", value: "#F97316" },
  { label: "Amarillo",value: "#EAB308" },
  { label: "Verde",   value: "#22C55E" },
  { label: "Azul",    value: "#3B82F6" },
  { label: "Violeta", value: "#8B5CF6" },
  { label: "Gris",    value: "#6B7280" },
];

function nivelLabel(nivel: number): string {
  const map: Record<number, string> = {
    1: "Crítica",
    2: "Alta",
    3: "Media",
    4: "Baja",
    5: "Sin prioridad",
  };
  return map[nivel] ?? `Nivel ${nivel}`;
}

function nivelBadge(nivel: number): string {
  const map: Record<number, string> = {
    1: "bg-red-100 text-red-700 ring-red-200",
    2: "bg-orange-100 text-orange-700 ring-orange-200",
    3: "bg-yellow-100 text-yellow-700 ring-yellow-200",
    4: "bg-blue-100 text-blue-700 ring-blue-200",
    5: "bg-gray-100 text-gray-600 ring-gray-200",
  };
  return map[nivel] ?? "bg-gray-100 text-gray-600 ring-gray-200";
}

export default function PrioridadPage() {
  const [prioridades, setPrioridades] = useState<Prioridad[]>(mockPrioridades);
  const [showForm, setShowForm]       = useState(false);
  const [editingId, setEditingId]     = useState<number | null>(null);
  const [form, setForm]               = useState<Omit<Prioridad, "id">>(FORM_EMPTY);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [errors, setErrors]           = useState<Partial<Record<keyof Omit<Prioridad, "id">, string>>>({});

  function validate(): boolean {
    const next: typeof errors = {};
    if (!form.nombre.trim()) next.nombre = "El nombre es obligatorio.";
    if (form.nivel < 1 || form.nivel > 10) next.nivel = "El nivel debe estar entre 1 y 10.";
    if (!form.color) next.color = "Selecciona un color.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function openCreate() {
    setEditingId(null);
    setForm(FORM_EMPTY);
    setErrors({});
    setShowForm(true);
  }

  function openEdit(p: Prioridad) {
    setEditingId(p.id);
    setForm({ nombre: p.nombre, nivel: p.nivel, color: p.color, descripcion: p.descripcion });
    setErrors({});
    setShowForm(true);
  }

  function handleCancel() {
    setShowForm(false);
    setEditingId(null);
    setErrors({});
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    if (editingId !== null) {
      setPrioridades((prev) =>
        (prev ?? []).map((p) => (p.id === editingId ? { ...p, ...form } : p))
      );
    } else {
      const newId = Math.max(0, ...prioridades.map((p) => p.id)) + 1;
      setPrioridades((prev) => [...prev, { id: newId, ...form }]);
    }
    setShowForm(false);
    setEditingId(null);
    setForm(FORM_EMPTY);
    setErrors({});
  }

  function handleDelete(id: number) {
    setPrioridades((prev) => (prev ?? []).filter((p) => p.id !== id));
    setDeleteConfirmId(null);
  }

  function handleChange(field: keyof typeof form, value: string | number) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  const sorted = [...prioridades].sort((a, b) => a.nivel - b.nivel);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col w-60 min-h-screen bg-white border-r border-gray-200 py-6 px-4 gap-1 shrink-0">
          <div className="flex items-center gap-2 px-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Flag className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-lg tracking-tight">TaskFlow</span>
          </div>
          <nav className="flex flex-col gap-0.5">
            {[
              { label: "Dashboard",   href: "/" },
              { label: "Proyectos",   href: "/proyecto" },
              { label: "Tareas",      href: "/tarea" },
              { label: "Prioridades", href: "/prioridad" },
              { label: "Usuarios",    href: "/usuario" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  item.href === "/prioridad"
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main */}
        <main className="flex-1 p-6 lg:p-10 max-w-5xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Flag className="w-6 h-6 text-indigo-600" />
                Prioridades
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Gestiona los niveles de prioridad para tus tareas y proyectos.
              </p>
            </div>
            <button
              onClick={openCreate}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Nueva prioridad
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total",     value: prioridades?.length,                              color: "bg-indigo-50 text-indigo-700" },
              { label: "Crítica",   value: (prioridades ?? []).filter((p) => p.nivel === 1).length, color: "bg-red-50 text-red-700"     },
              { label: "Alta",      value: (prioridades ?? []).filter((p) => p.nivel === 2).length, color: "bg-orange-50 text-orange-700"},
              { label: "Baja / Sin",value: (prioridades ?? []).filter((p) => p.nivel >= 4).length,  color: "bg-gray-50 text-gray-600"   },
            ].map((stat) => (
              <div key={stat.label} className={`rounded-xl p-4 ${stat.color} border border-white`}>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs font-medium mt-0.5 opacity-75">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Form */}
          {showForm && (
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 mb-8">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-semibold text-gray-900">
                  {editingId !== null ? "Editar prioridad" : "Nueva prioridad"}
                </h2>
                <button
                  onClick={handleCancel}
                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit} noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Nombre */}
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.nombre}
                      onChange={(e) => handleChange("nombre", e.target.value)}
                      placeholder="Ej. Alta, Crítica, Urgente…"
                      className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
                        errors.nombre ? "border-red-400 bg-red-50" : "border-gray-300 bg-white"
                      }`}
                    />
                    {errors.nombre && (
                      <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.nombre}
                      </p>
                    )}
                  </div>

                  {/* Nivel */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nivel <span className="text-red-500">*</span>
                      <span className="ml-1 text-gray-400 font-normal">(1 = más urgente)</span>
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={form.nivel}
                      onChange={(e) => handleChange("nivel", Number(e.target.value))}
                      className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
                        errors.nivel ? "border-red-400 bg-red-50" : "border-gray-300 bg-white"
                      }`}
                    />
                    {errors.nivel && (
                      <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.nivel}
                      </p>
                    )}
                  </div>

                  {/* Color picker */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Color <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-2 flex-wrap pt-1">
                      {(COLOR_OPTIONS ?? []).map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          title={opt.label}
                          onClick={() => handleChange("color", opt.value)}
                          className={`w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 ${
                            form.color === opt.value ? "border-gray-900 scale-110" : "border-transparent"
                          }`}
                          style={{ backgroundColor: opt.value }}
                        />
                      ))}
                    </div>
                    {errors.color && (
                      <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.color}
                      </p>
                    )}
                  </div>

                  {/* Descripción */}
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descripción
                    </label>
                    <textarea
                      rows={2}
                      value={form.descripcion}
                      onChange={(e) => handleChange("descripcion", e.target.value)}
                      placeholder="Describe cuándo aplica esta prioridad…"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 mt-6 pt-5 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-sm"
                  >
                    <Check className="w-4 h-4" />
                    {editingId !== null ? "Guardar cambios" : "Crear prioridad"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Table */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-700">
                {sorted?.length} prioridad{sorted?.length !== 1 ? "es" : ""} registrada{sorted?.length !== 1 ? "s" : ""}
              </h2>
              <span className="text-xs text-gray-400">Ordenadas por nivel ascendente</span>
            </div>

            {sorted?.length === 0 ? (
              <div className="py-20 text-center">
                <Flag className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500 font-medium">No hay prioridades registradas.</p>
                <p className="text-xs text-gray-400 mt-1">Crea la primera usando el botón de arriba.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-left">
                      <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-12">#</th>
                      <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nombre</th>
                      <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nivel</th>
                      <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Color</th>
                      <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Descripción</th>
                      <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {(sorted ?? []).map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50 transition-colors group">
                        <td className="px-6 py-4 text-gray-400 font-mono text-xs">{p.id}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2.5">
                            <span
                              className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                              style={{ backgroundColor: p.color }}
                            />
                            <span className="font-semibold text-gray-900">{p.nombre}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ring-1 ring-inset ${nivelBadge(p.nivel)}`}>
                            <span className="font-mono font-bold">{p.nivel}</span>
                            <span>— {nivelLabel(p.nivel)}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-5 h-5 rounded border border-gray-200 shadow-sm"
                              style={{ backgroundColor: p.color }}
                            />
                            <span className="text-xs text-gray-500 font-mono">{p.color}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-500 max-w-xs truncate">
                          {p.descripcion || <span className="text-gray-300 italic">Sin descripción</span>}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => openEdit(p)}
                              className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                              title="Editar"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>

                            {deleteConfirmId === p.id ? (
                              <div className="flex items-center gap-1 bg-red-50 border border-red-200 rounded-lg px-2 py-1">
                                <span className="text-xs text-red-600 font-medium mr-1">¿Eliminar?</span>
                                <button
                                  onClick={() => handleDelete(p.id)}
                                  className="p-0.5 text-red-600 hover:text-red-700 rounded transition-colors"
                                  title="Confirmar eliminación"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => setDeleteConfirmId(null)}
                                  className="p-0.5 text-gray-400 hover:text-gray-600 rounded transition-colors"
                                  title="Cancelar"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setDeleteConfirmId(p.id)}
                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Eliminar"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}