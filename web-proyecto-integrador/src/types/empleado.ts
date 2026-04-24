export interface Empleado {
  id: number;
  nombre: string;
  apellido: string;
  nroDocumento: string;
  fechaIngreso: string;
  activo: boolean;
  fechaEgreso?: string | null;
}


export interface Paginacion {
  totalRegistros: number;
  cantPaginas: number;
  paginaActual: number;
  elementosPorPagina: number;
}

export interface EmpleadosResponse {
  datos: Empleado[];
  paginacion: Paginacion;
}


export interface Asignacion {
  area: number;
  puesto: number;
}

export interface EmpleadoDetalle {
  id: number;
  nombre: string;
  apellido: string;
  nroDocumento: string;
  fechaNacimiento: string;
  email: string;
  fechaIngreso: string;
  fechaEgreso: string | null;
  telefono: string;
  activo: boolean;
  areas: string[];
  puestos: string[];
  asignaciones: Asignacion[];
}

export interface EmpleadoDetalleResponse {
  datos: EmpleadoDetalle;
  asignaciones: Asignacion[];
}

export interface EmpleadoCreateDTO {
  nombre: string;
  apellido: string;
  documento: number;
  email: string;
  telefono?: string | null;
  fecha_nacimiento: string; // YYYY-MM-DD
}