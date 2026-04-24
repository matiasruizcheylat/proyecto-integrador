import { useEffect, useState } from "react";
import { getEmpleadoDetalle } from "../../services/empleado.service";
import { useAreaPuesto } from "../../hooks/useAreaPuesto"; // 🔥 IMPORTANTE
import "../../styles/EmpleadoDetalleModal.css";

interface Props {
  empleadoId: number;
  onClose: () => void;
}

export default function EmpleadoDetalleModal({ empleadoId, onClose }: Props) {
  const [empleado, setEmpleado] = useState<any>(null);
  const { areas, puestos } = useAreaPuesto(); // 🔥 para mapear nombres


  useEffect(() => {
    const fetchEmpleado = async () => {
      try {
        const data = await getEmpleadoDetalle({ id: empleadoId });

        // 🔥 FIX CLAVE: mergear datos + asignaciones
        setEmpleado({
          ...data.datos,
          asignaciones: data.asignaciones,
        });

      } catch (error) {
        console.error("Error al obtener detalle", error);
      }
    };

    fetchEmpleado();
  }, [empleadoId]);

  if (!empleado) {
    return (
      <div className="modal-overlay">
        <div className="modal">
          <p className="loading">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>

        <button className="close-btn" onClick={onClose}>✖</button>

        <h2>Detalle del empleado</h2>
        <hr/>

        <div className="detalle-grid">
          <p><b>Nombre:</b> {empleado.nombre}</p>
          <p><b>Apellido:</b> {empleado.apellido}</p>
          <p><b>Documento:</b> {empleado.nroDocumento}</p>
          <p><b>Email:</b> {empleado.email}</p>
          <p><b>Teléfono:</b> {empleado.telefono}</p>
          <p><b>Fecha nacimiento:</b> {empleado.fechaNacimiento}</p>
          <p><b>Fecha ingreso:</b> {empleado.fechaIngreso}</p>
          <p>
            <b>Estado:</b>{" "}
            <span className={empleado.activo ? "activo" : "inactivo"}>
              {empleado.activo ? "Activo" : "Inactivo"}
            </span>
          </p>
        </div>

        {/* 🔥 NUEVO: reemplazamos áreas + puestos por asignaciones */}
        <div className="seccion">
          <b>Asignaciones:</b>
          <div className="badges">

          <div className="asignaciones-grid">
            {(empleado?.asignaciones ?? []).map((a: any, i: number) => {
              const area = areas.find(ar => ar.id === a.area);
              const puesto = puestos.find(p => p.id === a.puesto);

              return (
                <div key={i} className="asignacion-card">
                  <span className="badge area">{area?.nombre}</span>
                  <span className="arrow">→</span>
                  <span className="badge puesto">{puesto?.nombre}</span>
                </div>
              );
            })}
          </div>

          </div>
        </div>

      </div>
    </div>
  );
}