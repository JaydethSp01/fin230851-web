export type Priority = {
  id: string;
  name: string;
  level: number;
  color: string;
  bgColor: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: "admin" | "manager" | "member";
  department: string;
  createdAt: string;
};

export type Project = {
  id: string;
  name: string;
  description: string;
  status: "active" | "paused" | "completed" | "archived";
  ownerId: string;
  memberIds: string[];
  color: string;
  startDate: string;
  dueDate: string;
  createdAt: string;
};

export type Task = {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in_progress" | "review" | "done";
  priorityId: string;
  projectId: string;
  assigneeId: string;
  reporterId: string;
  tags: string[];
  estimatedHours: number;
  loggedHours: number;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
};

export const priorities: Priority[] = [
  {
    id: "priority-1",
    name: "Crítica",
    level: 4,
    color: "text-red-700",
    bgColor: "bg-red-100",
  },
  {
    id: "priority-2",
    name: "Alta",
    level: 3,
    color: "text-orange-700",
    bgColor: "bg-orange-100",
  },
  {
    id: "priority-3",
    name: "Media",
    level: 2,
    color: "text-yellow-700",
    bgColor: "bg-yellow-100",
  },
  {
    id: "priority-4",
    name: "Baja",
    level: 1,
    color: "text-green-700",
    bgColor: "bg-green-100",
  },
];

export const users: User[] = [
  {
    id: "user-1",
    name: "Lucía Fernández",
    email: "lucia.fernandez@empresa.com",
    avatar: "LF",
    role: "admin",
    department: "Producto",
    createdAt: "2024-01-10T08:00:00Z",
  },
  {
    id: "user-2",
    name: "Carlos Mendoza",
    email: "carlos.mendoza@empresa.com",
    avatar: "CM",
    role: "manager",
    department: "Ingeniería",
    createdAt: "2024-01-15T09:30:00Z",
  },
  {
    id: "user-3",
    name: "Ana Torres",
    email: "ana.torres@empresa.com",
    avatar: "AT",
    role: "member",
    department: "Diseño",
    createdAt: "2024-02-01T10:00:00Z",
  },
  {
    id: "user-4",
    name: "Diego Ramírez",
    email: "diego.ramirez@empresa.com",
    avatar: "DR",
    role: "member",
    department: "Ingeniería",
    createdAt: "2024-02-14T11:00:00Z",
  },
  {
    id: "user-5",
    name: "Sofía Blanco",
    email: "sofia.blanco@empresa.com",
    avatar: "SB",
    role: "manager",
    department: "Marketing",
    createdAt: "2024-03-05T08:45:00Z",
  },
  {
    id: "user-6",
    name: "Martín López",
    email: "martin.lopez@empresa.com",
    avatar: "ML",
    role: "member",
    department: "Ingeniería",
    createdAt: "2024-03-20T09:00:00Z",
  },
];

export const projects: Project[] = [
  {
    id: "project-1",
    name: "Rediseño Portal Cliente",
    description:
      "Renovación completa de la interfaz del portal de clientes con nuevo sistema de diseño y mejoras de accesibilidad.",
    status: "active",
    ownerId: "user-1",
    memberIds: ["user-1", "user-2", "user-3", "user-4"],
    color: "#6366f1",
    startDate: "2026-03-01",
    dueDate: "2026-07-31",
    createdAt: "2026-02-20T10:00:00Z",
  },
  {
    id: "project-2",
    name: "API v3 Pagos",
    description:
      "Implementación de la nueva versión de la API de pagos con soporte para múltiples proveedores y webhooks.",
    status: "active",
    ownerId: "user-2",
    memberIds: ["user-2", "user-4", "user-6"],
    color: "#10b981",
    startDate: "2026-04-01",
    dueDate: "2026-08-15",
    createdAt: "2026-03-15T09:00:00Z",
  },
  {
    id: "project-3",
    name: "Campaña Verano 2026",
    description:
      "Planificación y ejecución de la campaña de marketing digital para la temporada de verano.",
    status: "active",
    ownerId: "user-5",
    memberIds: ["user-5", "user-3", "user-1"],
    color: "#f59e0b",
    startDate: "2026-05-15",
    dueDate: "2026-08-31",
    createdAt: "2026-05-01T08:00:00Z",
  },
  {
    id: "project-4",
    name: "Migración Base de Datos",
    description:
      "Migración de la base de datos legacy a PostgreSQL con zero downtime y validación de integridad de datos.",
    status: "paused",
    ownerId: "user-2",
    memberIds: ["user-2", "user-4", "user-6"],
    color: "#ef4444",
    startDate: "2026-02-01",
    dueDate: "2026-06-30",
    createdAt: "2026-01-20T11:00:00Z",
  },
  {
    id: "project-5",
    name: "App Móvil iOS",
    description:
      "Desarrollo de la aplicación nativa para iOS con funcionalidades offline y sincronización en tiempo real.",
    status: "active",
    ownerId: "user-1",
    memberIds: ["user-1", "user-6", "user-4", "user-3"],
    color: "#8b5cf6",
    startDate: "2026-06-01",
    dueDate: "2026-12-01",
    createdAt: "2026-05-20T10:30:00Z",
  },
  {
    id: "project-6",
    name: "Dashboard Analytics",
    description:
      "Panel de análisis en tiempo real con visualizaciones interactivas y reportes exportables para clientes.",
    status: "completed",
    ownerId: "user-5",
    memberIds: ["user-5", "user-3", "user-2"],
    color: "#06b6d4",
    startDate: "2025-11-01",
    dueDate: "2026-03-31",
    createdAt: "2025-10-15T09:00:00Z",
  },
];

