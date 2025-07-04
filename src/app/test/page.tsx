import { getProyectos, getCostos, getBeneficios } from "@/lib/api-client";

export default async function TestPage() {
  const proyectos = await getProyectos();
  const costos = await getCostos();
  const beneficios = await getBeneficios();

  console.log(proyectos);
  console.log(costos);
  console.log(beneficios);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-4xl font-bold text-foreground mb-4">Proyectos</h1>
        <ul>
          {proyectos.map((proyecto) => (
            <li key={proyecto.id} className="mb-2">
              {proyecto.nombre} - {proyecto.descripcion}
            </li>
          ))}
        </ul>
      </div>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-4xl font-bold text-foreground mb-4">Costos</h1>
        <ul>
          {costos.map((costo) => (
            <li key={costo.id} className="mb-2">
              {costo.nombre} - {costo.descripcion}
            </li>
          ))}
        </ul>
      </div>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-4xl font-bold text-foreground mb-4">Beneficios</h1>
        <ul>
          {beneficios.map((beneficio) => (
            <li key={beneficio.id} className="mb-2">
              {beneficio.nombre} - {beneficio.descripcion}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
