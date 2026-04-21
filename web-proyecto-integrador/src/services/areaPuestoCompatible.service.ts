import { api } from "../api/client";
import type { AreaPuestoCompatible } from "../types/areaPuestoCompatible";

export const getAreaPuestoCompatibles = async (): Promise<AreaPuestoCompatible[]> => {
  const res = await api.get("/empleados/areaPuestoCompatible");
  return res.data;
};