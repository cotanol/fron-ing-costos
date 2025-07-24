'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { registerUser } from '@/lib/api-client';
import { useRouter } from 'next/navigation';

const registerSchema = z.object({
  nombres: z.string().min(1, 'El nombre es requerido'),
  apellidos: z.string().min(1, 'El apellido es requerido'),
  email: z.string().email('El email no es válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser(data);
      router.push('/login');
    } catch (err: any) {
      setError(err.info?.message || 'Error al registrarse');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">Crear Cuenta</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="nombres">Nombres</Label>
            <Input id="nombres" {...register('nombres')} />
            {errors.nombres && <p className="text-sm text-red-500">{errors.nombres.message}</p>}
          </div>
          <div>
            <Label htmlFor="apellidos">Apellidos</Label>
            <Input id="apellidos" {...register('apellidos')} />
            {errors.apellidos && <p className="text-sm text-red-500">{errors.apellidos.message}</p>}
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register('email')} />
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          </div>
          <div>
            <Label htmlFor="password">Contraseña</Label>
            <Input id="password" type="password" {...register('password')} />
            {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" className="w-full">Crear Cuenta</Button>
        </form>
      </div>
    </div>
  );
}
