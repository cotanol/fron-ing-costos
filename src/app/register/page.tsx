"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

// Componentes de UI
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Iconos
import { Loader2, Mail, Lock, User } from "lucide-react";

// API Client
import { registerUser } from "@/lib/api-client";
import PublicRoute from "@/components/protected-routes/public-route";

// Esquema de validación con Zod
const registerSchema = z.object({
  nombres: z
    .string()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres." }),
  apellidos: z
    .string()
    .min(2, { message: "El apellido debe tener al menos 2 caracteres." }),
  email: z.string().email({ message: "Por favor, ingresa un email válido." }),
  password: z
    .string()
    .min(6, { message: "La contraseña debe tener al menos 6 caracteres." }),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [apiError, setApiError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setApiError(null);
    try {
      await registerUser(data);
      // Opcional: mostrar un toast de éxito aquí
      router.push("/login");
    } catch (err: any) {
      setApiError(err.info?.message || "Ocurrió un error. Inténtalo de nuevo.");
    }
  };

  return (
    <PublicRoute>
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Image
                src="/logo_unfv.jpg"
                alt="Logo de la UNFV"
                width={400} // Ajusta el ancho según el tamaño de tu logo
                height={60} // Ajusta el alto según el tamaño de tu logo
                priority // Añade 'priority' si el logo es importante y debe cargar rápido
              />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">
              Crear una Cuenta
            </CardTitle>
            <CardDescription>Ingresa tus datos para comenzar</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Nombres */}
              <div className="space-y-2">
                <Label htmlFor="nombres">Nombres</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="nombres"
                    {...register("nombres")}
                    placeholder="Tus nombres"
                    className="pl-10"
                    disabled={isSubmitting}
                  />
                </div>
                {errors.nombres && (
                  <p className="text-sm font-medium text-destructive">
                    {errors.nombres.message}
                  </p>
                )}
              </div>

              {/* Apellidos */}
              <div className="space-y-2">
                <Label htmlFor="apellidos">Apellidos</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="apellidos"
                    {...register("apellidos")}
                    placeholder="Tus apellidos"
                    className="pl-10"
                    disabled={isSubmitting}
                  />
                </div>
                {errors.apellidos && (
                  <p className="text-sm font-medium text-destructive">
                    {errors.apellidos.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder="ejemplo@correo.com"
                    className="pl-10"
                    disabled={isSubmitting}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm font-medium text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Contraseña */}
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    {...register("password")}
                    placeholder="Mínimo 6 caracteres"
                    className="pl-10"
                    disabled={isSubmitting}
                  />
                </div>
                {errors.password && (
                  <p className="text-sm font-medium text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Error de API */}
              {apiError && (
                <p className="text-sm font-medium text-destructive">
                  {apiError}
                </p>
              )}

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creando cuenta...
                  </>
                ) : (
                  "Crear Cuenta"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                ¿Ya tienes una cuenta?{" "}
                <Link
                  href="/login"
                  className="text-primary hover:underline font-medium"
                >
                  Inicia sesión aquí
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </PublicRoute>
  );
}
