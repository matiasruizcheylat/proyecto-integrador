import "../../styles/EmpleadosToolbar.css";

interface Props {
  estado: "activo" | "inactivo";
  onToggleEstado: () => void;
  onAgregar: () => void;
}

export default function EmpleadosToolbar({
  estado,
  onToggleEstado,
  onAgregar,
}: Props) {
  const mostrandoActivos = estado === "activo";

  return (
    <div className="toolbar-container">
      <div className="toolbar-right">
        <button className="btn-toggle" onClick={onToggleEstado}>
          {mostrandoActivos ? "Ver Inactivos" : "Ver Activos"}
        </button>
      </div>
   
     <div className="toolbar-left">
  
    <button className="btn-add" onClick={onAgregar}>
      + Agregar Empleado
    </button>

</div>
    </div>
  );
}