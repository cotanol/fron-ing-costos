"use client";

import useSWR from "swr";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";

import { ArrowLeft, Calendar, Percent } from "lucide-react";
import {
  getProyectoPorId,
  getAnalisis,
  crearFlujoFinanciero,
  eliminarFlujoFinanciero,
} from "@/lib/api-client";
import { CrearFlujoFinancieroDto, FlujoFinanciero } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import KpisCards from "./analysis-cards/kpis-cards";
import ChartsCards from "./analysis-cards/charts-cards";
import TablesFlowsCards from "./analysis-cards/tables-flows-cards";

interface AnalysisClientProps {
  projectId: string;
}

export function AnalysisClient({ projectId }: AnalysisClientProps) {
  const {
    data: project,
    error: projectError,
    mutate: mutateProject,
  } = useSWR(`proyecto-${projectId}`, () => getProyectoPorId(projectId));
  const {
    data: analysis,
    error: analysisError,
    mutate: mutateAnalysis,
  } = useSWR(project ? `analisis-${projectId}` : null, () =>
    getAnalisis(projectId)
  );

  const handleCrearFlujo = async (flujoData: CrearFlujoFinancieroDto) => {
    await crearFlujoFinanciero(flujoData);
    mutateProject();
    mutateAnalysis();
  };

  const handleEliminarFlujo = async (flujoId: string) => {
    await eliminarFlujoFinanciero(flujoId);
    mutateProject();
    mutateAnalysis();
  };

  const isLoading = !project && !projectError;
  const isAnalysisLoading = !analysis && !analysisError;

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 space-y-8">
        <Skeleton className="h-12 w-1/2" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-80 w-full" />
          <Skeleton className="h-80 w-full" />
        </div>
      </div>
    );
  }

  if (projectError) {
    return (
      <div className="text-center py-12 text-red-500">
        Error al cargar el proyecto.
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        El proyecto no se encontró o no pudo ser cargado.
      </div>
    );
  }

  const ingresos: FlujoFinanciero[] =
    project.flujos?.filter((flujo) => flujo.tipoFlujo === "INGRESO") || [];

  const egresos: FlujoFinanciero[] =
    project.flujos?.filter((flujo) => flujo.tipoFlujo === "EGRESO") || [];

  return (
    <div>
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          {/* 1. Enlace "Volver" - Ahora está fuera y encima del resto */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6 text-sm"
          >
            <ArrowLeft size={16} />
            Volver al Dashboard
          </Link>

          {/* 2. Contenido Principal del Encabezado */}
          <div>
            <h1 className="text-4xl font-bold text-custom-purple mb-2">
              {project.nombre}
            </h1>
            <p className="text-lg text-custom-violet mb-4">
              {project.descripcion}
            </p>
            <div className="flex items-center gap-4">
              <Badge
                variant="outline"
                className="flex items-center gap-2 py-1 px-3"
              >
                <Calendar className="w-4 h-4" />
                <span className="text-sm">
                  {project.horizonteAnalisis} años
                </span>
              </Badge>
              <Badge
                variant="outline"
                className="flex items-center gap-2 py-1 px-3"
              >
                <Percent className="w-4 h-4" />
                <span className="text-sm">
                  {project.tasaDescuento} descuento
                </span>
              </Badge>
            </div>
          </div>
        </div>

        {/* KPIs Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {!analysis ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))
          ) : (
            <KpisCards analysis={analysis} project={project} />
          )}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {isAnalysisLoading
            ? Array.from({ length: 2 }).map((_, i) => (
                <Skeleton key={i} className="h-80 w-full" />
              ))
            : analysis && <ChartsCards analysis={analysis} project={project} />}
        </div>

        {/* Costs and Benefits Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TablesFlowsCards
            project={project}
            ingresos={ingresos}
            egresos={egresos}
            handleCrearFlujo={handleCrearFlujo}
            handleEliminarFlujo={handleEliminarFlujo}
          />
        </div>
      </div>
    </div>
  );
}
