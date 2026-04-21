from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy import text
from database import engine
from fastapi import Query
import math
from sqlalchemy.orm import Session
from sqlalchemy import or_, func

from dependencies.get_db import get_db
from services.empleado_service import *
from services.area_puesto_compatible_service import *
from schemas.empleado import EmpleadoCreate
from schemas.empleado import EmpleadoUpdate

from models import Empleado, Area,Puesto, EmpleadoAreaPuesto
from schemas.area_puesto_compatible import AreaPuestoCompatibleOut
from sqlalchemy.orm import joinedload
import datetime
from dependencies.auth import get_current_user

router = APIRouter(
    prefix="/empleados",
    dependencies=[Depends(get_current_user)],
    tags=["Empleados"]
)

    
##Read Empleados
@router.get("")
def get_empleados(
    nombre: str = Query(None),
    apellido: str = Query(None),
    documento: str= Query(None),
    activo: bool = Query(None),
    area: str = Query(None),
    puesto: str = Query(None),
    order_by: str = Query("id"),
    page: int = Query(1, ge=1),
    page_size: int = Query(100, ge=1, le=10000),
    db: Session = Depends(get_db),
):
   
    #  1. Parseo
    filters = parse_filters(nombre, apellido, activo, area, puesto, documento)

    # La query Básica
    query = get_base_query(db)

    #   filtros
    query = apply_filters(query, filters)

    #   Evitar duplicados 
    query = query.distinct()

    #  Orden
    query = apply_order(query, order_by)

    #  Paginación
    empleados, paginacion = paginate(query, page, page_size)

    #  Serialización acotada::
    resultado = serialize_list(empleados)

    return {
        "datos": resultado,
        "paginacion": paginacion
    }

##Read Empleados
@router.get("/areaPuestoCompatible", response_model=list[AreaPuestoCompatibleOut])

def get_areaPuestoCompatible(
    db: Session = Depends(get_db)
    ):
    #return list[AreaPuestoCompatibleOut]
    # La query Básica
    query = query_area_puesto_compatible(db)
    return query



##Read 
@router.get("/empleadoDetalle")
def get_empleados(
    id: int = Query(...),
    db: Session = Depends(get_db)
    ):

    query=(db.query(Empleado)
           .filter(Empleado.id == id)
           .filter(Empleado.f_hasta.is_(None))
           .first())

    if not query:
        return {"error": "Empleado no encontrado"}

    asignaciones=(db.query(EmpleadoAreaPuesto)
            .filter(EmpleadoAreaPuesto.empleado_id == id)
            .filter(EmpleadoAreaPuesto.f_hasta.is_(None)).all())
    

    asignaciones=[serialize_asignaciones(e) for e in asignaciones]
    
    resultado=serialize_empleado(query)
    return {
        "datos": resultado,
        "asignaciones":asignaciones
    }





##Create 
@router.post("/crear")
def create_empleado(data: EmpleadoCreate, db: Session = Depends(get_db)):

    # Validar documento único (siempre que no haya sido eliminado ni despedido)
    existe = (db.query(Empleado)
              .filter(Empleado.nro_documento == str(data.documento))
              .filter(Empleado.f_hasta.is_(None))
              .first())
    if existe:
        raise HTTPException(status_code=400, detail="El documento ya existe")
    

    # Validar email único (siempre que no haya sido eliminado)
    existe = (db.query(Empleado)
              .filter(Empleado.email == str(data.email))
              .filter(Empleado.f_hasta.is_(None))
              .first())
    if existe:
        raise HTTPException(status_code=400, detail="El Email ya existe")


    # Crear objeto
    empleado = Empleado(
        nombre=data.nombre,
        apellido=data.apellido,
        nro_documento=int(data.documento),
        email=data.email,
        telefono=data.telefono,
        fecha_ingreso = datetime.date.today(),
        fecha_nacimiento=data.fecha_nacimiento,
        activo = True
    )


    #VALIDAR que existan los puestos y las areas y que sean compatibles:
    puestos = [a.puesto_id for a in data.asignaciones]
    areas = [a.area_id for a in data.asignaciones]

    puestos_ids = validar_ids_existentes(db, Puesto, puestos, "Puestos")
    areas_ids = validar_ids_existentes(db, Area, areas, "Areas")

    validar_areas_compatibles(areas, puestos, db, Puesto, Area)

    creado=crear_empleado(db,empleado, areas, puestos)
    
    return creado



