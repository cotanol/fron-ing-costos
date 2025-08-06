"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/context/AuthContext";

import Link from "next/link";
import { loginUser } from "@/lib/api-client";
import Image from "next/image";

// Componentes de UI
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, Lock } from "lucide-react";
import PublicRoute from "@/components/protected-routes/public-route";

type ApiError = {
  info?: {
    message: string;
  };
};

const loginSchema = z.object({
  email: z.string().email({ message: "Por favor, ingresa un email válido." }),
  password: z
    .string()
    .min(1, { message: "La contraseña no puede estar vacía." }),
});

//  Crear el tipo de dato del formulario a partir del schema
type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const { login } = useAuth();

  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setApiError(null);
    try {
      const response = await loginUser(data.email, data.password);
      login(response.user, response.token);
      window.location.href = "/";
    } catch (err: unknown) {
      const error = err as ApiError;
      setApiError(error.info?.message || "Email o contraseña incorrectos.");
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
                width={400}
                height={60}
                priority
              />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">
              Iniciar Sesión
            </CardTitle>
            <CardDescription>
              Ingresa tus credenciales para acceder al sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Campo de Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="ejemplo@correo.com"
                    className="pl-10"
                    {...register("email")} // Se registra el campo
                    disabled={isSubmitting}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm font-medium text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Campo de Contraseña */}
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Ingresa tu contraseña"
                    className="pl-10"
                    {...register("password")} // Se registra el campo
                    disabled={isSubmitting}
                  />
                </div>
                {errors.password && (
                  <p className="text-sm font-medium text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Mensaje de Error de API */}
              {apiError && (
                <p className="text-sm font-medium text-destructive">
                  {apiError}
                </p>
              )}

              {/* Botón de Submit */}
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Iniciando sesión...
                  </>
                ) : (
                  "Iniciar Sesión"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                ¿No tienes una cuenta?{" "}
                <Link
                  href="/register"
                  className="text-primary hover:underline font-medium"
                >
                  Regístrate aquí
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </PublicRoute>
  );
};

export default LoginPage;
