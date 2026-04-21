import type { ReporteResumen, ReporteArea, ReportePuesto , ReporteAntiguedad } from "../types/reportes";
import { api } from "../api/client";

export async function getResumen(): Promise<ReporteResumen> {
  const res =await api.get("/resumen/activos");
  return res.data;
}

export async function getPorArea (): Promise<ReporteArea[]> {
   const res =await api.get("/resumen/activosPorArea");
  return res.data;
}

export async function getPorPuesto (): Promise<ReportePuesto[]> {
   const res =await api.get("/resumen/activosPorPuesto");
  return res.data;
}

export async function getAntiguedad (): Promise<ReporteAntiguedad[]> {
   const res =await api.get("/resumen/antiguedad");
  return res.data;
}