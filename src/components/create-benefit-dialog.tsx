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
import { CrearBeneficioDto } from "@/lib/types";

const createBenefitSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  descripcion: z.string().min(1, "La descripción es requerida"),
  tipo: z.enum(["TANGIBLE", "INTANGIBLE"]),
  valoresAnuales: z.array(
    z.object({
      value: z.number().min(0, "Los valores deben ser positivos"),
    })
  ),
});

type BenefitFormData = z.infer<typeof createBenefitSchema>;

interface CreateBenefitDialogProps {
  onCrearBeneficio: (beneficio: CrearBeneficioDto) => void;
  horizonteAnalisis: number;
  proyectoId: string;
}

export function CreateBenefitDialog({
  onCrearBeneficio,
  horizonteAnalisis,
  proyectoId,
}: CreateBenefitDialogProps) {
  const [open, setOpen] = useState(false);

  // const defaultFormValues = {
  //   nombre: "",
  //   descripcion: "",
  //   tipo: undefined as "TANGIBLE" | "INTANGIBLE" | undefined,
  //   valoresAnuales: Array(horizonteAnalisis).fill(0),
  // };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    setValue,
  } = useForm<BenefitFormData>({
    resolver: zodResolver(createBenefitSchema),
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

  const onSubmit = async (data: BenefitFormData) => {
    const valoresAnuales = data.valoresAnuales.map((item) => item.value);

    const beneficioCompleto: CrearBeneficioDto = {
      ...data,
      valoresAnuales: valoresAnuales, // Usamos el array de números transformado
      proyectoId: proyectoId,
    };

    await onCrearBeneficio(beneficioCompleto);
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
          className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium text-sm hover:bg-red-50 px-3 py-2 rounded-lg transition-colors hover:cursor-pointer"
        >
          <Plus size={16} />
          Añadir Beneficio
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-custom-purple">
            Añadir Nuevo Beneficio
          </DialogTitle>
          <DialogDescription className="text-custom-violet">
            Complete los detalles del beneficio y sus valores anuales.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-custom-purple" htmlFor="nombre">
              Nombre del Beneficio
            </Label>
            <Input
              id="nombre"
              placeholder="Ej: Ahorro en costos operativos"
              {...register("nombre")}
            />
            {errors.nombre && (
              <p className="text-sm text-red-500">{errors.nombre.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-custom-purple" htmlFor="descripcion">
              Descripción
            </Label>
            <Textarea
              id="descripcion"
              placeholder="Describe el beneficio esperado..."
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
            <Label className="text-custom-purple" htmlFor="tipo">
              Tipo de Beneficio
            </Label>
            <Select
              onValueChange={(value) =>
                setValue("tipo", value as "TANGIBLE" | "INTANGIBLE")
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona el tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TANGIBLE">Beneficio Tangible</SelectItem>
                <SelectItem value="INTANGIBLE">Beneficio Intangible</SelectItem>
              </SelectContent>
            </Select>
            {errors.tipo && (
              <p className="text-sm text-red-500">{errors.tipo.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-custom-purple">Valores Anuales</Label>
            <div className="grid grid-cols-2 gap-3">
              {fields.map((field, index) => (
                <div key={field.id} className="space-y-1">
                  <Label
                    className="text-custom-purple text-sm"
                    htmlFor={`year-${index}`}
                  >
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
              className="flex-1 px-6 py-3 border border-custom-silver/30 text-custom-violet rounded-xl hover:bg-custom-silver/20 transition-all hover:cursor-pointer"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 px-6 py-3 text-white rounded-xl hover:shadow-lg transition-all transform hover:scale-105  bg-gradient-secondary  hover:cursor-pointer"
            >
              Añadir Beneficio
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
