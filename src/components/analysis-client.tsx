"use client";

import useSWR from "swr";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CreateCostDialog } from "@/components/create-cost-dialog";
import { CreateBenefitDialog } from "@/components/create-benefit-dialog";
import {
  ArrowLeft,
  TrendingUp,
  DollarSign,
  Clock,
  Calendar,
  Percent,
  Trash2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  getProyectoPorId,
  getAnalisis,
  crearCosto,
  eliminarCosto,
  crearBeneficio,
  eliminarBeneficio,
} from "@/lib/api-client";
import { CrearCostoDto, CrearBeneficioDto, Proyecto } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

interface AnalysisClientProps {
  proyecto: Proyecto;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR", // You can change this to your desired currency
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export function AnalysisClient({
  proyecto: initialProject,
}: AnalysisClientProps) {
  const projectId = initialProject.id;
  // Fetch project data and analysis results in parallel
  const {
    data: project,
    error: projectError,
    mutate: mutateProject,
  } = useSWR(
    `proyecto-${projectId}`,
    () => getProyectoPorId(projectId),
    // Usar la prop como data inicial mientras cargamos el proyecto
    { fallbackData: initialProject }
  );
  const {
    data: analysis,
    error: analysisError,
    mutate: mutateAnalysis,
  } = useSWR(project ? `analisis-${projectId}` : null, () =>
    getAnalisis(projectId)
  );

  const handleCrearCosto = async (costData: CrearCostoDto) => {
    await crearCosto(costData);
    mutateProject();
    mutateAnalysis();
  };

  const handleEliminarCosto = async (costId: string) => {
    await eliminarCosto(costId);
    mutateProject();
    mutateAnalysis();
  };

  const handleCrearBeneficio = async (benefitData: CrearBeneficioDto) => {
    await crearBeneficio(benefitData);
    mutateProject();
    mutateAnalysis();
  };

  const handleEliminarBeneficio = async (benefitId: string) => {
    await eliminarBeneficio(benefitId);
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

  // Prepare chart data once analysis is available
  const chartData = analysis
    ? Array.from({ length: project.horizonteAnalisis }, (_, index) => ({
        year: `Año ${index}`,
        flujoNeto: analysis.flujosCajaNetos[index],
        flujoAcumulado: analysis.flujosCajaAcumulados[index],
      }))
    : [];

  if (analysis) {
    console.log("DATOS FINALES PARA LOS GRÁFICOS:", chartData);
  }

  return (
    <div>
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {project.nombre}
              </h1>
              <p className="text-muted-foreground">{project.descripcion}</p>
              <div className="flex gap-2 mt-2">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {project.horizonteAnalisis} años
                </Badge>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Percent className="w-3 h-3" />
                  {project.tasaDescuento}% descuento
                </Badge>
              </div>
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
            <>
              <Card className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-custom-silver/30">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    VAN (Valor Actual Neto)
                  </CardTitle>
                  <div className="bg-red-100 p-3 rounded-xl">
                    <DollarSign className="h-4 w-4 text-red-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-600">
                    {formatCurrency(analysis.valorActualNeto)}
                  </div>
                  <p className="text-xs text-red-500">
                    {analysis.valorActualNeto > 0
                      ? "Proyecto viable"
                      : "Proyecto no viable"}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-custom-silver/30">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    TIR (Tasa Interna de Retorno)
                  </CardTitle>
                  <div className="bg-red-100 p-3 rounded-xl">
                    <TrendingUp className="h-4 w-4 text-red-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-600">
                    {typeof analysis.tasaInternaRetorno === "number"
                      ? `${analysis.tasaInternaRetorno.toFixed(1)}%`
                      : "N/A"}
                  </div>
                  <p className="text-xs text-red-500">
                    {typeof analysis.tasaInternaRetorno === "number" &&
                    analysis.tasaInternaRetorno > project.tasaDescuento
                      ? "Superior a tasa de descuento"
                      : "Inferior o no aplicable"}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-custom-silver/30">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Período de Recuperación
                  </CardTitle>
                  <div className="bg-red-100 p-3 rounded-xl">
                    <Clock className="h-4 w-4 text-red-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-600">
                    {typeof analysis.periodoRecuperacion === "number"
                      ? `${analysis.periodoRecuperacion.toFixed(2)} años`
                      : "No se recupera"}
                  </div>
                  <p className="text-xs text-red-500">
                    Tiempo para recuperar la inversión
                  </p>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {isAnalysisLoading ? (
            Array.from({ length: 2 }).map((_, i) => (
              <Skeleton key={i} className="h-80 w-full" />
            ))
          ) : (
            <>
              <Card className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-custom-silver/30">
                <CardHeader>
                  <CardTitle>Flujo de Caja Neto Anual</CardTitle>
                  <CardDescription>
                    Beneficios menos costos por año
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                      {/* 1. Definimos AMBOS gradientes*/}
                      <defs>
                        {/* Gradiente para valores positivos (Dogwood a Salmon) */}
                        <linearGradient
                          id="positiveGradient"
                          x1="0"
                          y1="0"
                          x2="1"
                          y2="1"
                        >
                          <stop offset="0%" stopColor="#fac9b8" />{" "}
                          {/* custom-dogwood */}
                          <stop offset="100%" stopColor="#db8a74" />{" "}
                          {/* custom-salmon */}
                        </linearGradient>

                        {/* Gradiente para valores negativos (Violet a Purple) */}
                        <linearGradient
                          id="negativeGradient"
                          x1="0"
                          y1="0"
                          x2="1"
                          y2="1"
                        >
                          <stop offset="0%" stopColor="#444054" />{" "}
                          {/* custom-violet */}
                          <stop offset="100%" stopColor="#2f243a" />{" "}
                          {/* custom-purple */}
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis tickFormatter={(value) => formatCurrency(value)} />
                      <Tooltip
                        formatter={(value: number) => [
                          formatCurrency(value),
                          "Flujo Neto",
                        ]}
                      />
                      {/* 2. Usa el componente <Bar> con <Cell> para aplicar la lógica */}
                      <Bar dataKey="flujoNeto">
                        {chartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            // 3. Aquí está la lógica condicional para el 'fill'
                            fill={
                              entry.flujoNeto >= 0
                                ? "url(#positiveGradient)"
                                : "url(#negativeGradient)"
                            }
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-custom-silver/30">
                <CardHeader>
                  <CardTitle>Flujo de Caja Acumulado</CardTitle>
                  <CardDescription>
                    Evolución del retorno de la inversión
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                      <defs>
                        <linearGradient
                          id="lineGradient"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="0%"
                        >
                          <stop offset="0%" stopColor="#444054" />
                          <stop offset="100%" stopColor="#DB8A74" />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis tickFormatter={(value) => formatCurrency(value)} />
                      <Tooltip
                        formatter={(value: number) => [
                          formatCurrency(value),
                          "Flujo Acumulado",
                        ]}
                      />
                      <Line
                        type="monotone"
                        dataKey="flujoAcumulado"
                        stroke="url(#lineGradient)"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Costs and Benefits Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Costs Table */}

          <Card className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-custom-silver/30">
            <CardHeader className="flex justify-between items-center mb-4">
              <CardTitle className="text-xl font-bold text-custom-purple">
                Costos del Proyecto
              </CardTitle>
              <CreateCostDialog
                onCrearCosto={handleCrearCosto}
                horizonteAnalisis={project.horizonteAnalisis}
                proyectoId={projectId}
              />
            </CardHeader>

            <CardContent className="">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {project.costos?.map((cost) => (
                    <TableRow key={cost.id}>
                      <TableCell>{cost.nombre}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            cost.tipo === "FIJO" ? "secondary" : "outline"
                          }
                        >
                          {cost.tipo}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {formatCurrency(
                          cost.valoresAnuales.reduce(
                            (sum, value) => sum + value,
                            0
                          )
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEliminarCosto(cost.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Benefits Table */}

          <Card className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-custom-silver/30">
            <CardHeader className="flex justify-between items-center mb-4">
              <CardTitle className="text-xl font-bold text-custom-purple">
                Beneficios del Proyecto
              </CardTitle>
              <CreateBenefitDialog
                onCrearBeneficio={handleCrearBeneficio}
                horizonteAnalisis={project.horizonteAnalisis}
                proyectoId={projectId}
              />
            </CardHeader>
            <CardContent className="">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {project.beneficios?.map((benefit) => (
                    <TableRow key={benefit.id}>
                      <TableCell>{benefit.nombre}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            benefit.tipo === "TANGIBLE"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {benefit.tipo}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {formatCurrency(
                          benefit.valoresAnuales.reduce(
                            (sum, value) => sum + value,
                            0
                          )
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEliminarBeneficio(benefit.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
