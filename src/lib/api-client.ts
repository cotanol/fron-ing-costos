import {
  Proyecto,
  Costo,
  Beneficio,
  Analisis,
  CrearCostoDto,
  CrearBeneficioDto,
  CrearProyectoDto,
} from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// HELPERS

async function fetcher<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, options);
  if (!response.ok) {
    const error = new Error("An error occurred while fetching the data.");
    // Attach more info to the error object
    (error as any).info = await response.json();
    (error as any).status = response.status;
    throw error;
  }
  return response.json();
}

const handleDelete = async (url: string, entityName: string) => {
  const response = await fetch(url, { method: "DELETE" });
  if (!response.ok) {
    const error = new Error(
      `An error occurred while deleting the ${entityName}.`
    );
    try {
      (error as any).info = await response.json();
    } catch (e) {
      (error as any).info = { message: await response.text() };
    }
    (error as any).status = response.status;
    throw error;
  }
};

// --- PROYECTOS ---
export const getProyectos = (): Promise<Proyecto[]> =>
  fetcher(`${API_URL}/proyectos`);

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

export const getCostos = (): Promise<Costo[]> => fetcher(`${API_URL}/costos`);

export const getCostoPorId = (id: string): Promise<Costo> =>
  fetcher(`${API_URL}/costos/${id}`);

export const crearCosto = (costo: CrearCostoDto): Promise<Costo> =>
  fetcher(`${API_URL}/costos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(costo),
  });
export const modificarCosto = (
  id: string,
  costo: Partial<CrearCostoDto>
): Promise<Costo> =>
  fetcher(`${API_URL}/costos/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(costo),
  });
export const eliminarCosto = (id: string): Promise<void> =>
  handleDelete(`${API_URL}/costos/${id}`, "costo");

// --- BENEFICIOS ---

export const getBeneficios = (): Promise<Beneficio[]> =>
  fetcher(`${API_URL}/beneficios`);

export const getBeneficioPorId = (id: string): Promise<Beneficio> =>
  fetcher(`${API_URL}/beneficios/${id}`);

export const crearBeneficio = (
  beneficio: CrearBeneficioDto
): Promise<Beneficio> =>
  fetcher(`${API_URL}/beneficios`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(beneficio),
  });
export const modificarBeneficio = (
  id: string,
  beneficio: Partial<Beneficio>
): Promise<Beneficio> =>
  fetcher(`${API_URL}/beneficios/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(beneficio),
  });
export const eliminarBeneficio = (id: string): Promise<void> =>
  handleDelete(`${API_URL}/beneficios/${id}`, "beneficio");

// --- ANALISIS ---
export const getAnalisis = async (projectId: string): Promise<Analisis> => {
  const result = await fetcher<any>(`${API_URL}/analisis/${projectId}`);

  return result;
};
