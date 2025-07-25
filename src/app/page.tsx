"use client";

import useSWR from "swr";
import { CreateProjectDialog } from "@/components/create-project-dialog";
import { ProjectCard } from "@/components/project-card";
import {
  getProyectos,
  crearProyecto,
  eliminarProyecto,
} from "@/lib/api-client";
import { CrearProyectoDto } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import PrivateRoute from "@/components/protected-routes/private-route";

export default function Home() {
  const {
    data: projects,
    error,
    isLoading,
    mutate,
  } = useSWR("projects", getProyectos);

  const handleCrearProyecto = async (projectData: CrearProyectoDto) => {
    try {
      await crearProyecto(projectData);
      mutate(); // Re-fetch the projects list
    } catch (error) {
      console.error("Failed to create project:", error);
      // Here you could show an error toast to the user
    }
  };

  const handleEliminarProyecto = async (id: string) => {
    try {
      await eliminarProyecto(id);
      mutate(); // Re-fetch the projects list
    } catch (error) {
      console.error("Failed to delete project:", error);
      // Here you could show an error toast to the user
    }
  };

  return (
    <PrivateRoute>
      <div className="min-h-screen">
        <div className="container mx-auto py-8 px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-custom-purple mb-2">
                Mis Análisis de Proyectos
              </h1>
              <p className="text-lg text-custom-violet">
                Gestiona y analiza la viabilidad financiera de tus proyectos de
                inversión
              </p>
            </div>
            <div className="flex items-center gap-4">
              <CreateProjectDialog onCrearProyecto={handleCrearProyecto} />
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">
              <h3 className="text-xl font-semibold">
                Error al cargar los proyectos
              </h3>
              <p>
                Por favor, asegúrate de que el backend esté funcionando y
                recarga la página.
              </p>
            </div>
          ) : projects?.length === 0 ? (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  No hay proyectos aún
                </h3>
                <p className="text-muted-foreground mb-6">
                  Comienza creando tu primer proyecto para realizar un análisis
                  de costo-beneficio.
                </p>
                <CreateProjectDialog onCrearProyecto={handleCrearProyecto} />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects?.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onDelete={handleEliminarProyecto}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </PrivateRoute>
  );
}
