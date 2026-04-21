import "./ReporteCards.css";
import type { CardItem } from "../../types/reportes";

interface Props {
  title: string;
  items: CardItem[];
}

export default function ReporteCards({ title, items }: Props) {
  return (
    <div className="reporte-container">
      <h2 className="reporte-title">{title}</h2>

      <div className="reporte-cards">
        {items.map((item, index) => (
          <div key={index} className={`reporte-card ${item.type || ""}`}>
            <span className="reporte-label">{item.label}</span>
            <span className="reporte-value">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}