
import "../../styles/EmpleadoFilter.css";
import { useNavigate } from "react-router-dom";

type Criterio = "nombre" | "documento";

interface Props {
  criterio: Criterio;
  nombre: string;
  apellido: string;
  documento: string;
  estado: string;

  onCriterioChange: (v: Criterio) => void;
  onNombreChange: (v: string) => void;
  onApellidoChange: (v: string) => void;
  onDocumentoChange: (v: string) => void;
  onEstadoChange: (v: string) => void;

  onBuscar: () => void;
  onAgregar: () => void; 
  onLimpiar: () => void;
}

export default function EmpleadoFilters({
  criterio,
  nombre,
  apellido,
  documento,
  estado,
  onCriterioChange,
  onNombreChange,
  onApellidoChange,
  onDocumentoChange,
  onEstadoChange,
  onBuscar,
  onLimpiar,
  onAgregar, 
}: Props) {
  const navigate = useNavigate();
  return (
    <div className="filters-wrapper">
      <div className="filters-container">
        <div className="filters-left">

          {/* Criterio */}
          <select
            value={criterio}
            onChange={(e) => onCriterioChange(e.target.value as Criterio)}
            className="input criterio"
          >
            <option value="nombre">Nombre / Apellido</option>
            <option value="documento">Documento</option>
          </select>

          {/* Nombre */}
          {criterio === "nombre" ? (
            <>
              <input
                placeholder="Nombre"
                value={nombre}
                onChange={(e) => onNombreChange(e.target.value)}
                className="input nombre"
              />

              <input
                placeholder="Apellido"
                value={apellido}
                onChange={(e) => onApellidoChange(e.target.value)}
                className="input apellido"
              />

              <div className="acciones-filtros">
                <button className="btn-buscar" onClick={onBuscar}>
                  Filtrar
                </button>

                 <button className="btn-limpiar" onClick={onLimpiar}>
                Limpiar
                </button>
                

              </div>
            </>
          ) : (
            <>
              <input
                placeholder="Documento"
                value={documento}
                onChange={(e) => onDocumentoChange(e.target.value)}
                className="input nombre"
              />

              <div className="acciones-filtros">
                <button className="btn-buscar" onClick={onBuscar}>
                  Filtrar
                </button>
                   <button className="btn-limpiar" onClick={onLimpiar}>
                Limpiar
                </button>
              </div>
  
            </>
          )}
        </div>

           
      </div>
    </div>
  );
}

