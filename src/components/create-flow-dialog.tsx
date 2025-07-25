"use client";

import { useState, useEffect } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Loader2 } from "lucide-react";
import {
  CrearFlujoFinancieroDto,
  CategoriaFlujo,
  ItemFlujoBase,
} from "@/lib/types";
import { getCategoriasFlujo, getItemsFlujoBase } from "@/lib/api-client";

const createFlowSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  descripcion: z.string().optional(),
  tipoFlujo: z.enum(["INGRESO", "EGRESO"]),
  comportamiento: z.enum(["FIJO", "VARIABLE"]),
  tipo: z.enum(["DIRECTO", "INDIRECTO"]),
  naturaleza: z.enum(["TANGIBLE", "INTANGIBLE"]),
  valoresAnuales: z.array(
    z.object({
      value: z.number(),
    })
  ),
  categoriaId: z.string().min(1, "La categoría es requerida"),
  itemFlujoBaseId: z.string().min(1, "El ítem base es requerido"),
});

type FlowFormData = z.infer<typeof createFlowSchema>;

interface CreateFlowDialogProps {
  onCrearFlujo: (flujo: CrearFlujoFinancieroDto) => void;
  horizonteAnalisis: number;
  proyectoId: string;
  tipoFlujo: "INGRESO" | "EGRESO";
}

