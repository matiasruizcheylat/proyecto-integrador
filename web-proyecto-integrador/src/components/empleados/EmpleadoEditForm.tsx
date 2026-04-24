import { useState, useEffect } from "react";
import { useAreaPuesto } from "../../hooks/useAreaPuesto";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import "../../styles/EmpleadoForm.css";
import type { EmpleadoDetalleResponse } from "../../types/empleado";

interface Props {
  empleado: EmpleadoDetalleResponse;
  onSubmit: (data: any) => Promise<void>;
}

export default function EmpleadoEditForm({ empleado, onSubmit }: Props) {
  const { areas, puestos } = useAreaPuesto();
  const navigate = useNavigate();

  const [backendError, setBackendError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});
  

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    documento: "",
    email: "",
    telefono: "",
    fecha_nacimiento: "",
  });

  const [asignaciones, setAsignaciones] = useState([
    { areaId: "", puestoId: "" },
  ]);

  // 🔥 PRECARGA
  useEffect(() => {
    if (!empleado) return;

    setForm({
      nombre: empleado.datos.nombre,
      apellido: empleado.datos.apellido,
      documento: String(empleado.datos.nroDocumento),
      email: empleado.datos.email,
      telefono: empleado.datos.telefono || "",
      fecha_nacimiento: empleado.datos.fechaNacimiento,
    });

    if (empleado.asignaciones?.length > 0) {
      setAsignaciones(
        empleado.asignaciones.map((a: any) => ({
          areaId: String(a.area),
          puestoId: String(a.puesto),
        }))
      );
    } else {
      setAsignaciones([{ areaId: "", puestoId: "" }]);
    }
  }, [empleado]);

  // INPUTS
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  // VALIDACIÓN
  const validate = () => {
    const newErrors: any = {};

    if (!form.nombre) newErrors.nombre = "Requerido";
    if (!form.apellido) newErrors.apellido = "Requerido";
    if (!form.documento) newErrors.documento = "Requerido";
    if (!form.email) newErrors.email = "Requerido";
    if (!form.fecha_nacimiento) newErrors.fecha_nacimiento = "Requerido";

    const asignacionesValidas = asignaciones.filter(
      (a) => a.areaId && a.puestoId
    );

    if (asignacionesValidas.length === 0) {
      newErrors.asignaciones = "Se requiere al menos un área y puesto";
    }

    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Email inválido";
    }

    if (form.documento && isNaN(Number(form.documento))) {
      newErrors.documento = "Debe ser numérico";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // SUBMIT
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

  const result = await Swal.fire({
    title: "¿Guardar cambios?",
    text: "Se actualizarán los datos del empleado",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, guardar",
    cancelButtonText: "Cancelar",
    reverseButtons: true,
  });

  if (!result.isConfirmed) return;


    setErrors({});
    setBackendError(null);
    setSuccess(false);

    if (!validate()) return;

    const asignacionesValidas = asignaciones.filter(
      (a) => a.areaId && a.puestoId
    );

    try {
      setLoading(true);

      await onSubmit({
        ...form,
        documento: Number(form.documento),
        telefono: form.telefono || null,
        asignaciones: asignacionesValidas.map((a) => ({
          area_id: Number(a.areaId),
          puesto_id: Number(a.puestoId),
        })),
      });

      setSuccess(true);
    } catch (error: any) {
      console.error(error);

      const detail = error.response?.data?.detail;

      if (Array.isArray(detail)) {
        const fieldErrors: any = {};

        detail.forEach((err: any) => {
          const field = err.loc?.[1];
          if (field) fieldErrors[field] = err.msg;
        });

        setErrors(fieldErrors);
        return;
      }

      if (typeof detail === "string") {
        setBackendError(detail);
        return;
      }

      setBackendError("Error inesperado");
    } finally {
      setLoading(false);
    }
  };

  // ASIGNACIONES
  const addAsignacion = () => {
    setAsignaciones([...asignaciones, { areaId: "", puestoId: "" }]);
  };

  const removeAsignacion = (index: number) => {
    const nuevas = [...asignaciones];
    nuevas.splice(index, 1);
    setAsignaciones(nuevas);
  };

  const handleAsignacionChange = (
    index: number,
    field: "areaId" | "puestoId" ,
    value: string
  ) => {
    const nuevas = [...asignaciones];
    nuevas[index][field] = value;

    if (field === "areaId") {
      nuevas[index].puestoId = "";
    }

    setAsignaciones(nuevas);
  };

  // RESET
  const resetForm = () => {
    if (!empleado) return;

    setForm({
      nombre: empleado.datos.nombre,
      apellido: empleado.datos.apellido,
      documento: String(empleado.datos.nroDocumento),
      email: empleado.datos.email,
      telefono: empleado.datos.telefono || "",
      fecha_nacimiento: empleado.datos.fechaNacimiento,
    });

    if (empleado.asignaciones?.length > 0) {
      setAsignaciones(
        empleado.asignaciones.map((a: any) => ({
          areaId: String(a.area),
          puestoId: String(a.puesto),
        }))
      );
    } else {
      setAsignaciones([{ areaId: "", puestoId: "" }]);
    }

    setErrors({});
    setBackendError(null);
    setSuccess(false);
  };

  const goToList = () => {
    navigate("/empleados");
  };

  return (
    <div className="form-card">
      <h2>Editar Empleado</h2>

      <form onSubmit={handleSubmit} className="form-grid">
        {/* DATOS */}
        <div className="form-group">
          <label>Nombre *</label>
          <input name="nombre" value={form.nombre} onChange={handleChange} />
          {errors.nombre && <span className="error">{errors.nombre}</span>}
        </div>

        <div className="form-group">
          <label>Apellido *</label>
          <input name="apellido" value={form.apellido} onChange={handleChange} />
          {errors.apellido && <span className="error">{errors.apellido}</span>}
        </div>

        <div className="form-group">
          <label>Documento *</label>
          <input name="documento" value={form.documento} onChange={handleChange} />
          {errors.documento && <span className="error">{errors.documento}</span>}
        </div>

        <div className="form-group">
          <label>Email *</label>
          <input name="email" value={form.email} onChange={handleChange} />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label>Teléfono</label>
          <input name="telefono" value={form.telefono} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Fecha de nacimiento *</label>
          <input
            type="date"
            name="fecha_nacimiento"
            value={form.fecha_nacimiento}
            onChange={handleChange}
          />
          {errors.fecha_nacimiento && (
            <span className="error">{errors.fecha_nacimiento}</span>
          )}
        </div>

        {/* ASIGNACIONES */}
        <div className="asignaciones-container">
          <h3>Asignaciones</h3>

          <div className="asignacion-header">
            <span>Área</span>
            <span>Puesto</span>
            <span></span>
          </div>

          {asignaciones.map((asig, index) => {
            const areaId = Number(asig.areaId);

            const puestosFiltrados = puestos.filter((p) =>
              p.areaIds.includes(areaId)
            );

            return (
              <div key={index} className="asignacion-grid">
                <select
                  value={asig.areaId}
                  onChange={(e) =>
                    handleAsignacionChange(index, "areaId", e.target.value)
                  }
                >
                  <option value="">Área</option>
                  {areas.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.nombre}
                    </option>
                  ))}
                </select>

                <select
                  value={asig.puestoId}
                  onChange={(e) =>
                    handleAsignacionChange(index, "puestoId", e.target.value)
                  }
                  disabled={!asig.areaId}
                >
                  <option value="">Puesto</option>
                  {puestosFiltrados.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nombre}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  className="btn-danger"
                  onClick={() => removeAsignacion(index)}
                >
                 ❌
                </button>
              </div>
            );
          })}

          <button type="button" onClick={addAsignacion}>
            + Agregar área/puesto
          </button>

          {errors.asignaciones && (
            <span className="error">{errors.asignaciones}</span>
          )}
        </div>

        {/* BOTONES */}
        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Actualizando..." : "Actualizar"}
          </button>

          <button type="button" onClick={resetForm} className="btn-secondary">
            Restaurar
          </button>

          <button type="button" onClick={goToList} className="btn-warning">
            Volver
          </button>
        </div>
      </form>

      {backendError && <div className="error-box">{backendError}</div>}

      {success && (
        <div className="success-box">
          Empleado actualizado correctamente
        </div>
      )}
    </div>
  );
}