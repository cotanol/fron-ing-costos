"use client";

import React from "react";
import Link from "next/link";
import { BarChart3, User, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

const Header: React.FC = () => {
  const { status, user, logout } = useAuth();

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-custom-silver/30 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3">
              <div className="bg-gradient-primary p-2 rounded-xl">
                <BarChart3 className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-custom-purple">
                  Analizador de Proyectos
                </h1>
                <p className="text-xs text-custom-violet">
                  Análisis Inteligente
                </p>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {status === "authenticated" && user ? (
              <>
                <div className="flex items-center gap-2 bg-custom-dogwood/30 px-3 py-2 rounded-xl">
                  <div className="bg-gradient-primary p-1 rounded-lg">
                    <User className="text-white" size={16} />
                  </div>
                  <span className="text-custom-purple font-medium text-sm">
                    {user.nombres}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="p-2 text-custom-violet hover:text-red-500 hover:bg-red-100 rounded-lg transition-all"
                  title="Cerrar Sesión"
                >
                  <LogOut size={20} />
                </button>
              </>
            ) : (
              <>
                <Link href="/login" passHref>
                  <Button variant="ghost">Iniciar Sesión</Button>
                </Link>
                <Link href="/register" passHref>
                  <Button className="bg-gradient-primary text-white">
                    Registrarse
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
