import { Clock, DollarSign, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Analisis, Proyecto } from "@/lib/types";

interface KpisCardsProps {
  analysis: Analisis;
  project: Proyecto;
}

const KpisCards = ({ analysis, project }: KpisCardsProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "PEN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
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
  );
};

export default KpisCards;
