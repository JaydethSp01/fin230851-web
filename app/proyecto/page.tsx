"use client";
export const dynamic = "force-dynamic";
import { useState } from "react";
import Link from "next/link";
import { mockProyectos, type Proyecto } from "@/lib/mock";

const ESTADOS: Proyecto["estado"][] = ["activo", "pausado", "completado", "archivado"];
const PRIORIDADES: Proyecto["prioridad"][] = ["alta", "media", "baja"];

const estadoBadge: Record<Proyecto["estado"], string> = {
  activo: "bg-emerald-100 text-emerald-800",
  pausado: "bg-yellow-100 text-yellow-800",
  completado: "bg-blue-100 text-blue-800",
  archivado: "bg-gray-100 text-gray-600",
};

const prioridadBadge: Record<Proyecto["prioridad"], string> = {
  alta: "bg-red-100 text-red-700",
  media: "bg-orange-100 text-orange-700",
  baja: "bg-green-100 text-green-700",
};

const estadoLabel: Record<Proyecto["estado"], string> = {
  activo: "Activo",
  pausado: "Pausado",
  completado: "Completado",
  archivado: "Archivado",
};

const prioridadLabel: Record<Proyecto["prioridad"], string> = {
  alta: "Alta",
  media: "Media",
  baja: "Baja",
};

const EMPTY_FORM: Omit<Proyecto, "id" | "tareas"> = {
  nombre: "",
  descripcion: "",
  estado: "activo",
  prioridad: "media",
  fechaInicio: "",
  fechaFin: "",
  responsable: "",
  color: "#6366f1",
};

