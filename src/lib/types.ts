// Solicitudes GET

export interface Proyecto {
  id: string;
  nombre: string;
  descripcion: string;
  horizonteAnalisis: number; // años
  tasaDescuento: number; // porcentaje
  costos?: Costo[];
  beneficios?: Beneficio[];
}

export interface Costo {
  id: string;
  nombre: string;
  descripcion: string;
  tipo: "FIJO" | "VARIABLE";
  valoresAnuales: number[];
  proyecto: Proyecto;
}

export interface Beneficio {
  id: string;
  nombre: string;
  descripcion: string;
  tipo: "TANGIBLE" | "INTANGIBLE";
  valoresAnuales: number[];
  proyecto: Proyecto;
}

export interface Analisis {
  valorActualNeto: number;
  tasaInternaRetorno: number | null;
  periodoRecuperacion: number | null;
  flujosCajaNetos: number[];
  flujosCajaAcumulados: number[];
}

// --- DTOs para API requests ---

export type CrearProyectoDto = Omit<Proyecto, "id" | "costos" | "beneficios">;

export interface CrearCostoDto {
  nombre: string;
  descripcion: string;
  tipo: "FIJO" | "VARIABLE";
  valoresAnuales: number[];
  proyectoId?: string; // id del proyecto al que pertenece
}

export interface CrearBeneficioDto {
  nombre: string;
  descripcion: string;
  tipo: "TANGIBLE" | "INTANGIBLE";
  valoresAnuales: number[];
  proyectoId?: string; // id del proyecto al que pertenece
}
