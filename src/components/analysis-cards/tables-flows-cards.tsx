import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CrearFlujoFinancieroDto, FlujoFinanciero, Proyecto } from "@/lib/types";
import { Trash2 } from "lucide-react";
import { CreateFlowDialog } from "../create-flow-dialog";

interface TablesFlowsCardsProps {
  project: Proyecto;
  ingresos: FlujoFinanciero[];
  egresos: FlujoFinanciero[];
  handleCrearFlujo: (flujo: CrearFlujoFinancieroDto) => void;
  handleEliminarFlujo: (flujoId: string) => void;
}

const TablesFlowsCards = ({
  project,
  ingresos,
  egresos,
  handleCrearFlujo,
  handleEliminarFlujo,
}: TablesFlowsCardsProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR", // You can change this to your desired currency
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };
  return (
    <>
      {/* Egresos Table */}

      <Card className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-custom-silver/30">
        <CardHeader className="flex justify-between items-center mb-4">
          <CardTitle className="text-xl font-bold text-custom-purple">
            Egresos del Proyecto
          </CardTitle>
          <CreateFlowDialog
            onCrearFlujo={handleCrearFlujo}
            horizonteAnalisis={project.horizonteAnalisis}
            proyectoId={project.id}
            tipoFlujo="EGRESO"
          />
        </CardHeader>

        <CardContent className="">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Comportamiento</TableHead>
                <TableHead>Total</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {egresos?.map((flujo) => (
                <TableRow key={flujo.id}>
                  <TableCell>{flujo.nombre}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        flujo.comportamiento === "FIJO"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {flujo.comportamiento}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {formatCurrency(
                      flujo.valoresAnuales.reduce(
                        (sum, value) => sum + value,
                        0
                      )
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEliminarFlujo(flujo.id)}
                      className=" hover:cursor-pointer"
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

      {/* Ingresos Table */}

      <Card className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-custom-silver/30">
        <CardHeader className="flex justify-between items-center mb-4">
          <CardTitle className="text-xl font-bold text-custom-purple">
            Ingresos del Proyecto
          </CardTitle>
          <CreateFlowDialog
            onCrearFlujo={handleCrearFlujo}
            horizonteAnalisis={project.horizonteAnalisis}
            proyectoId={project.id}
            tipoFlujo="INGRESO"
          />
        </CardHeader>
        <CardContent className="">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Naturaleza</TableHead>
                <TableHead>Total</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ingresos?.map((flujo) => (
                <TableRow key={flujo.id}>
                  <TableCell>{flujo.nombre}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        flujo.naturaleza === "TANGIBLE"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {flujo.naturaleza}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {formatCurrency(
                      flujo.valoresAnuales.reduce(
                        (sum, value) => sum + value,
                        0
                      )
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEliminarFlujo(flujo.id)}
                      className=" hover:cursor-pointer"
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
    </>
  );
};

export default TablesFlowsCards;
