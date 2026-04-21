import "./ReporteGrid.css";
import type { ReporteArea } from "../../types/reportes";

interface Props {
  title: string;
  data: ReporteArea[];
}

export default function ReporteGrid({ title, data }: Props) {
  return (
    <div className="grid-container">
      <h2 className="grid-title">{title}</h2>

      <div className="grid">
        {data.map((item, index) => (
          <div key={index} className="grid-card">
            <h4>{item.area}</h4>
            <h4>{item.puesto}</h4>
            <p className="activos">Activos: {item.activos}</p>
            <p className="inactivos">Inactivos: {item.inactivos}</p>
          </div>
        ))}
      </div>
    </div>
  );
}