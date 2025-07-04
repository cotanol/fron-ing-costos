import { AnalysisClient } from "@/components/analysis-client";
import { getProyectoPorId } from "@/lib/api-client";

type Params = Promise<{ id: string }>;

export default async function AnalysisPage({ params }: { params: Params }) {
  const { id } = await params;
  const projectId = id;

  const proyecto = await getProyectoPorId(projectId);

  return <AnalysisClient proyecto={proyecto} />;
}
