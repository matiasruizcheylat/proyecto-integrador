import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import EmpleadoEditForm from "../components/empleados/EmpleadoEditForm";
import { getEmpleadoDetalle, editEmpleado } from "../services/empleado.service";
import DashboardLayout from "../layouts/DashboardLayout";



export default function EmpleadoEditPage() {
  const navigate = useNavigate();
  const { id } = useParams(); // 🔥 obtenés el id de la URL

  const [empleado, setEmpleado] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // FETCH DEL EMPLEADO
  useEffect(() => {
    const fetchEmpleado = async () => {
      try {
        const data = await getEmpleadoDetalle({   id: id ? Number(id) : undefined });
        console.log("EMPLEADO:", data); // 👈 debug
        setEmpleado(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchEmpleado();
  }, [id]);

  //  UPDATE
  const handleUpdate = async (data: any) => {
    await editEmpleado(Number(id), data); 
    navigate("/empleados", {
      state: { success: "Empleado editado correctamente" },
    });
  };

  //  LOADING / ERRORES
  if (loading) {
    return (
      <DashboardLayout>
        <p style={{ padding: "20px" }}>Cargando...</p>
      </DashboardLayout>
    );
  }

  if (!empleado) {
    return (
      <DashboardLayout>
        <p style={{ padding: "20px" }}>Empleado no encontrado</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <EmpleadoEditForm
        empleado={empleado} //  LE PASÁS LOS DATOS
        onSubmit={handleUpdate}
      />
    </DashboardLayout>
  );
}