"use client";

import { AnalysisClient } from "@/components/analysis-client";
import PrivateRoute from "@/components/protected-routes/private-route";
import { useParams } from "next/navigation";

export default function AnalysisPage() {
  const params = useParams();

  const projectId = Array.isArray(params.id) ? params.id[0] : params.id;

  if (!projectId) {
    return <div>Cargando proyecto...</div>;
  }

  return (
    <PrivateRoute>
      <AnalysisClient projectId={projectId} />
    </PrivateRoute>
  );
}
