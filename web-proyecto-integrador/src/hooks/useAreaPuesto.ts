import { useEffect, useState } from "react";
import { getAreaPuestoCompatibles } from "../services/areaPuestoCompatible.service";
import type { Area, PuestoConAreas, AreaPuestoCompatible } from "../types/areaPuestoCompatible";

export function useAreaPuesto() {
  const [areas, setAreas] = useState<Area[]>([]);
  const [puestos, setPuestos] = useState<PuestoConAreas[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data: AreaPuestoCompatible[] = await getAreaPuestoCompatibles();

      // 🔹 AREAS (sin duplicados)
      const areasUnicas = Array.from(
        new Map(data.map((item) => [item.area.id, item.area])).values()
      );

      // 🔹 PUESTOS + RELACIONES
      const puestosMap = new Map<number, PuestoConAreas>();

      data.forEach((item) => {
        if (!puestosMap.has(item.puesto.id)) {
          puestosMap.set(item.puesto.id, {
            id: item.puesto.id,
            nombre: item.puesto.nombre,
            areaIds: [],
          });
        }

        puestosMap.get(item.puesto.id)!.areaIds.push(item.area.id);
      });

      const puestosFinal = Array.from(puestosMap.values());

      setAreas(areasUnicas);
      setPuestos(puestosFinal);
    };

    fetchData();
  }, []);

  return { areas, puestos };
}