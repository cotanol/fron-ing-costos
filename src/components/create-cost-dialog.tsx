"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { CrearCostoDto } from "@/lib/types";
import { COMPILER_INDEXES } from "next/dist/shared/lib/constants";

const createCostSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  descripcion: z.string().min(1, "La descripción es requerida"),
  tipo: z.enum(["FIJO", "VARIABLE"]),
  valoresAnuales: z.array(
    z.object({
      value: z.number().max(0, "Los valores no pueden ser positivos"),
    })
  ),
});

// Este tipo ahora refleja la estructura que usa el formulario
type CostFormData = z.infer<typeof createCostSchema>;

interface CreateCostDialogProps {
  onCrearCosto: (costo: CrearCostoDto) => void;
  horizonteAnalisis: number;
  proyectoId: string;
}

export function CreateCostDialog({
  onCrearCosto,
  horizonteAnalisis,
  proyectoId,
}: CreateCostDialogProps) {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    setValue,
  } = useForm<CostFormData>({
    resolver: zodResolver(createCostSchema),
    defaultValues: {
      nombre: "",
      descripcion: "",
      tipo: undefined,
      valoresAnuales: Array(horizonteAnalisis).fill({ value: 0 }),
    },
  });

  const { fields } = useFieldArray({
    control,
    name: "valoresAnuales",
  });

  const onSubmit = async (data: CostFormData) => {
    // Convertimos el array de objetos de vuelta a un array de números para que coincida con CrearCostoDto.
    const valoresNumericos = data.valoresAnuales.map((item) => item.value);

    const costoCompleto: CrearCostoDto = {
      ...data,
      valoresAnuales: valoresNumericos, // Usamos el array de números transformado
      proyectoId: proyectoId,
    };

    await onCrearCosto(costoCompleto);
    reset({
      nombre: "",
      descripcion: "",
      tipo: undefined,
      valoresAnuales: Array(horizonteAnalisis).fill({ value: 0 }),
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium text-sm hover:bg-red-50 px-3 py-2 rounded-lg transition-colors"
        >
          <Plus size={16} />
          Añadir Costo
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Añadir Nuevo Costo</DialogTitle>
          <DialogDescription>
            Complete los detalles del costo y sus valores anuales.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre del Costo</Label>
            <Input
              id="nombre"
              placeholder="Ej: Inversión inicial en equipos"
              {...register("nombre")}
            />
            {errors.nombre && (
              <p className="text-sm text-red-500">{errors.nombre.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              placeholder="Describe el concepto del costo..."
              rows={2}
              {...register("descripcion")}
            />
            {errors.descripcion && (
              <p className="text-sm text-red-500">
                {errors.descripcion.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo de Costo</Label>
            <Select
              onValueChange={(value) =>
                setValue("tipo", value as "FIJO" | "VARIABLE")
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona el tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FIJO">Costo Fijo</SelectItem>
                <SelectItem value="VARIABLE">Costo Variable</SelectItem>
              </SelectContent>
            </Select>
            {errors.tipo && (
              <p className="text-sm text-red-500">{errors.tipo.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Valores Anuales</Label>
            <div className="grid grid-cols-2 gap-3">
              {fields.map((field, index) => (
                <div key={field.id} className="space-y-1">
                  <Label htmlFor={`year-${index}`} className="text-sm">
                    Año {index}
                  </Label>
                  <Input
                    id={`year-${index}`}
                    type="number"
                    step="0.01"
                    placeholder="0"
                    {...register(`valoresAnuales.${index}.value` as const, {
                      valueAsNumber: true,
                    })}
                  />
                </div>
              ))}
            </div>
            {errors.valoresAnuales && (
              <p className="text-sm text-red-500">
                Verifique los valores anuales
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Añadir Costo
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
