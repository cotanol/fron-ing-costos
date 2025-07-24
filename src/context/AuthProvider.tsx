"use client";

import { checkAuthStatus } from "@/lib/api-client";
import {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
// MODIFICADO: Importamos la función específica que necesitamos

// ... (Las definiciones de User, AuthStatus, AuthState, AuthContextType no cambian) ...

interface User {
  id: string;
  nombres: string;
  apellidos: string;
  isActive: boolean;
  email: string;
  roles: string[];
}
type AuthStatus = "checking" | "authenticated" | "not-authenticated";
interface AuthState {
  status: AuthStatus;
  user: User | null;
}
interface AuthContextType extends AuthState {
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  status: "checking",
  user: null,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authState, setAuthState] = useState<AuthState>({
    status: "checking",
    user: null,
  });

  useEffect(() => {
    checkAuthToken();
  }, []);

  const checkAuthToken = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      return setAuthState({ status: "not-authenticated", user: null });
    }

    try {
      // MODIFICADO: Usamos la nueva función en lugar de apiClient.get
      const data = await checkAuthStatus();

      localStorage.setItem("token", data.token);
      setAuthState({ status: "authenticated", user: data.user });
    } catch (error) {
      localStorage.removeItem("token");
      setAuthState({ status: "not-authenticated", user: null });
    }
  };

  const login = (user: User, token: string) => {
    localStorage.setItem("token", token);
    setAuthState({ status: "authenticated", user });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setAuthState({ status: "not-authenticated", user: null });
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
