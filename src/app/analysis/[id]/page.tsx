import { AnalysisClient } from "@/components/analysis-client";
import { Metadata } from "next";

type PageProps = {
  params: { id: string };
};

export async function generateMetadata({
  params: _params,
}: PageProps): Promise<Metadata> {
  return {
    title: `Análisis del Proyecto | Analisis Financiero`,
    description: "Análisis financiero detallado de un proyecto.",
  };
}

export default function AnalysisPage({ params }: PageProps) {
  return <AnalysisClient projectId={params.id} />;
}