export function CreateFlowDialog({
  onCrearFlujo,
  horizonteAnalisis,
  proyectoId,
  tipoFlujo,
}: CreateFlowDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ItemFlujoBase | null>(null);

  const [categorias, setCategorias] = useState<CategoriaFlujo[]>([]);
  const [items, setItems] = useState<ItemFlujoBase[]>([]);
  const [selectedCategoria, setSelectedCategoria] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItemInfo, setSelectedItemInfo] = useState<{
    itemId: string;
  } | null>(null);

  const form = useForm<FlowFormData>({
    resolver: zodResolver(createFlowSchema),
    defaultValues: {
      nombre: "",
      descripcion: "",
      tipoFlujo: tipoFlujo,
      valoresAnuales: Array(horizonteAnalisis).fill({ value: 0 }),
      categoriaId: "",
      itemFlujoBaseId: "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    setValue,
  } = form;

  const { fields } = useFieldArray({
    control,
    name: "valoresAnuales",
  });

  useEffect(() => {
    if (open) {
      const fetchCategorias = async () => {
        setIsLoading(true);
        try {
          const data = await getCategoriasFlujo();
          setCategorias(data);
        } catch (error) {
          console.error("Error al cargar categorías:", error);
        }
        setIsLoading(false);
      };
      fetchCategorias();
    }
  }, [open]);

  useEffect(() => {
    if (selectedCategoria) {
      const fetchItems = async () => {
        setIsLoading(true);
        try {
          const data = await getItemsFlujoBase(selectedCategoria);
          setItems(data);
        } catch (error) {
          console.error("Error al cargar ítems de la biblioteca:", error);
        }
        setIsLoading(false);
      };
      fetchItems();
    }
  }, [selectedCategoria]);

  const handleSelectItem = (item: ItemFlujoBase) => {
    setSelectedItem(item);
    const newValoresAnuales = Array(horizonteAnalisis).fill({ value: 0 });
    if (horizonteAnalisis > 0) {
      newValoresAnuales[0] = { value: item.montoSugerido };
    }

    reset({
      nombre: item.nombre,
      descripcion: item.descripcion || "",
      tipoFlujo: item.tipoFlujo,
      comportamiento: item.comportamiento,
      tipo: item.tipo,
      naturaleza: item.naturaleza,
      valoresAnuales: newValoresAnuales,
      categoriaId: selectedCategoria,
      itemFlujoBaseId: item.id,
    });
  };

  const onSubmit = async (data: FlowFormData) => {
    console.log("Datos del formulario al enviar:", data);

    const valoresNumericos = data.valoresAnuales.map((item) => item.value);

    const flujoCompleto: CrearFlujoFinancieroDto = {
      ...data,
      valoresAnuales: valoresNumericos,
      proyectoId: proyectoId,
    };

    onCrearFlujo(flujoCompleto);

    reset({
      nombre: "",
      descripcion: "",
      tipoFlujo: tipoFlujo,
      valoresAnuales: Array(horizonteAnalisis).fill({ value: 0 }),
      categoriaId: "",
      itemFlujoBaseId: "",
    });
    setSelectedItem(null);
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
          Añadir {tipoFlujo === "INGRESO" ? "Ingreso" : "Egreso"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-custom-purple">
            Añadir Nuevo {tipoFlujo === "INGRESO" ? "Ingreso" : "Egreso"}
          </DialogTitle>
          <DialogDescription className="text-custom-violet">
            Selecciona un item de la biblioteca o créalo manualmente.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="text-custom-purple" htmlFor="categoria">
              Categoría de Flujo
            </Label>
            <Select
              value={form.watch("categoriaId")}
              onValueChange={(value) => {
                setSelectedCategoria(value);
                setValue("categoriaId", value, { shouldValidate: true });
              }}
            >
              <SelectTrigger id="categoria">
                <SelectValue placeholder="Selecciona una categoría..." />
              </SelectTrigger>
              <SelectContent>
                {categorias.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.categoriaId && (
              <p className="text-sm text-red-500">
                {errors.categoriaId.message}
              </p>
            )}
          </div>
          <div className="space-y-2 rounded-lg border p-3 min-h-[200px]">
            <h4 className="font-medium text-custom-purple">
              Ítems Disponibles
            </h4>
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-custom-purple" />
              </div>
            ) : items.length > 0 ? (
              <ul className="space-y-2">
                {items.map((item) => (
                  <li
                    key={item.id}
                    className={`flex justify-between items-center p-2 rounded-md hover:bg-gray-100 cursor-pointer ${
                      selectedItem?.id === item.id ? "bg-gray-200" : ""
                    }`}
                    onClick={() => handleSelectItem(item)}
                  >
                    <div>
                      <p className="font-semibold">{item.nombre}</p>
                      <p className="text-sm text-gray-500">
                        Sugerido: ${item.montoSugerido.toLocaleString()}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-center text-gray-500 py-8">
                {selectedCategoria
                  ? "No hay ítems en esta categoría."
                  : "Selecciona una categoría para ver los ítems."}
              </p>
            )}
          </div>
        </div>

        {selectedItem && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-custom-purple" htmlFor="nombre">
                Nombre del Flujo
              </Label>
              <Input
                id="nombre"
                placeholder="Ej: Ingreso por ventas"
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
                placeholder="Describe el flujo..."
                rows={2}
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
                <Label className="text-custom-purple" htmlFor="tipoFlujo">
                  Tipo de Flujo
                </Label>
                <Select
                  value={form.watch("tipoFlujo")}
                  onValueChange={(value) =>
                    setValue("tipoFlujo", value as "INGRESO" | "EGRESO")
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INGRESO">Ingreso</SelectItem>
                    <SelectItem value="EGRESO">Egreso</SelectItem>
                  </SelectContent>
                </Select>
                {errors.tipoFlujo && (
                  <p className="text-sm text-red-500">
                    {errors.tipoFlujo.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-custom-purple" htmlFor="comportamiento">
                  Comportamiento
                </Label>
                <Select
                  value={form.watch("comportamiento")}
                  onValueChange={(value) =>
                    setValue("comportamiento", value as "FIJO" | "VARIABLE")
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el comportamiento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FIJO">Fijo</SelectItem>
                    <SelectItem value="VARIABLE">Variable</SelectItem>
                  </SelectContent>
                </Select>
                {errors.comportamiento && (
                  <p className="text-sm text-red-500">
                    {errors.comportamiento.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-custom-purple" htmlFor="tipo">
                  Tipo
                </Label>
                <Select
                  value={form.watch("tipo")}
                  onValueChange={(value) =>
                    setValue("tipo", value as "DIRECTO" | "INDIRECTO")
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DIRECTO">Directo</SelectItem>
                    <SelectItem value="INDIRECTO">Indirecto</SelectItem>
                  </SelectContent>
                </Select>
                {errors.tipo && (
                  <p className="text-sm text-red-500">{errors.tipo.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-custom-purple" htmlFor="naturaleza">
                  Naturaleza
                </Label>
                <Select
                  value={form.watch("naturaleza")}
                  onValueChange={(value) =>
                    setValue("naturaleza", value as "TANGIBLE" | "INTANGIBLE")
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona la naturaleza" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TANGIBLE">Tangible</SelectItem>
                    <SelectItem value="INTANGIBLE">Intangible</SelectItem>
                  </SelectContent>
                </Select>
                {errors.naturaleza && (
                  <p className="text-sm text-red-500">
                    {errors.naturaleza.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-custom-purple">Valores Anuales</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
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
                className="flex-1 px-6 py-3 text-white rounded-xl hover:shadow-lg transition-all transform hover:scale-105  bg-gradient-secondary hover:cursor-pointer"
              >
                Añadir Flujo
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
