export interface Area {
  id: number;
  nombre: string;
}

export interface Puesto {
  id: number;
  nombre: string;
}

export interface AreaPuestoCompatible {
  id: number;
  area: Area;
  puesto: Puesto;
}
export interface PuestoConAreas {
  id: number;
  nombre: string;
  areaIds: number[];
}