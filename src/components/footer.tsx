import React from "react";
import { BarChart3, Github, Twitter, Linkedin, Mail } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-primary text-white mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo y Descripción */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white/20 p-2 rounded-xl">
                <BarChart3 size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold">Analizador de Proyectos</h3>
                <p className="text-custom-dogwood text-sm">
                  Análisis Inteligente
                </p>
              </div>
            </div>
            <p className="text-custom-dogwood leading-relaxed mb-6">
              Herramienta profesional para el análisis de viabilidad financiera
              de proyectos de inversión. Calcula VAN, TIR y períodos de
              recuperación con precisión y elegancia.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="bg-white/20 p-2 rounded-lg hover:bg-white/30 transition-colors"
              >
                <Github size={20} />
              </a>
              <a
                href="#"
                className="bg-white/20 p-2 rounded-lg hover:bg-white/30 transition-colors"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="bg-white/20 p-2 rounded-lg hover:bg-white/30 transition-colors"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="#"
                className="bg-white/20 p-2 rounded-lg hover:bg-white/30 transition-colors"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Enlaces Rápidos */}
          <div>
            <h4 className="font-semibold mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2 text-custom-dogwood">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Crear Proyecto
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Reportes
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Configuración
                </a>
              </li>
            </ul>
          </div>

          {/* Soporte */}
          <div>
            <h4 className="font-semibold mb-4">Soporte</h4>
            <ul className="space-y-2 text-custom-dogwood">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Documentación
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Tutoriales
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Contacto
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-custom-dogwood text-sm">
            © 2025 Equipo 5 - Todos los derechos reservados.
          </p>
          <p className="text-custom-dogwood text-sm">
            Villafuerte el mejor profe :D
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a
              href="#"
              className="text-custom-dogwood hover:text-white text-sm transition-colors"
            >
              Zamora Rodriguez Enzo
            </a>
            <a
              href="#"
              className="text-custom-dogwood hover:text-white text-sm transition-colors"
            >
              Salcedo Morales Francisco Jose
            </a>
            <a
              href="#"
              className="text-custom-dogwood hover:text-white text-sm transition-colors"
            >
              Rivera Tuesta Alvaro Daniel
            </a>
            <a
              href="#"
              className="text-custom-dogwood hover:text-white text-sm transition-colors"
            >
              Muñoz Guillen Heidy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
