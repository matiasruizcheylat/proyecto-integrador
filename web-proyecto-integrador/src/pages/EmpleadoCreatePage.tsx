// pages/EmpleadoCreatePage.tsx
import EmpleadoForm from "../components/empleados/EmpleadoForm";
import { createEmpleado } from "../services/empleado.service";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";

export default function EmpleadoCreatePage() {
  const navigate = useNavigate();

  const handleCreate = async (data: any) => {
    await createEmpleado(data);
    navigate("/empleados", {
      state: { success: "Empleado creado correctamente" },
    });
  };

  return (
      <DashboardLayout> 
      <EmpleadoForm onSubmit={handleCreate} />
      </DashboardLayout>
  );
}