export interface ReporteResumen {
  total: number;
  activos: number;
  inactivos: number;
  eliminados: number;
}


export interface ReporteItem {
  area?: string;
  puesto?: string;
  activos: number;
  inactivos: number;
}

export interface ReporteArea {
  area: string;
  activos: number;
  inactivos: number;
}

export interface ReportePuesto {
  puesto: string;
  activos: number;
  inactivos: number;
}

export interface ReporteAntiguedad {
  promedio: number;
}


export interface CardItem {
  label: string;
  value: number;
  type?: "default" | "success" | "danger";
}