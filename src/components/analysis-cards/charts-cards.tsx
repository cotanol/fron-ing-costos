import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
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
    <>
      <Card className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-custom-silver/30">
        <CardHeader>
          <CardTitle>Flujo de Caja Neto Anual</CardTitle>
          <CardDescription>Ingresos menos egresos por año</CardDescription>
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
                  <stop offset="0%" stopColor="#444054" /> {/* custom-violet */}
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
  );
};
export default ChartsCards;
