"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Calendar, Percent } from "lucide-react";
import { Proyecto } from "@/lib/types";

interface ProjectCardProps {
  project: Proyecto;
  onDelete: (id: string) => void;
}

export function ProjectCard({ project, onDelete }: ProjectCardProps) {
  return (
    <Card className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-custom-silver/30 hover:border-custom-salmon/50 border-t-12 border-t-custom-violet hover:border-t-custom-purple group">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{project.nombre}</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              {project.descripcion || "No hay descripción disponible."}
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-red-500 hover:text-red-700 hover:bg-red-50  hover:cursor-pointer"
            onClick={() => onDelete(project.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {project.horizonteAnalisis} años
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Percent className="w-3 h-3" />
            {project.tasaDescuento}
          </Badge>
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/analysis/${project.id}`} className="w-full flex">
          <Button className=" bg-gradient-primary flex-1 py-6 font-semibold hover:shadow-lg transition-all duration-200 transform hover:scale-105 hover:cursor-pointer">
            Ver Análisis
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
