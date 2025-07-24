export interface User {
  id: string;
  nombres: string;
  apellidos: string;
  isActive: boolean;
  email: string;
  roles: string[];
}

export interface Proyecto {
  id: string;
  nombre: string;
  descripcion: string;
  horizonteAnalisis: number; // años
  tasaDescuento: number; // porcentaje
  flujos?: FlujoFinanciero[];
  user: User;
}

export interface FlujoFinanciero {
  id: string;
  nombre: string;
  descripcion: string;
  tipoFlujo: "INGRESO" | "EGRESO";
  tipo: "DIRECTO" | "INDIRECTO";
  comportamiento: "FIJO" | "VARIABLE";
  naturaleza: "TANGIBLE" | "INTANGIBLE";
  valoresAnuales: number[];
  proyecto: Proyecto;
}

export interface CategoriaFlujo {
  id: string;
  nombre: string;
  descripcion: string;
  itemsFlujoBase?: ItemFlujoBase[];
}

export interface ItemFlujoBase {
  id: string;
  nombre: string;
  descripcion: string;
  montoSugerido: number;
  tipo: "DIRECTO" | "INDIRECTO";
  frecuencia: "UNICO" | "ANUAL" | "MENSUAL";
  naturaleza: "TANGIBLE" | "INTANGIBLE";
  tipoFlujo: "INGRESO" | "EGRESO";
  comportamiento: "FIJO" | "VARIABLE";
  categoria: CategoriaFlujo;
}

export interface Analisis {
  valorActualNeto: number;
  tasaInternaRetorno: number | null;
  periodoRecuperacion: number | null;
  flujosCajaNetos: number[];
  flujosCajaAcumulados: number[];
}

// --- DTOs para API requests ---

export type CrearProyectoDto = Omit<Proyecto, "id" | "flujos" | "user">;

export interface CrearFlujoFinancieroDto {
  proyectoId: string;
  descripcion: string;
  nombre: string;
  tipoFlujo: "INGRESO" | "EGRESO";
  comportamiento: "FIJO" | "VARIABLE";
  tipo: "DIRECTO" | "INDIRECTO";
  naturaleza: "TANGIBLE" | "INTANGIBLE";
  valoresAnuales: number[];
  itemFlujoBaseId?: string;
  categoriaId?: string;
}

export type CrearCategoriaFlujoDto = Omit<
  CategoriaFlujo,
  "id" | "itemsFlujoBase"
>;

export interface CrearItemFlujoBaseDto {
  nombre: string;
  descripcion: string;
  tipoFlujo: "INGRESO" | "EGRESO";
  tipo: "DIRECTO" | "INDIRECTO";
  naturaleza: "TANGIBLE" | "INTANGIBLE";
  comportamiento: "FIJO" | "VARIABLE";
  frecuencia: "UNICO" | "ANUAL" | "MENSUAL";
  montoSugerido: number;
  categoriaId: string;
}
