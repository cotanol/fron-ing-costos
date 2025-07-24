import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Analisis, Proyecto } from "@/lib/types";

interface ChartsCardsProps {
  analysis: Analisis;
  project: Proyecto;
}

const ChartsCards = ({ analysis, project }: ChartsCardsProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR", // You can change this to your desired currency
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const chartData = useMemo(
    () =>
      analysis
        ? Array.from({ length: project.horizonteAnalisis }, (_, index) => ({
            year: `Año ${index}`,
            flujoNeto: analysis.flujosCajaNetos[index],
            flujoAcumulado: analysis.flujosCajaAcumulados[index],
          }))
        : [],
    [analysis, project.horizonteAnalisis]
  );

  const COLORS = {
    DIRECTO: "#8884d8",
    INDIRECTO: "#82ca9d",
    TANGIBLE: "#ffc658",
    INTANGIBLE: "#ff8042",
    FIJO: "#0088FE",
    VARIABLE: "#00C49F",
    // Nuevos colores para gradientes y barras
    POSITIVE_START: "#fac9b8",
    POSITIVE_END: "#db8a74",
    NEGATIVE_START: "#444054",
    NEGATIVE_END: "#2f243a",
  };

  const flujoData = useMemo(() => {
    if (!project.flujos) return [];
    return project.flujos.map((flujo) => ({
      ...flujo,
      total: flujo.valoresAnuales.reduce((acc, val) => acc + val, 0),
    }));
  }, [project.flujos]);

  const dataByType = useMemo(() => {
    return Object.entries(
      flujoData.reduce((acc, flujo) => {
        const key = flujo.tipo;
        if (!acc[key]) {
          acc[key] = 0;
        }
        acc[key] += flujo.total;
        return acc;
      }, {} as Record<string, number>)
    ).map(([name, value]) => ({ name, value }));
  }, [flujoData]);

  const dataByNature = useMemo(() => {
    return Object.entries(
      flujoData.reduce((acc, flujo) => {
        const key = flujo.naturaleza;
        if (!acc[key]) {
          acc[key] = 0;
        }
        acc[key] += flujo.total;
        return acc;
      }, {} as Record<string, number>)
    ).map(([name, value]) => ({ name, value }));
  }, [flujoData]);

  const dataByBehavior = useMemo(() => {
    return Object.entries(
      flujoData.reduce((acc, flujo) => {
        const key = flujo.comportamiento;
        if (!acc[key]) {
          acc[key] = 0;
        }
        acc[key] += flujo.total;
        return acc;
      }, {} as Record<string, number>)
    ).map(([name, value]) => ({ name, value }));
  }, [flujoData]);

  return (
    <>
      <Card className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-custom-silver/30">
        <CardHeader>
          <CardTitle>Flujo de Caja Neto Anual</CardTitle>
          <CardDescription>Ingresos menos egresos por año</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <defs>
                <linearGradient id="positiveGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor={COLORS.POSITIVE_START} />
                  <stop offset="100%" stopColor={COLORS.POSITIVE_END} />
                </linearGradient>
                <linearGradient id="negativeGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor={COLORS.NEGATIVE_START} />
                  <stop offset="100%" stopColor={COLORS.NEGATIVE_END} />
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
              <Bar dataKey="flujoNeto">
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
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
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={COLORS.NEGATIVE_START} />
                  <stop offset="100%" stopColor={COLORS.POSITIVE_END} />
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

      {/* Gráfico de Anillo para TIPO */}
      <Card className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-custom-silver/30">
        <CardHeader>
          <CardTitle>Distribución por Tipo</CardTitle>
          <CardDescription>Total de flujos directos vs. indirectos</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dataByType}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                nameKey="name"
              >
                {dataByType.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[entry.name as keyof typeof COLORS]}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráfico de Barras Verticales para NATURALEZA */}
      <Card className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-custom-silver/30">
        <CardHeader>
          <CardTitle>Distribución por Naturaleza</CardTitle>
          <CardDescription>Total de flujos tangibles vs. intangibles</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dataByNature}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => formatCurrency(value)} />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Legend />
              <Bar dataKey="value">
                {dataByNature.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[entry.name as keyof typeof COLORS]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráfico de Barras Horizontales para COMPORTAMIENTO */}
      <Card className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-custom-silver/30">
        <CardHeader>
          <CardTitle>Distribución por Comportamiento</CardTitle>
          <CardDescription>Total de flujos fijos vs. variables</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart layout="vertical" data={dataByBehavior}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tickFormatter={(value) => formatCurrency(value)} />
              <YAxis type="category" dataKey="name" width={80} />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Legend />
              <Bar dataKey="value">
                {dataByBehavior.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[entry.name as keyof typeof COLORS]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </>
  );
};
export default ChartsCards;
