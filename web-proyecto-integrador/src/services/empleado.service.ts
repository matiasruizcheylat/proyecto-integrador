import { api } from "../api/client";
import type { EmpleadosResponse } from "../types/empleado";
import type { EmpleadoDetalleResponse } from "../types/empleado";
import type { EmpleadoCreateDTO } from "../types/empleado";

interface GetEmpleadosParams {
  page?: number;
  limit?: number;
  nombre?: string;
  apellido?: string;
}

interface GetEmpleadoDetalleParam {
  id?: number;
}


export const getEmpleados = async (
  params: GetEmpleadosParams
): Promise<EmpleadosResponse> => {
  const { data } = await api.get<EmpleadosResponse>("/empleados", {
    params
  });
  return data;
};

export const getEmpleadoDetalle = async (
  params: GetEmpleadoDetalleParam
): Promise<EmpleadoDetalleResponse> => {
  const { data } = await api.get<EmpleadoDetalleResponse>(
    "/empleados/empleadoDetalle",
    { params }
  );
  return data;
};



export const createEmpleado = async (data: EmpleadoCreateDTO) => {

    const response = await api.post("/empleados/crear", data);
    return response.data;
  }; 


export const editEmpleado = async (id: number, data: EmpleadoCreateDTO) => {

  const response = await api.put(`/empleados/editar/${id}`, data);
  return response.data;
};


// 🔴 Desactivar
export const desactivarEmpleado = async (id: number) => {
  return api.patch(`/empleados/desactivarEmpleado/${id}`);
};

// 🟢 Activar
export const activarEmpleado = async (id: number) => {
  return api.patch(`/empleados/activarEmpleado/${id}`);
};

// ❌ Eliminar
export const eliminarEmpleado = async (id: number) => {
  return api.patch(`/empleados/eliminarEmpleado/${id}`);
};