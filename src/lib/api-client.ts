import {
  Proyecto,
  FlujoFinanciero,
  CategoriaFlujo,
  ItemFlujoBase,
  CrearProyectoDto,
  CrearFlujoFinancieroDto,
  Analisis,
  User,
} from "./types";

interface AuthResponse {
  user: User;
  token: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// HELPERS

async function customFetch(url: string, options?: RequestInit) {
  let token = null;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options?.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    if (response.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    const error = new Error("An error occurred while fetching the data.");
    try {
      const errorInfo = await response.json();
      (error as any).info = errorInfo;

      // --- LÍNEA AÑADIDA ---
      // Imprime el detalle del error del backend en la consola para depuración
      console.error("--- DETALLE DEL ERROR DEL BACKEND ---", errorInfo);
      // ---------------------
    } catch (e) {
      (error as any).info = { message: "Error reading response body." };
    }
    (error as any).status = response.status;
    throw error;
  }

  return response;
}

// MODIFICADO: Tu fetcher ahora usa customFetch
async function fetcher<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await customFetch(url, options);
  // Si la petición es DELETE, puede que no haya un cuerpo JSON
  if (response.status === 204) {
    return null as T;
  }
  return response.json();
}

// MODIFICADO: Tu handleDelete ahora usa customFetch
const handleDelete = async (url: string, entityName: string) => {
  // Ya no necesitamos la lógica de fetch aquí, customFetch se encarga
  await customFetch(url, { method: "DELETE" });
};

// --- AUTHENTICATION ---
export const checkAuthStatus = (): Promise<AuthResponse> =>
  fetcher(`${API_URL}/auth/check-status`);

export const loginUser = (
  email: string,
  password: string
): Promise<AuthResponse> =>
  fetcher(`${API_URL}/auth/login`, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

export const registerUser = (userData: any): Promise<AuthResponse> =>
  fetcher(`${API_URL}/auth/register`, {
    method: "POST",
    body: JSON.stringify(userData),
  });

// --- PROYECTOS ---
export const getProyectos = (): Promise<Proyecto[]> =>
  fetcher(`${API_URL}/proyectos`);

export const getProyectosByUser = (): Promise<Proyecto[]> =>
  fetcher(`${API_URL}/proyectos/user`);

export const getProyectoPorId = (id: string): Promise<Proyecto> =>
  fetcher(`${API_URL}/proyectos/${id}`);

export const crearProyecto = (proyecto: CrearProyectoDto): Promise<Proyecto> =>
  fetcher(`${API_URL}/proyectos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(proyecto),
  });

export const modificarProyecto = (
  id: string,
  proyecto: Partial<CrearProyectoDto>
): Promise<Proyecto> =>
  fetcher(`${API_URL}/proyectos/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(proyecto),
  });

export const eliminarProyecto = (id: string): Promise<void> =>
  handleDelete(`${API_URL}/proyectos/${id}`, "proyecto");

// --- COSTOS ---

export const getFlujosFinancieros = (): Promise<FlujoFinanciero[]> =>
  fetcher(`${API_URL}/flujos-financieros`);

export const getFlujoFinancieroPorId = (id: string): Promise<FlujoFinanciero> =>
  fetcher(`${API_URL}/flujos-financieros/${id}`);

export const crearFlujoFinanciero = (
  flujo: CrearFlujoFinancieroDto
): Promise<FlujoFinanciero> =>
  fetcher(`${API_URL}/flujos-financieros`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(flujo),
  });
export const modificarFlujoFinanciero = (
  id: string,
  flujo: Partial<CrearFlujoFinancieroDto>
): Promise<FlujoFinanciero> =>
  fetcher(`${API_URL}/flujos-financieros/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(flujo),
  });
export const eliminarFlujoFinanciero = (id: string): Promise<void> =>
  handleDelete(`${API_URL}/flujos-financieros/${id}`, "flujo financiero");

// --- BIBLIOTECA DE COSTOS ---

export const getCategoriasFlujo = (): Promise<CategoriaFlujo[]> =>
  fetcher(`${API_URL}/categorias-flujo`);

export const getItemsFlujoBase = (
  categoriaId?: string
): Promise<ItemFlujoBase[]> => {
  const url = new URL(`${API_URL}/items-flujo-base`);
  if (categoriaId) {
    url.searchParams.append("categoriaId", categoriaId);
  }
  return fetcher(url.toString());
};

// --- ANALISIS ---
export const getAnalisis = async (projectId: string): Promise<Analisis> => {
  const result = await fetcher<any>(`${API_URL}/analisis/${projectId}`);

  return result;
};