export default function ProyectoPage() {
  const [proyectos, setProyectos] = useState<Proyecto[]>(mockProyectos);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<Omit<Proyecto, "id" | "tareas">>(EMPTY_FORM);
  const [search, setSearch] = useState("");
  const [filterEstado, setFilterEstado] = useState<Proyecto["estado"] | "todos">("todos");
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof typeof EMPTY_FORM, string>>>({});

  const filtered = (proyectos ?? []).filter((p) => {
    const matchSearch =
      p.nombre.toLowerCase().includes(search.toLowerCase()) ||
      p.descripcion.toLowerCase().includes(search.toLowerCase()) ||
      p.responsable.toLowerCase().includes(search.toLowerCase());
    const matchEstado = filterEstado === "todos" || p.estado === filterEstado;
    return matchSearch && matchEstado;
  });

  function validate(): boolean {
    const newErrors: typeof errors = {};
    if (!form.nombre.trim()) newErrors.nombre = "El nombre es obligatorio.";
    if (!form.responsable.trim()) newErrors.responsable = "El responsable es obligatorio.";
    if (!form.fechaInicio) newErrors.fechaInicio = "La fecha de inicio es obligatoria.";
    if (!form.fechaFin) newErrors.fechaFin = "La fecha de fin es obligatoria.";
    if (form.fechaInicio && form.fechaFin && form.fechaFin < form.fechaInicio) {
      newErrors.fechaFin = "La fecha de fin debe ser posterior a la de inicio.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function openCreate() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setErrors({});
    setShowForm(true);
  }

  function openEdit(p: Proyecto) {
    setForm({
      nombre: p.nombre,
      descripcion: p.descripcion,
      estado: p.estado,
      prioridad: p.prioridad,
      fechaInicio: p.fechaInicio,
      fechaFin: p.fechaFin,
      responsable: p.responsable,
      color: p.color,
    });
    setEditingId(p.id);
    setErrors({});
    setShowForm(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    if (editingId !== null) {
      setProyectos((prev) =>
        (prev ?? []).map((p) => (p.id === editingId ? { ...p, ...form } : p))
      );
    } else {
      const newId = Math.max(0, ...proyectos.map((p) => p.id)) + 1;
      setProyectos((prev) => [...prev, { id: newId, tareas: 0, ...form }]);
    }
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  function handleDelete(id: number) {
    setProyectos((prev) => (prev ?? []).filter((p) => p.id !== id));
    setDeleteConfirmId(null);
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  const totalActivos = (proyectos ?? []).filter((p) => p.estado === "activo").length;
  const totalCompletados = (proyectos ?? []).filter((p) => p.estado === "completado").length;
  const totalTareas = (proyectos ?? []).reduce((sum, p) => sum + p.tareas, 0);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col py-6 px-4 fixed h-full z-10">
        <div className="flex items-center gap-2 mb-8 px-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <span className="font-bold text-gray-900 text-lg">TaskFlow</span>
        </div>
        <nav className="flex-1 space-y-1">
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 text-sm font-medium transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M3 12h18M3 17h18" />
            </svg>
            Dashboard
          </Link>
          <Link href="/proyecto" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-indigo-50 text-indigo-700 text-sm font-semibold">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Proyectos
          </Link>
          <Link href="/tarea" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 text-sm font-medium transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Tareas
          </Link>
          <Link href="/usuario" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 text-sm font-medium transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Usuarios
          </Link>
        </nav>
        <div className="border-t border-gray-200 pt-4 mt-4">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">AD</div>
            <div>
              <p className="text-sm font-medium text-gray-900">Admin</p>
              <p className="text-xs text-gray-500">admin@taskflow.io</p>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 ml-64">
        <header className="bg-white border-b border-gray-200 px-8 py-5 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Proyectos</h1>
            <p className="text-sm text-gray-500 mt-0.5">Gestiona todos los proyectos de tu equipo</p>
          </div>
          <button onClick={openCreate} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nuevo Proyecto
          </button>
        </header>

        <div className="p-8 space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{proyectos?.length}</p>
              <p className="text-xs text-gray-400 mt-1">proyectos registrados</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Activos</p>
              <p className="text-3xl font-bold text-emerald-700 mt-1">{totalActivos}</p>
              <p className="text-xs text-gray-400 mt-1">en progreso ahora</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Completados</p>
              <p className="text-3xl font-bold text-blue-700 mt-1">{totalCompletados}</p>
              <p className="text-xs text-gray-400 mt-1">finalizados con éxito</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <p className="text-xs font-semibold text-purple-600 uppercase tracking-wider">Tareas</p>
              <p className="text-3xl font-bold text-purple-700 mt-1">{totalTareas}</p>
              <p className="text-xs text-gray-400 mt-1">tareas en total</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 px-5 py-4 flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Buscar proyecto, responsable..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 font-medium">Estado:</span>
              <select
                value={filterEstado}
                onChange={(e) => setFilterEstado(e.target.value as Proyecto["estado"] | "todos")}
                className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="todos">Todos</option>
                {(ESTADOS ?? []).map((e) => (
                  <option key={e} value={e}>{estadoLabel[e]}</option>
                ))}
              </select>
            </div>
            <span className="ml-auto text-sm text-gray-400">{filtered?.length} resultado{filtered?.length !== 1 ? "s" : ""}</span>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Proyecto</th>
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Responsable</th>
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Prioridad</th>
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Fechas</th>
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tareas</th>
                  <th className="px-6 py-3.5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered?.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-16 text-gray-400">
                      <svg className="w-10 h-10 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="font-medium">No se encontraron proyectos</p>
                      <p className="text-xs mt-1">Intenta ajustar los filtros o crea uno nuevo.</p>
                    </td>
                  </tr>
                )}
                {(filtered ?? []).map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                          style={{ backgroundColor: p.color }}
                        >
                          {p.nombre.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{p.nombre}</p>
                          <p className="text-xs text-gray-500 mt-0.5 line-clamp-1 max-w-xs">{p.descripcion}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-xs font-bold">
                          {p.responsable.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                        </div>
                        <span className="text-gray-700">{p.responsable}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${estadoBadge[p.estado]}`}>
                        {estadoLabel[p.estado]}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${prioridadBadge[p.prioridad]}`}>
                        {prioridadLabel[p.prioridad]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      <p className="text-xs">{p.fechaInicio}</p>
                      <p className="text-xs text-gray-400">→ {p.fechaFin}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 text-gray-700 font-semibold">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        {p.tareas}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(p)}
                          className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(p.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Eliminar"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {deleteConfirmId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 text-center">Eliminar proyecto</h3>
            <p className="text-sm text-gray-500 text-center mt-2">
              ¿Estás seguro de que quieres eliminar{" "}
              <span className="font-semibold text-gray-700">
                {(proyectos ?? []).find((p) => p.id === deleteConfirmId)?.nombre}
              </span>
              ? Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  {editingId !== null ? "Editar Proyecto" : "Nuevo Proyecto"}
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  {editingId !== null ? "Modifica los datos del proyecto." : "Completa los campos para crear el proyecto."}
                </p>
              </div>
              <button
                onClick={() => { setShowForm(false); setEditingId(null); }}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} noValidate>
              <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Nombre del Proyecto <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    placeholder="Ej: Rediseño plataforma web"
                    className={`w-full px-3.5 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${errors.nombre ? "border-red-400 bg-red-50" : "border-gray-200"}`}
                  />
                  {errors.nombre && <p className="text-xs text-red-500 mt-1">{errors.nombre}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Descripción</label>
                  <textarea
                    name="descripcion"
                    value={form.descripcion}
                    onChange={handleChange}
                    rows={2}
                    placeholder="Breve descripción del objetivo del proyecto..."
                    className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Responsable <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="responsable"
                    value={form.responsable}
                    onChange={handleChange}
                    placeholder="Nombre completo del responsable"
                    className={`w-full px-3.5 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${errors.responsable ? "border-red-400 bg-red-50" : "border-gray-200"}`}
                  />
                  {errors.responsable && <p className="text-xs text-red-500 mt-1">{errors.responsable}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Estado</label>
                    <select
                      name="estado"
                      value={form.estado}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                    >
                      {(ESTADOS ?? []).map((e) => (
                        <option key={e} value={e}>{estadoLabel[e]}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Prioridad</label>
                    <select
                      name="prioridad"
                      value={form.prioridad}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                    >
                      {(PRIORIDADES ?? []).map((p) => (
                        <option key={p} value={p}>{prioridadLabel[p]}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Fecha Inicio <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="fechaInicio"
                      value={form.fechaInicio}
                      onChange={handleChange}
                      className={`w-full px-3.5 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.fechaInicio ? "border-red-400 bg-red-50" : "border-gray-200"}`}
                    />
                    {errors.fechaInicio && <p className="text-xs text-red-500 mt-1">{errors.fechaInicio}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Fecha Fin <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="fechaFin"
                      value={form.fechaFin}
                      onChange={handleChange}
                      className={`w-full px-3.5 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.fechaFin ? "border-red-400 bg-red-50" : "border-gray-200"}`}
                    />
                    {errors.fechaFin && <p className="text-xs text-red-500 mt-1">{errors.fechaFin}</p>}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Color de Proyecto</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      name="color"
                      value={form.color}
                      onChange={handleChange}
                      className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer p-0.5"
                    />
                    <div className="flex gap-2">
                      {["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#3b82f6", "#8b5cf6", "#ec4899"].map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setForm((prev) => ({ ...prev, color: c }))}
                          className={`w-7 h-7 rounded-full transition-transform hover:scale-110 ${form.color === c ? "ring-2 ring-offset-2 ring-gray-400 scale-110" : ""}`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50">
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setEditingId(null); }}
                  className="px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-sm"
                >
                  {editingId !== null ? "Guardar cambios" : "Crear Proyecto"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}