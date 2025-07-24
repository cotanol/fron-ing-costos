"use client";

import React from "react";
import { BarChart3, User, Settings, Bell } from "lucide-react";
import { useAuth } from "@/context/AuthProvider";
import { useRouter } from "next/navigation";

const Header: React.FC = () => {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-custom-silver/30 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo y Título */}
          <div className="flex items-center gap-3">
            <div className="bg-gradient-primary p-2 rounded-xl">
              <BarChart3 className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-custom-purple">
                Analizador de Proyectos
              </h1>
              <p className="text-xs text-custom-violet">Análisis Inteligente</p>
            </div>
          </div>

          {/* Navegación Central */}
          {/* <nav className="hidden md:flex items-center gap-8">
            <a
              href="#"
              className="text-custom-violet hover:text-custom-purple font-medium transition-colors"
            >
              Dashboard
            </a>
            <a
              href="#"
              className="text-custom-violet hover:text-custom-purple font-medium transition-colors"
            >
              Proyectos
            </a>
            <a
              href="#"
              className="text-custom-violet hover:text-custom-purple font-medium transition-colors"
            >
              Reportes
            </a>
            <a
              href="#"
              className="text-custom-violet hover:text-custom-purple font-medium transition-colors"
            >
              Configuración
            </a>
          </nav> */}

          {/* Acciones del Usuario */}
          <div className="flex items-center gap-3">
            <button className="p-2 text-custom-violet hover:text-custom-purple hover:bg-custom-dogwood/30 rounded-lg transition-all">
              <Bell size={20} />
            </button>
            <button
              onClick={handleLogout}
              className="p-2 text-custom-violet hover:text-custom-purple hover:bg-custom-dogwood/30 rounded-lg transition-all"
            >
              <Settings size={20} />
            </button>
            <div className="flex items-center gap-2 bg-custom-dogwood/30 px-3 py-2 rounded-xl">
              <div className="bg-gradient-primary p-1 rounded-lg">
                <User className="text-white" size={16} />
              </div>
              <span className="text-custom-purple font-medium text-sm">
                Usuario
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