#Update:::
@router.put("/editar/{id}")
def update_empleado(
    id: int,
    empleado_data: EmpleadoUpdate,  # schema para update
    db: Session = Depends(get_db)
):
    # 1. Buscar empleado
    empleado = (db.query(Empleado)
                .filter(Empleado.id == id)
                .first())

    if not empleado:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")
    
    if (empleado.f_hasta!=None):
        raise HTTPException(status_code=404, detail="Empleado eliminado antes")


    # 2. Validar DNI único (si viene)
    if empleado_data.nro_documento:
        existe = db.query(Empleado).filter(
            Empleado.nro_documento == str(empleado_data.nro_documento),
            Empleado.f_hasta ==None,
            Empleado.id != id 
        ).first()
        
        if existe:
            raise HTTPException(status_code=400, detail="DNI ya registrado de otro empleado")

    
    if(empleado_data.asignaciones!=None):
        puestos_ids = [a.puesto_id for a in empleado_data.asignaciones]
        areas_ids = [a.area_id for a in empleado_data.asignaciones]
        validar_areas_compatibles(areas_ids, puestos_ids, db, Puesto, Area)

    
    empleadoActualizado=actualizar_empleado(db, empleado_data, empleado, areas_ids, puestos_ids)
    

    return empleadoActualizado


#Despide un empleado (en casos especiales ej renuncia y vuelve a trabajar se lo carga nuevamente):::
@router.patch("/desactivarEmpleado/{id}")
def desactivar_empleado(
    id: int,
    db: Session = Depends(get_db)
):
    # 1. Buscar empleado
    empleado = db.query(Empleado).filter(Empleado.id == id).first()

    if not empleado:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")
    
    if (empleado.f_hasta!=None):
        raise HTTPException(status_code=404, detail="Empleado eliminado antes")
    
    if(empleado.activo==False):
        raise HTTPException(status_code=404, detail="Empleado desactivado de antes")
    
    empleadoDesactivado=desactivarEmpleado(db, empleado)
    
    return empleadoDesactivado



#Reactiva un empleado (en casos especiales (no puede superar los 30 días desactivado) ):::
@router.patch("/activarEmpleado/{id}")
def reactivar_empleado(
    id: int,
    db: Session = Depends(get_db)
):
    # 1. Buscar empleado
    empleado = db.query(Empleado).filter(Empleado.id == id).first()

    if not empleado:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")
    
    if (empleado.f_hasta!=None):
        raise HTTPException(status_code=404, detail="Empleado eliminado antes")
    
    if(empleado.activo==True):
        raise HTTPException(status_code=404, detail="Empleado Activado de antes")
    
    fecha_actual=datetime.date.today()
  
    cantDias=(fecha_actual - empleado.fecha_egreso).days
    if(cantDias>30):
        raise HTTPException(status_code=404, detail="Ya pasaron 30 días no es posible reactivar dicho empleado")


    empleadoActivado=activarEmpleado(db, empleado)
    
    return empleadoActivado



#Elimina un empleado (de forma lógica, lo desactiva y setea fecha_egreso (en casos que este activo)):
@router.patch("/eliminarEmpleado/{id}")
def eliminar_empleado(
    id: int,
    db: Session = Depends(get_db)
):
     # 1. Buscar empleado
    empleado = db.query(Empleado).filter(Empleado.id == id).first()

    if not empleado:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")
    
    if (empleado.f_hasta!=None):
        raise HTTPException(status_code=404, detail="Empleado eliminado antes")
    
    empleadoEliminado=eliminarEmpleado(db, empleado)
    
    return empleadoEliminado