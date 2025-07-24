"use client";

import { useState, FormEvent } from "react";
import { useAuth } from "@/context/AuthContext"; // Ajusta la ruta

import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/api-client";

const LoginPage = () => {
  const { login } = useAuth();
  const router = useRouter();

  // Estados para el formulario
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Manejar el envío del formulario
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const data = await loginUser(email, password);
      login(data.user, data.token);
      router.push("/");
    } catch (err: any) {
      setError(err.info?.message || "Credenciales incorrectas.");
    }
  };

  return (
    <div>
      <h1>Página de Login</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="email">Email</label>
          <br />
          <input
            id="email"
            type="email"
            value={email}
            placeholder="Ingresa tu email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <br />
        <div>
          <label htmlFor="password">Contraseña</label>
          <br />
          <input
            id="password"
            type="password"
            value={password}
            placeholder="Ingresa tu contraseña"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <br />

        {/* Muestra el mensaje de error si existe */}
        {error && <p>{error}</p>}

        <button type="submit">Iniciar Sesión</button>
      </form>
    </div>
  );
};

export default LoginPage;
