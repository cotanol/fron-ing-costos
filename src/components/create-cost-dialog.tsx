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
import { Plus, Library, Loader2 } from "lucide-react";
import {
  CrearCostoDto,
  CategoriaCosto,
  ItemCostoBase,
  TipoCosto,
} from "@/lib/types";
import { getCategoriasCosto, getItemsCostoBase } from "@/lib/api-client";

// Corregido: Los costos deben ser números positivos o cero.
const createCostSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  descripcion: z.string().min(1, "La descripción es requerida"),
  tipo: z.enum(["FIJO", "VARIABLE"]),
  valoresAnuales: z.array(
    z.object({
      value: z.number().max(0, "El valor no puede ser negativo"),
    })
  ),
});

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
  const [viewMode, setViewMode] = useState("biblioteca");

  // Estado para la biblioteca
  const [categorias, setCategorias] = useState<CategoriaCosto[]>([]);
  const [items, setItems] = useState<ItemCostoBase[]>([]);
  const [selectedCategoria, setSelectedCategoria] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CostFormData>({
    resolver: zodResolver(createCostSchema),
    defaultValues: {
      nombre: "",
      descripcion: "",
      tipo: undefined,
      valoresAnuales: Array(horizonteAnalisis).fill({ value: 0 }),
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

  // Cargar categorías cuando se abre el diálogo
  useEffect(() => {
    if (open) {
      const fetchCategorias = async () => {
        setIsLoading(true);
        try {
          const data = await getCategoriasCosto();
          setCategorias(data);
        } catch (error) {
          console.error("Error al cargar categorías:", error);
        }
        setIsLoading(false);
      };
      fetchCategorias();
    }
  }, [open]);

  // Cargar ítems cuando se selecciona una categoría
  useEffect(() => {
    if (selectedCategoria) {
      const fetchItems = async () => {
        setIsLoading(true);
        try {
          const data = await getItemsCostoBase(selectedCategoria);
          setItems(data);
        } catch (error) {
          console.error("Error al cargar ítems de la biblioteca:", error);
        }
        setIsLoading(false);
      };
      fetchItems();
    }
  }, [selectedCategoria]);

  const handleSelectFromLibrary = (item: ItemCostoBase) => {
    const newValoresAnuales = Array(horizonteAnalisis).fill({ value: 0 });
    // Asumimos que el monto sugerido aplica al primer año (Año 0)
    if (horizonteAnalisis > 0) {
      newValoresAnuales[0] = { value: -item.montoSugerido };
    }

    reset({
      nombre: item.nombre,
      descripcion: item.descripcion || "",
      tipo: item.tipo,
      valoresAnuales: newValoresAnuales,
    });
    setViewMode("personalizado");
  };

  const onSubmit = async (data: CostFormData) => {
    const valoresNumericos = data.valoresAnuales.map((item) => item.value);
    const costoCompleto: CrearCostoDto = {
      ...data,
      valoresAnuales: valoresNumericos,
      proyectoId: proyectoId,
    };

    onCrearCosto(costoCompleto);
    reset({
      nombre: "",
      descripcion: "",
      tipo: undefined,
      valoresAnuales: Array(horizonteAnalisis).fill({ value: 0 }),
    });
    setOpen(false);
    setViewMode("biblioteca"); // Reset view for next time
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium text-sm hover:bg-red-50 px-3 py-2 rounded-lg transition-colors hover:cursor-pointer"
        >
          <Plus size={16} />
          Añadir Costo
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-custom-purple">
            Añadir Nuevo Costo
          </DialogTitle>
          <DialogDescription className="text-custom-violet">
            Selecciona un costo de la biblioteca o créalo manualmente.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={viewMode} onValueChange={setViewMode} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="biblioteca">Desde Biblioteca</TabsTrigger>
            <TabsTrigger value="personalizado">Personalizado</TabsTrigger>
          </TabsList>

          {/* Pestaña de Biblioteca */}
          <TabsContent value="biblioteca" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-custom-purple" htmlFor="categoria">
                Categoría de Costo
              </Label>
              <Select onValueChange={setSelectedCategoria}>
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
                      className="flex justify-between items-center p-2 rounded-md hover:bg-gray-100"
                    >
                      <div>
                        <p className="font-semibold">{item.nombre}</p>
                        <p className="text-sm text-gray-500">
                          Sugerido: ${item.montoSugerido.toLocaleString()}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleSelectFromLibrary(item)}
                      >
                        Seleccionar
                      </Button>
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
          </TabsContent>

          {/* Pestaña de Formulario Personalizado */}
          <TabsContent value="personalizado">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label className="text-custom-purple" htmlFor="nombre">
                  Nombre del Costo
                </Label>
                <Input
                  id="nombre"
                  placeholder="Ej: Inversión inicial en equipos"
                  {...register("nombre")}
                />
                {errors.nombre && (
                  <p className="text-sm text-red-500">
                    {errors.nombre.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-custom-purple" htmlFor="descripcion">
                  Descripción
                </Label>
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
                <Label className="text-custom-purple" htmlFor="tipo">
                  Tipo de Costo
                </Label>
                <Select
                  value={form.watch("tipo")}
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
                  Añadir Costo
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
