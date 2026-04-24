// pages/EmpleadosPage.tsx
import { useEffect, useState } from "react";
import { getEmpleados } from "../services/empleado.service";
import type { Empleado } from "../types/empleado";
import EmpleadoTable from "../components/empleados/EmpleadoTable";
import { useLocation, useNavigate  } from "react-router-dom";



import DashboardLayout from "../layouts/DashboardLayout";


import EmpleadoFilters from "../components/empleados/EmpleadoFilters";
import EmpleadosToolbar from "../components/empleados/EmpleadosToolbar";
import Pagination from "../components/empleados/Pagination";



import { activarEmpleado, desactivarEmpleado, eliminarEmpleado } from "../services/empleado.service";
import Swal from "sweetalert2";

interface Props {
  activoDefault?: boolean;
  onToggleEstado?:boolean;
}



export default function EmpleadosPage({  }: Props) {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [documento, setDocumento]=useState("");

  const [criterio, setCriterio] = useState<"nombre" | "documento">("nombre");

  //const [estado, setEstado] = useState<"activo" | "inactivo">(activoDefault ? "activo" : "inactivo");
  

  const [orderBy, setOrderBy] = useState<string | null>(null);

  const page_size = 10;




  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  

  const [mostrarActivos] = useState(true);

  const toggleEstado = () => {
  //setMostrarActivos((prev) => !prev);

   if (estado === "activo") {
      navigate("/empleados/inactivos");
      
    } else {
      navigate("/empleados");
    }
    setPage(1); // opcional
  };

  const location = useLocation();
  const navigate = useNavigate();

    // 🔥 estado derivado de la URL
  const estado: "activo" | "inactivo" = location.pathname.includes("inactivos") ? "inactivo" : "activo";

  const modo = estado === "activo" ? "activos" : "inactivos";
  

  
  useEffect(() => {
  if (location.state?.success) {
    setSuccessMessage(location.state.success);

    // limpia el state del router
    navigate(location.pathname, { replace: true });
  }
}, [location, navigate]);


useEffect(() => {
  fetchEmpleados(buildParams(1));
}, [page, orderBy, location.pathname]);

  const fetchEmpleados = async (filters?: {
    nombre?: string;
    apellido?: string;
    documento?: string;
    activo?: boolean;
  },
  customPage?: number) => {
    const data = await getEmpleados({
      page: customPage ?? page,
      page_size,
      order_by: orderBy, 
      nombre: filters?.nombre ?? nombre,
      apellido: filters?.apellido ?? apellido,
      documento: filters?.documento ?? documento,
      activo: filters?.activo,
    });

    setEmpleados(data.datos);
   
    setTotalPages(data.paginacion.cantPaginas);
  };





const handleBuscar = () => {
  setPage(1);

  fetchEmpleados({
    nombre: criterio === "nombre" ? nombre : "",
    apellido: criterio === "nombre" ? apellido : "",
    documento: criterio === "documento" ? documento : "",
    activo: estado === "activo"
  });
};





const handleLimpiar = () => {
  handleCriterioChange(criterio); // reutilizás lógica

};


  const handleSort = (field: string) => {
    let newOrder = field; // asc por defecto

    if (orderBy === field) {
      newOrder = `-${field}`; // pasa a desc
    } else if (orderBy === `-${field}`) {
      newOrder = field; // vuelve a asc
    }

    setOrderBy(newOrder);
    setPage(1);
  };


/*
useEffect(() => {
  fetchEmpleados({
    nombre: criterio === "nombre" ? nombre : "",
    apellido: criterio === "nombre" ? apellido : "",
    documento: criterio === "documento" ? documento : "",
    activo: estado === "activo"
  });
}, [page, orderBy]);
*/


  const handleCriterioChange = (value: "nombre" | "documento") => {
    setCriterio(value);
   

     // limpia inputs front:
    setNombre("");
    setApellido("");
    setDocumento("");
   

  const emptyFilters = {
    nombre: "",
    apellido: "",
    documento: "",
    activo: estado === "activo"
  };

     setPage(1);

    // ejecutar búsqueda automáticamente
    setTimeout(() => {
      fetchEmpleados(emptyFilters,1);
    }, 0);
  };



const puedeActivar = (fechaEgreso: string | null) => {

  if (!fechaEgreso) return false;

  const diff =
    (new Date().getTime() - new Date(fechaEgreso).getTime()) /
    (1000 * 60 * 60 * 24);

  return diff <= 29;
};

const handleActivar = async (id: number, fechaEgreso: string | null) => {

  if (!puedeActivar(fechaEgreso)) {
    Swal.fire({
      title: "No permitido",
      text: "Pasaron más de 29 días",
      icon: "warning",
    });
    return;
  }

  const result = await Swal.fire({
    title: "¿Activar empleado?",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#28a745",
    confirmButtonText: "Sí, activar",
  });

  if (!result.isConfirmed) return;

  try {
    await activarEmpleado(id);
    
    await Swal.fire("Activado", "", "success");

    fetchEmpleados(buildParams());
  } catch (error) {
    Swal.fire("Error", "No se pudo activar", "error");
  }
};



const handleDesactivar = async (id: number) => {
  const result = await Swal.fire({
    title: "¿Desactivar empleado?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    confirmButtonText: "Sí, desactivar",
  });

  if (!result.isConfirmed) return;

  try {
    await desactivarEmpleado(id);

    await Swal.fire("Desactivado", "", "success");

    fetchEmpleados(buildParams()); //  refresca tabla
  } catch (error) {
    Swal.fire("Error", "No se pudo desactivar", "error");
  }
};


const handleEliminar = async (id: number) => {
  const result = await Swal.fire({
    title: "¿Esta seguro que quiere eliminar al empleado?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    confirmButtonText: "Sí, Eliminar",
  });

  if (!result.isConfirmed) return;

  try {
    await eliminarEmpleado(id);

    await Swal.fire("Eliminado", "", "success");

    fetchEmpleados(buildParams()); //  refresca tabla
  } catch (error) {
    Swal.fire("Error", "No se pudo eliminar", "error");
  }
};


 // 🔥 params centralizados
  const buildParams = (customPage?: number) => ({
    page: customPage ?? page,
    page_size,
    order_by: orderBy,
    nombre: criterio === "nombre" ? nombre : "",
    apellido: criterio === "nombre" ? apellido : "",
    documento: criterio === "documento" ? documento : "",
    activo: estado === "activo",
  });



  return (
    
    <DashboardLayout>
    <div>
    <h2 className={ modo === "inactivos"? "empleados-inactivos" : ""}>
    {estado === "activo"
      ? "Listado de empleados activos"
      : "Listado de empleados inactivos"}
    </h2>

      {successMessage && (
    <div className="success-box">
      {successMessage}
      <button onClick={() => setSuccessMessage(null)}>
      ✖
      </button>
    </div>
    )}
    


      <EmpleadosToolbar
          estado={estado}
          onToggleEstado={toggleEstado}
          onAgregar={() => navigate("/empleados/nuevo")}

      />

      <EmpleadoFilters
        criterio={criterio}
        onCriterioChange={handleCriterioChange}
        nombre={nombre}
        apellido={apellido}
        documento={documento}
        estado={estado}
        onNombreChange={setNombre}
        onApellidoChange={setApellido}
        onDocumentoChange={setDocumento}
        onEstadoChange={() => {}}
        onBuscar={handleBuscar}
        onLimpiar={handleLimpiar}
      />


      <EmpleadoTable 
      empleados={empleados}
      onSort={handleSort}
      orderBy={orderBy}
      modo={modo}
      fechaDesactivacion={null}
      onActivar={handleActivar}
      onDesactivar={handleDesactivar}
      onEliminar={handleEliminar} />

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
    </DashboardLayout>
  );
}