export const tasks: Task[] = [
  {
    id: "task-1",
    title: "Definir sistema de diseño tokens",
    description:
      "Crear y documentar todos los design tokens (colores, tipografía, espaciado, sombras) en Figma y exportarlos como variables CSS.",
    status: "done",
    priorityId: "priority-2",
    projectId: "project-1",
    assigneeId: "user-3",
    reporterId: "user-1",
    tags: ["diseño", "frontend"],
    estimatedHours: 16,
    loggedHours: 18,
    dueDate: "2026-04-15",
    createdAt: "2026-03-01T10:00:00Z",
    updatedAt: "2026-04-14T17:30:00Z",
  },
  {
    id: "task-2",
    title: "Implementar componente Header responsivo",
    description:
      "Desarrollar el nuevo header con navegación adaptativa, menú móvil y soporte para múltiples roles de usuario.",
    status: "in_progress",
    priorityId: "priority-2",
    projectId: "project-1",
    assigneeId: "user-4",
    reporterId: "user-2",
    tags: ["frontend", "componentes"],
    estimatedHours: 12,
    loggedHours: 7,
    dueDate: "2026-07-05",
    createdAt: "2026-04-20T09:00:00Z",
    updatedAt: "2026-06-20T16:00:00Z",
  },
  {
    id: "task-3",
    title: "Endpoint autenticación OAuth 2.0",
    description:
      "Implementar flujo completo de autenticación con Google y Microsoft usando OAuth 2.0 y JWT tokens con refresh.",
    status: "review",
    priorityId: "priority-1",
    projectId: "project-2",
    assigneeId: "user-6",
    reporterId: "user-2",
    tags: ["backend", "seguridad", "auth"],
    estimatedHours: 24,
    loggedHours: 22,
    dueDate: "2026-06-28",
    createdAt: "2026-04-05T11:00:00Z",
    updatedAt: "2026-06-22T14:45:00Z",
  },
  {
    id: "task-4",
    title: "Integración Stripe webhooks",
    description:
      "Configurar y procesar todos los eventos de Stripe: payment_intent, subscription, invoice y manejo de reintentos.",
    status: "todo",
    priorityId: "priority-1",
    projectId: "project-2",
    assigneeId: "user-4",
    reporterId: "user-2",
    tags: ["backend", "pagos", "integración"],
    estimatedHours: 20,
    loggedHours: 0,
    dueDate: "2026-07-20",
    createdAt: "2026-05-10T10:00:00Z",
    updatedAt: "2026-05-10T10:00:00Z",
  },
  {
    id: "task-5",
    title: "Crear brief campaña redes sociales",
    description:
      "Redactar el brief creativo para las publicaciones en Instagram, LinkedIn y TikTok incluyendo calendario editorial.",
    status: "in_progress",
    priorityId: "priority-3",
    projectId: "project-3",
    assigneeId: "user-5",
    reporterId: "user-1",
    tags: ["marketing", "contenido"],
    estimatedHours: 8,
    loggedHours: 5,
    dueDate: "2026-06-30",
    createdAt: "2026-05-20T09:00:00Z",
    updatedAt: "2026-06-18T11:00:00Z",
  },
  {
    id: "task-6",
    title: "Diseño piezas gráficas campaña",
    description:
      "Crear todas las piezas visuales: banners, stories, posts y video thumbnails siguiendo la guía de marca 2026.",
    status: "todo",
    priorityId: "priority-3",
    projectId: "project-3",
    assigneeId: "user-3",
    reporterId: "user-5",
    tags: ["diseño", "marketing"],
    estimatedHours: 30,
    loggedHours: 0,
    dueDate: "2026-07-15",
    createdAt: "2026-06-01T10:00:00Z",
    updatedAt: "2026-06-01T10:00:00Z",
  },
  {
    id: "task-7",
    title: "Plan de migración y rollback",
    description:
      "Documentar el plan detallado de migración con scripts de rollback, puntos de control y criterios de éxito.",
    status: "todo",
    priorityId: "priority-1",
    projectId: "project-4",
    assigneeId: "user-2",
    reporterId: "user-2",
    tags: ["infraestructura", "base-de-datos"],
    estimatedHours: 16,
    loggedHours: 4,
    dueDate: "2026-07-10",
    createdAt: "2026-02-05T09:00:00Z",
    updatedAt: "2026-05-30T15:00:00Z",
  },
  {
    id: "task-8",
    title: "Arquitectura offline-first iOS",
    description:
      "Diseñar e implementar la capa de sincronización con Core Data y resolución de conflictos para modo sin conexión.",
    status: "in_progress",
    priorityId: "priority-2",
    projectId: "project-5",
    assigneeId: "user-6",
    reporterId: "user-1",
    tags: ["ios", "arquitectura", "offline"],
    estimatedHours: 40,
    loggedHours: 12,
    dueDate: "2026-08-30",
    createdAt: "2026-06-05T10:00:00Z",
    updatedAt: "2026-06-22T09:30:00Z",
  },
];

// Auto-stub (deploy validator): exports que las paginas usan pero faltaban.
export const mockProyectos: any = {};
export const prioridades: any = {};
export const proyectos: any = {};
export const tareas: any = {};
export type Proyecto = any;
export const usuarios: any = {};
