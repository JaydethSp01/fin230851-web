"use client";
export const dynamic = "force-dynamic";
import { useState } from "react";
import Link from "next/link";
import { tareas as tareasIniciales, proyectos, usuarios } from "@/lib/mock";

interface Usuario {
  id: string;
  nombre: string;
  email: string;
  avatar?: string;
}

interface Proyecto {
  id: string;
  nombre: string;
  color: string;
}

interface Tarea {
  id: string;
  titulo: string;
  descripcion: string;
  prioridad: "Alta" | "Media" | "Baja";
  estado: "Pendiente" | "En Progreso" | "Completada";
  proyectoId: string;
  asignadoId: string;
  fechaVencimiento: string;
}

const emptyForm: Omit<Tarea, "id"> = {
  titulo: "",
  descripcion: "",
  prioridad: "Media",
  estado: "Pendiente",
  proyectoId: (proyectos as Proyecto[])[0]?.id ?? "",
  asignadoId: (usuarios as Usuario[])[0]?.id ?? "",
  fechaVencimiento: "",
};

const prioridadBadge: Record<string, string> = {
  Alta: "bg-red-100 text-red-700 ring-1 ring-red-200",
  Media: "bg-yellow-100 text-yellow-700 ring-1 ring-yellow-200",
  Baja: "bg-green-100 text-green-700 ring-1 ring-green-200",
};

const estadoBadge: Record<string, string> = {
  Pendiente: "bg-gray-100 text-gray-600 ring-1 ring-gray-200",
  "En Progreso": "bg-blue-100 text-blue-700 ring-1 ring-blue-200",
  Completada: "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200",
};

const estadoIcono: Record<string, string> = {
  Pendiente: "○",
  "En Progreso": "◑",
  Completada: "●",
};

