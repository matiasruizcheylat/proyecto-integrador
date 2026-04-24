import type { Empleado } from "../../types/empleado";
import { useState } from "react";
import "../../styles/EmpleadoTable.css";
import EmpleadoDetalleModal from "./EmpleadoDetalleModal";
import { useNavigate } from "react-router-dom";

interface Props {
  empleados: Empleado[];
  onSort: (field: string) => void;
  orderBy: string | null;
  fechaDesactivacion: string | null;
  modo: "activos" | "inactivos";
  onActivar?:  (id: number, fechaEgreso: string | null) => Promise<void>;
  onDesactivar?: (id: number, fechaEgreso: string | null) => Promise<void>;
  onEliminar?:(id: number) => void;
}



export default function EmpleadoTable({ empleados, onSort, orderBy, modo, onActivar, onDesactivar, onEliminar }: Props) {
  const navigate = useNavigate();

  const puedeActivar = (fechaEgreso: string | null) => {
  if (!fechaEgreso) return false;

  const hoy = new Date();
  const egreso = new Date(fechaEgreso);

  const diffDias =
    (hoy.getTime() - egreso.getTime()) / (1000 * 60 * 60 * 24);

  return diffDias <= 29;
};
 
  const renderSortIcon = (field: string) => {
    if (orderBy === field) return "↑";
    if (orderBy === `-${field}`) return "↓";
    return "↕";
  };
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState<number | null>(null);



  const irAEditar = (id: number) => {
  navigate(`/empleados/editar/${id}`);
};


  if (empleados.length === 0) {
    return (
      <div className="empty-state">
        <p>No hay empleados en esta página con los filtros aplicados.</p>
      </div>
      );
    }else{


  return (
     <div className="table-container">
    <div className="table-wrapper">
      <table className={ modo === "inactivos"? "table-empleados inactivos" : "table-empleados"} >
    <thead>
      <tr className={ modo === "inactivos"? "fila-inactiva" : ""}>
        <th onClick={() => onSort("nombre")} className="sortable">
          Nombre {renderSortIcon("nombre")}
        </th>

        <th onClick={() => onSort("apellido")} className="sortable col-apellido">
          Apellido {renderSortIcon("apellido")}
        </th>

        <th onClick={() => onSort("nroDocumento")} className="sortable">
          Documento {renderSortIcon("nroDocumento")}
        </th>

        <th onClick={() => onSort("fecha_ingreso")} className="sortable col-fecha">
          Fecha Ingreso {renderSortIcon("fecha_ingreso")}
        </th>

        {modo === "inactivos" && <th>Fecha Egreso</th>}

        <th className="col-estado">Estado</th>

        <th className="col-acciones">Acciones</th>
      </tr>
    </thead>

    <tbody>



      {empleados.map((emp) => (
        <tr key={emp.id} className={ modo === "inactivos"? "fila-inactiva" : ""}>
          <td>{emp.nombre}</td>
          <td className="col-apellido">{emp.apellido}</td>
          <td>{emp.nroDocumento}</td>
          <td className="col-fecha">{emp.fechaIngreso}</td>
          {modo === "inactivos" && (<td>{emp.fechaEgreso ?? "-"}</td>)}
          <td className="col-estado">{emp.activo ? "Activo" : "Inactivo"}</td>

          <td className="col-acciones">
            <button title="Ver" onClick={() => setEmpleadoSeleccionado(emp.id)}>👁</button>
            <button title="Editar"  onClick={() => irAEditar(emp.id)}>✏️</button>
           {modo === "inactivos" && (() => {
  const habilitado = puedeActivar(emp.fechaEgreso ?? null);


    

          return (
            <button
              className={`btn-activar ${!habilitado ? "disabled" : ""}`}
              title={
                habilitado
                  ? "Activar empleado"
                  : "No se puede activar (más de 29 días)"
              }
              disabled={!habilitado}
              onClick={() => habilitado && onActivar && onActivar(emp.id, emp.fechaEgreso ?? null)}
            >
              ✅
            </button>
          );
        })()}

            {modo === "activos" && (
      

        <button
          className="btn-desactivar"
          title="Desactivar empleado"
          onClick={() => onDesactivar && onDesactivar(emp.id, emp.fechaEgreso ?? null)}
        >
          ⛔
        </button>
       
      )}

         {modo === "inactivos" && (    
          <button title="Eliminar"  onClick={() => onEliminar && onEliminar(emp.id)}>
          🗑
          </button> )}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
    {empleadoSeleccionado && (
    <EmpleadoDetalleModal
      empleadoId={empleadoSeleccionado}
      onClose={() => setEmpleadoSeleccionado(null)}
    />
  )}
  </div>
  </div>
  );
}
}