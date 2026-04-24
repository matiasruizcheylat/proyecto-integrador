import { useEffect, useState } from "react";
import ReporteCards from "../components/reportes/ReporteCards";
import ReporteChart from "../components/reportes/ReporteChart";

import  { getResumen, getPorArea, getPorPuesto, getAntiguedad} from "../services/reportes.service";
import type { ReporteResumen, ReporteArea, ReportePuesto, ReporteAntiguedad } from "../types/reportes";
import DashboardLayout from "../layouts/DashboardLayout";

import "../styles/Home.css";

export default function ReportesPage() {
  const [resumen, setResumen] = useState<ReporteResumen | null>(null);
  const [areas, setAreas] = useState<ReporteArea[]>([]);
   const [puestos, setPuestos] = useState<ReportePuesto[]>([]);
  const [antiguedad, setAntiguedad] = useState<ReporteAntiguedad | null>(null);

  useEffect(() => {
    getResumen().then(setResumen);
    getPorArea().then(setAreas);
    getPorPuesto().then(setPuestos);
    getAntiguedad().then(setAntiguedad);
  }, []);

  if (!resumen) return <p>Cargando reportes...</p>;


    function formatearAniosMeses(valor: number): string {
    let anios = Math.floor(valor);
    let meses = Math.round((valor - anios) * 12);

    // ajuste por redondeo
    if (meses === 12) {
      meses = 0;
      anios += 1;
    }

    if (meses === 0) return `${anios} años`;
    if (anios === 0) return `${meses} meses`;

    return `${anios} años y ${meses} meses`;
  }

  return (
    <DashboardLayout>
    
      <ReporteCards
        title="Resumen General"
        items={[
          { label: "Total", value: resumen.total },
          { label: "Activos", value: resumen.activos, type: "success" },
          { label: "Inactivos", value: resumen.inactivos, type: "danger" },
          { label: "Eliminados", value: resumen.eliminados, type: "danger" }
        ]}
      />
      <div className="antiguedad-card">
         <span className="antiguedad-label">
        Promedio de Antigüedad (Activos)
      </span>

      <h3 className="antiguedad-valor">
        {formatearAniosMeses(antiguedad?.promedio ?? 0)}
      </h3>
    </div>

  <ReporteChart
  title="Empleados por Área"
  data={areas}
  dataKey="activos"
  nameKey="area"
  />

  <ReporteChart
    title="Empleados por Puesto"
    data={puestos}
    dataKey="activos"
    nameKey="puesto"
  />

    

  

    
    </DashboardLayout>
  );
}