export default function TareaPage() {
  const [lista, setLista] = useState<Tarea[]>(tareasIniciales as Tarea[]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Tarea, "id">>(emptyForm);
  const [errores, setErrores] = useState<Partial<Record<keyof Omit<Tarea, "id">, string>>>({});
  const [filtroEstado, setFiltroEstado] = useState<string>("Todos");
  const [filtroPrioridad, setFiltroPrioridad] = useState<string>("Todas");
  const [busqueda, setBusqueda] = useState("");

  const proyectoMap = Object.fromEntries(
    (proyectos as Proyecto[]).map((p) => [p.id, p])
  );
  const usuarioMap = Object.fromEntries(
    (usuarios as Usuario[]).map((u) => [u.id, u])
  );

  const tareasFiltradas = (lista ?? []).filter((t) => {
    const coincideEstado = filtroEstado === "Todos" || t.estado === filtroEstado;
    const coincidePrioridad = filtroPrioridad === "Todas" || t.prioridad === filtroPrioridad;
    const coincideBusqueda =
      busqueda === "" ||
      t.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      t.descripcion.toLowerCase().includes(busqueda.toLowerCase());
    return coincideEstado && coincidePrioridad && coincideBusqueda;
  });

  const conteoEstado = {
    Pendiente: (lista ?? []).filter((t) => t.estado === "Pendiente").length,
    "En Progreso": (lista ?? []).filter((t) => t.estado === "En Progreso").length,
    Completada: (lista ?? []).filter((t) => t.estado === "Completada").length,
  };

  function abrirCrear() {
    setEditandoId(null);
    setForm(emptyForm);
    setErrores({});
    setModalAbierto(true);
  }

  function abrirEditar(tarea: Tarea) {
    setEditandoId(tarea.id);
    setForm({
      titulo: tarea.titulo,
      descripcion: tarea.descripcion,
      prioridad: tarea.prioridad,
      estado: tarea.estado,
      proyectoId: tarea.proyectoId,
      asignadoId: tarea.asignadoId,
      fechaVencimiento: tarea.fechaVencimiento,
    });
    setErrores({});
    setModalAbierto(true);
  }

  function cerrarModal() {
    setModalAbierto(false);
    setEditandoId(null);
    setForm(emptyForm);
    setErrores({});
  }

  function validar(): boolean {
    const nuevosErrores: Partial<Record<keyof Omit<Tarea, "id">, string>> = {};
    if (!form.titulo.trim()) nuevosErrores.titulo = "El título es obligatorio.";
    if (!form.proyectoId) nuevosErrores.proyectoId = "Selecciona un proyecto.";
    if (!form.asignadoId) nuevosErrores.asignadoId = "Selecciona un responsable.";
    if (!form.fechaVencimiento) nuevosErrores.fechaVencimiento = "La fecha de vencimiento es obligatoria.";
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  }

  function guardar() {
    if (!validar()) return;
    if (editandoId) {
      setLista((prev) =>
        (prev ?? []).map((t) => (t.id === editandoId ? { ...form, id: editandoId } : t))
      );
    } else {
      const nueva: Tarea = { ...form, id: `t-${Date.now()}` };
      setLista((prev) => [nueva, ...prev]);
    }
    cerrarModal();
  }

  function eliminar(id: string) {
    setLista((prev) => (prev ?? []).filter((t) => t.id !== id));
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errores[name as keyof Omit<Tarea, "id">]) {
      setErrores((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 text-gray-800 hover:text-indigo-600 transition-colors">
              <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              <span className="text-xl font-bold tracking-tight">TaskFlow</span>
            </Link>
            <nav className="flex items-center gap-1 text-sm">
              <Link href="/" className="px-3 py-1.5 rounded-md text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors">Dashboard</Link>
              <Link href="/proyecto" className="px-3 py-1.5 rounded-md text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors">Proyectos</Link>
              <span className="px-3 py-1.5 rounded-md bg-indigo-50 text-indigo-700 font-medium">Tareas</span>
              <Link href="/usuario" className="px-3 py-1.5 rounded-md text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors">Usuarios</Link>
            </nav>
          </div>
          <button
            onClick={abrirCrear}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-sm transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Nueva Tarea
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Tareas</h1>
          <p className="text-sm text-gray-500 mt-1">{lista?.length} tarea{lista?.length !== 1 ? "s" : ""} en total</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total", value: lista?.length, textColor: "text-gray-800", icon: "📋" },
            { label: "Pendiente", value: conteoEstado.Pendiente, textColor: "text-gray-500", icon: "○" },
            { label: "En Progreso", value: conteoEstado["En Progreso"], textColor: "text-blue-600", icon: "◑" },
            { label: "Completada", value: conteoEstado.Completada, textColor: "text-emerald-600", icon: "●" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex items-center gap-3">
              <span className="text-2xl">{stat.icon}</span>
              <div>
                <p className={`text-2xl font-bold ${stat.textColor}`}>{stat.value}</p>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="relative flex-1 min-w-0">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input
              type="text"
              placeholder="Buscar tareas..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 bg-white transition"
            >
              <option value="Todos">Todos los estados</option>
              <option value="Pendiente">Pendiente</option>
              <option value="En Progreso">En Progreso</option>
              <option value="Completada">Completada</option>
            </select>
            <select
              value={filtroPrioridad}
              onChange={(e) => setFiltroPrioridad(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 bg-white transition"
            >
              <option value="Todas">Todas las prioridades</option>
              <option value="Alta">Alta</option>
              <option value="Media">Media</option>
              <option value="Baja">Baja</option>
            </select>
            {(filtroEstado !== "Todos" || filtroPrioridad !== "Todas" || busqueda) && (
              <button
                onClick={() => { setFiltroEstado("Todos"); setFiltroPrioridad("Todas"); setBusqueda(""); }}
                className="text-xs text-gray-500 hover:text-gray-800 underline transition-colors"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {tareasFiltradas?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-gray-500 font-medium">No se encontraron tareas</p>
              <p className="text-gray-400 text-sm mt-1">Prueba a cambiar los filtros o crea una nueva tarea.</p>
              <button onClick={abrirCrear} className="mt-4 inline-flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Nueva Tarea
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead>
                  <tr className="bg-gray-50">
                    {["Título", "Proyecto", "Prioridad", "Estado", "Asignado", "Vencimiento", "Acciones"].map((col) => (
                      <th key={col} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {(tareasFiltradas ?? []).map((tarea) => {
                    const proyecto = proyectoMap[tarea.proyectoId];
                    const usuario = usuarioMap[tarea.asignadoId];
                    const vencida =
                      tarea.estado !== "Completada" &&
                      tarea.fechaVencimiento &&
                      new Date(tarea.fechaVencimiento) < new Date();
                    return (
                      <tr key={tarea.id} className="hover:bg-gray-50/80 transition-colors group">
                        <td className="px-5 py-4 max-w-xs">
                          <div className="font-medium text-gray-900 text-sm truncate">{tarea.titulo}</div>
                          {tarea.descripcion && (
                            <div className="text-xs text-gray-400 truncate mt-0.5">{tarea.descripcion}</div>
                          )}
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          {proyecto ? (
                            <div className="flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: proyecto.color ?? "#6366f1" }} />
                              <span className="text-sm text-gray-700">{proyecto.nombre}</span>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400 italic">Sin proyecto</span>
                          )}
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${prioridadBadge[tarea.prioridad] ?? "bg-gray-100 text-gray-600"}`}>
                            {tarea.prioridad}
                          </span>
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${estadoBadge[tarea.estado] ?? "bg-gray-100 text-gray-600"}`}>
                            <span>{estadoIcono[tarea.estado]}</span>
                            {tarea.estado}
                          </span>
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          {usuario ? (
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                                {usuario.nombre.charAt(0).toUpperCase()}
                              </div>
                              <span className="text-sm text-gray-700">{usuario.nombre}</span>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400 italic">Sin asignar</span>
                          )}
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          {tarea.fechaVencimiento ? (
                            <span className={`text-sm font-medium ${vencida ? "text-red-600" : "text-gray-700"}`}>
                              {vencida && <span className="mr-1">⚠</span>}
                              {new Date(tarea.fechaVencimiento).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" })}
                            </span>
                          ) : (
                            <span className="text-xs text-gray-400 italic">Sin fecha</span>
                          )}
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => abrirEditar(tarea)}
                              className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 px-2.5 py-1.5 rounded-md transition-colors"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Editar
                            </button>
                            <button
                              onClick={() => eliminar(tarea.id)}
                              className="inline-flex items-center gap-1 text-xs font-medium text-red-500 hover:text-red-700 hover:bg-red-50 px-2.5 py-1.5 rounded-md transition-colors"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          {tareasFiltradas?.length > 0 && (
            <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 text-xs text-gray-400">
              Mostrando {tareasFiltradas?.length} de {lista?.length} tarea{lista?.length !== 1 ? "s" : ""}
            </div>
          )}
        </div>
      </main>

      {modalAbierto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) cerrarModal(); }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-bold text-gray-900">{editandoId ? "Editar Tarea" : "Nueva Tarea"}</h2>
                <p className="text-sm text-gray-400 mt-0.5">{editandoId ? "Modifica los datos de la tarea." : "Completa los datos para crear una tarea."}</p>
              </div>
              <button onClick={cerrarModal} className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="overflow-y-auto px-6 py-5 space-y-4 flex-1">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="titulo"
                  value={form.titulo}
                  onChange={handleChange}
                  placeholder="Ej. Diseñar pantalla de login"
                  className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 transition ${errores.titulo ? "border-red-400 focus:ring-red-200" : "border-gray-200 focus:ring-indigo-300 focus:border-indigo-400"}`}
                />
                {errores.titulo && <p className="text-xs text-red-500 mt-1">{errores.titulo}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea
                  name="descripcion"
                  value={form.descripcion}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Describe los detalles o criterios de aceptación..."
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 resize-none transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Proyecto <span className="text-red-500">*</span></label>
                  <select
                    name="proyectoId"
                    value={form.proyectoId}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 bg-white transition ${errores.proyectoId ? "border-red-400 focus:ring-red-200" : "border-gray-200 focus:ring-indigo-300 focus:border-indigo-400"}`}
                  >
                    <option value="">Seleccionar...</option>
                    {(proyectos as Proyecto[]).map((p) => (
                      <option key={p.id} value={p.id}>{p.nombre}</option>
                    ))}
                  </select>
                  {errores.proyectoId && <p className="text-xs text-red-500 mt-1">{errores.proyectoId}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prioridad</label>
                  <select
                    name="prioridad"
                    value={form.prioridad}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 bg-white transition"
                  >
                    <option value="Alta">🔴 Alta</option>
                    <option value="Media">🟡 Media</option>
                    <option value="Baja">🟢 Baja</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                  <select
                    name="estado"
                    value={form.estado}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 bg-white transition"
                  >
                    <option value="Pendiente">○ Pendiente</option>
                    <option value="En Progreso">◑ En Progreso</option>
                    <option value="Completada">● Completada</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Asignado a <span className="text-red-500">*</span></label>
                  <select
                    name="asignadoId"
                    value={form.asignadoId}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 bg-white transition ${errores.asignadoId ? "border-red-400 focus:ring-red-200" : "border-gray-200 focus:ring-indigo-300 focus:border-indigo-400"}`}
                  >
                    <option value="">Seleccionar...</option>
                    {(usuarios as Usuario[]).map((u) => (
                      <option key={u.id} value={u.id}>{u.nombre}</option>
                    ))}
                  </select>
                  {errores.asignadoId && <p className="text-xs text-red-500 mt-1">{errores.asignadoId}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Vencimiento <span className="text-red-500">*</span></label>
                <input
                  type="date"
                  name="fechaVencimiento"
                  value={form.fechaVencimiento}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 transition ${errores.fechaVencimiento ? "border-red-400 focus:ring-red-200" : "border-gray-200 focus:ring-indigo-300 focus:border-indigo-400"}`}
                />
                {errores.fechaVencimiento && <p className="text-xs text-red-500 mt-1">{errores.fechaVencimiento}</p>}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
              <button onClick={cerrarModal} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-colors">
                Cancelar
              </button>
              <button
                onClick={guardar}
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-medium px-5 py-2 rounded-lg shadow-sm transition-colors"
              >
                {editandoId ? (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Guardar cambios
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Crear tarea
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}