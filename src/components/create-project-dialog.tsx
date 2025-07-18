"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
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
import { Plus } from "lucide-react";
import { CrearProyectoDto } from "@/lib/types";

const createProjectSchema = z.object({
  nombre: z
    .string()
    .min(1, "El nombre es requerido")
    .max(100, "Máximo 100 caracteres"),
  descripcion: z
    .string()
    .min(1, "La descripción es requerida")
    .max(500, "Máximo 500 caracteres"),
  horizonteAnalisis: z
    .number()
    .min(1, "Mínimo 1 año")
    .max(20, "Máximo 20 años"),
  tasaDescuento: z.number().min(0, "Mínimo 0%").max(100, "Máximo 100%"),
});

interface CreateProjectDialogProps {
  onCrearProyecto: (proyecto: CrearProyectoDto) => void;
}

export function CreateProjectDialog({
  onCrearProyecto,
}: CreateProjectDialogProps) {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CrearProyectoDto>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      horizonteAnalisis: 5,
      tasaDescuento: 12,
    },
  });

  const onSubmit = async (data: CrearProyectoDto) => {
    await onCrearProyecto(data);
    reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-primary text-white px-6 py-3 rounded-xl font-semibold  transition-all duration-200 shadow-md hover:shadow-xl flex items-center gap-2 hover:scale-105 transform hover:cursor-pointer">
          <Plus className="w-4 h-4 mr-2" />
          Crear Nuevo Proyecto
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-custom-purple">
            Crear Nuevo Proyecto
          </DialogTitle>
          <DialogDescription className="text-custom-violet">
            Complete los detalles del proyecto para iniciar el análisis de
            costo-beneficio.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label
              className="block text-sm font-medium text-custom-purple mb-2"
              htmlFor="nombre"
            >
              Nombre del Proyecto
            </Label>
            <Input
              id="nombre"
              placeholder="Ej: Sistema de Automatización"
              {...register("nombre")}
            />
            {errors.nombre && (
              <p className="text-sm text-red-500">{errors.nombre.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              className="block text-sm font-medium text-custom-purple mb-2"
              htmlFor="descripcion"
            >
              Descripción
            </Label>
            <Textarea
              id="descripcion"
              placeholder="Describe brevemente el objetivo y alcance del proyecto..."
              rows={3}
              {...register("descripcion")}
            />
            {errors.descripcion && (
              <p className="text-sm text-red-500">
                {errors.descripcion.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                className="block text-sm font-medium text-custom-purple mb-2"
                htmlFor="horizonteAnalisis"
              >
                Horizonte de Análisis (años)
              </Label>
              <Input
                id="horizonteAnalisis"
                type="number"
                min="1"
                max="20"
                {...register("horizonteAnalisis", { valueAsNumber: true })}
              />
              {errors.horizonteAnalisis && (
                <p className="text-sm text-red-500">
                  {errors.horizonteAnalisis.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                className="block text-sm font-medium text-custom-purple mb-2"
                htmlFor="tasaDescuento"
              >
                Tasa de Descuento (%)
              </Label>
              <Input
                id="tasaDescuento"
                type="number"
                min="0"
                max="100"
                step="0.1"
                {...register("tasaDescuento", { valueAsNumber: true })}
              />
              {errors.tasaDescuento && (
                <p className="text-sm text-red-500">
                  {errors.tasaDescuento.message}
                </p>
              )}
            </div>
          </div>

          <DialogFooter className="pt-4">
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
              className="flex-1 px-6 py-3 bg-gradient-primary text-white rounded-xl hover:shadow-lg transition-all transform hover:scale-105 hover:cursor-pointer"
            >
              Crear Proyecto
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
