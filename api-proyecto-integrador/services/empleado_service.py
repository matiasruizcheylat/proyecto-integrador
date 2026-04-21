import math
from sqlalchemy.orm import Session, joinedload
from models.empleado import Empleado
from models.empleadoAreaPuesto import EmpleadoAreaPuesto
from models.area import Area
from models.puesto import Puesto
from fastapi import HTTPException
from sqlalchemy.orm import selectinload
from sqlalchemy.exc import IntegrityError
import datetime
# -----------------------------
# PARSEO DE FILTROS
def parse_filters(nombre, apellido, activo, area, puesto, documento):
    return {
        "nombre": nombre,
        "apellido": apellido,
        "activo": activo,
        "area": parse_ids(area),
        "puesto": parse_ids(puesto),
        "documento": documento
    }


def parse_ids(value: str):
    if not value:
        return None
    return [int(x.strip()) for x in value.split(",") if x.strip().isdigit()]


# -----------------------------
# BASE QUERY
def get_base_query(db: Session):
  
    return (
        db.query(Empleado).join(Empleado.empleado_area_puesto)
            .join(EmpleadoAreaPuesto.area)
            .join(EmpleadoAreaPuesto.puesto)
    )


# -----------------------------
# FILTROS
def apply_filters(query, filters: dict):

    if filters.get("nombre"):
        query = query.filter(Empleado.nombre.ilike(f"%{filters['nombre']}%"))

    if filters.get("apellido"):
        query = query.filter(Empleado.apellido.ilike(f"%{filters['apellido']}%"))

    if filters.get("documento"):
        query = query.filter(Empleado.nro_documento.ilike(f"%{str(filters['documento'])}%"))

    if filters.get("activo") is not None:
        query = query.filter(Empleado.activo == filters["activo"])

    if filters.get("area"):
        query = query.join(Empleado.empleado_area).join(EmpleadoAreaPuesto.area)
        query = query.filter(Area.id.in_(filters["area"]))

    if filters.get("puesto"):
        query = query.join(Empleado.empleado_puesto).join(EmpleadoAreaPuesto.puesto)
        query = query.filter(Puesto.id.in_(filters["puesto"]))

    query=query.filter(Empleado.f_hasta.is_(None))
    return query


# -----------------------------
#  ORDER BY
def apply_order(query, order_by: str):

    columnas = {
        "id": Empleado.id,
        "nombre": Empleado.nombre,
        "apellido": Empleado.apellido,
        "nroDocumento": Empleado.nro_documento,
        "fecha_ingreso":Empleado.fecha_ingreso,
    }

    ordenes = []

    if order_by:
        for campo in order_by.split(","):
            desc = campo.startswith("-")
            campo_limpio = campo[1:] if desc else campo

            columna = columnas.get(campo_limpio)

            if columna is not None:
                ordenes.append(columna.desc() if desc else columna.asc())

    if ordenes:
        query = query.order_by(*ordenes)

    return query


# -----------------------------
# PAGINACIÓN
def paginate(query, page: int, page_size: int):

    total = query.order_by(None).count()
    offset = (page - 1) * page_size

    data = query.offset(offset).limit(page_size).all()

    return data, {
        "totalRegistros": total,
        "cantPaginas": math.ceil(total / page_size),
        "paginaActual": page,
        "elementosPorPagina": page_size,
    }


# -----------------------------
# SERIALIZER
def serialize_empleado(e: Empleado):
    return {
        "id": e.id,
        "nombre": e.nombre,
        "apellido": e.apellido,
        "nroDocumento": e.nro_documento,
        "fechaNacimiento": e.fecha_nacimiento.isoformat() if e.fecha_nacimiento else None,
        "email": e.email,
        "fechaIngreso": e.fecha_ingreso.isoformat() if e.fecha_ingreso else None,
        "fechaEgreso": e.fecha_egreso.isoformat() if e.fecha_egreso else None,
        "telefono": e.telefono,
        "activo": e.activo,
        "areas": list({ea.area.nombre for ea in e.empleado_area if ea.area}),
        "puestos": list({ep.puesto.nombre for ep in e.empleado_puesto if ep.puesto}),
    }


# SERIALIZER
def serialize_empleado(e: Empleado):
    return {
        "id": e.id,
        "nombre": e.nombre,
        "apellido": e.apellido,
        "nroDocumento": e.nro_documento,
        "fechaNacimiento": e.fecha_nacimiento.isoformat() if e.fecha_nacimiento else None,
        "email": e.email,
        "fechaIngreso": e.fecha_ingreso.isoformat() if e.fecha_ingreso else None,
        "fechaEgreso": e.fecha_egreso.isoformat() if e.fecha_egreso else None,
        "telefono": e.telefono,
        "activo": e.activo,
        "areas": list({ea.area.nombre for ea in e.empleado_area_puesto if(ea.area and e.f_hasta ==None)}),
        "puestos": list({ep.puesto.nombre for ep in e.empleado_area_puesto if (ep.puesto and e.f_hasta==None)}),
    }



# SERIALIZER Acotado
def serialize_empleado_acotado(e: Empleado):
    return {
        "id": e.id,
        "nombre": e.nombre,
        "apellido": e.apellido,
        "nroDocumento": e.nro_documento, 
        "fechaIngreso": e.fecha_ingreso.isoformat() if e.fecha_ingreso else None,
        "fechaEgreso": e.fecha_egreso.isoformat() if e.fecha_egreso else None,
        "activo": e.activo,
    }




#Recorre la lista de empleados y los retorna acotados:
def serialize_list(empleados):
    return [serialize_empleado_acotado(e) for e in empleados]



#Valida los puestos/areas por Ids:
def validar_ids_existentes(
    db: Session,
    model,
    ids: list[int],
    nombre: str = "Registros"
):
    if(ids==None):
         raise HTTPException(
            status_code=400,
            detail=f"{nombre} no debe ser vacio/a"
        )


    registros = db.query(model).filter(model.id.in_(ids)).all()


    ids_db = {r.id for r in registros}
    faltantes = set(ids) - ids_db

    if faltantes:
        raise HTTPException(
            status_code=400,
            detail=f"{nombre} no encontrados/as: {list(faltantes)}"
        )

    return registros


#Valida que un area sea compatible con otra/s:
def validar_areas_compatibles( areas:list[int], puestos: list[int], db:Session, modelArea, modelPuesto):
    compatibles=[[1,2],
                 [1,3],
                 [2,2],
                 [2,3],
                 [3,1],
                 [3,2],
                 [3,4],
                 [3,5],
                 [3,6],
                 [4,2],
                 [4,3]]
    
    validar_areas_puestos_existentes(areas,puestos)
    
    for i in range(len(areas)):

        if(([areas[i],puestos[i]])not in compatibles):
            
            elPuesto = db.query(modelPuesto).filter(modelPuesto.id==puestos[i]).first()
            elArea= db.query(modelArea).filter(modelArea.id==areas[i]).first()

            raise HTTPException(
                status_code=400,
                detail=f"El puesto: {elPuesto.nombre} no es compatible con el área: {elArea.nombre}"
            )  


#Valida que hayan areas y puestos y sean la misma cantidad:
def validar_areas_puestos_existentes(areas, puestos):
        
    if(len(areas)!=len(puestos)):
        raise HTTPException(
            status_code=400,
            detail=f"La cantidad de areas no condice con la cantidad de puestos. debe ser misma cantidad"
        )



##Crea al empleado nuevo con sus respectivas areas y puestos
def crear_empleado(db: Session, empleado, areas, puestos):
    try:
       
        db.add(empleado)
        db.flush()  
        areaPuestoRepetido=[]
        #  Crear relaciones
        for area_id, puesto_id in zip(areas, puestos):
            
            if([area_id, puesto_id] not in areaPuestoRepetido):
                db.add(EmpleadoAreaPuesto(
                    empleado_id=empleado.id,
                    area_id=area_id,
                    puesto_id=puesto_id
                ))
            areaPuestoRepetido.append([area_id, puesto_id])
        
        db.commit()


        #Si todo fue bien
        return {
            "mensaje": "Empleado creado correctamente",
            "empleado_id": empleado.id
        }

    except IntegrityError as e:
        db.rollback()
        return {
            "error": "Error de integridad (posible duplicado o FK inválida)",
            "detalle": str(e.orig)
        }

    except ValueError as e:
        db.rollback()
        return {
            "error": str(e)
        }

    except Exception as e:
        db.rollback()
        return {
            "error": "Error inesperado",
            "detalle": str(e)
        }
    

##actualiza el empleado sus áreas y puestos (si los hay)
def actualizar_empleado(db: Session, empleado_data, empleadoActual, areas, puestos):
    try:
       
        for key, value in empleado_data.dict(exclude_unset=True).items():
            setattr(empleadoActual, key, value)


 
        fecha_actual=datetime.date.today()
        if(areas!=None and puestos!=None):
            empleadoAreaPuesto=(db.query(EmpleadoAreaPuesto)
                                .filter(EmpleadoAreaPuesto.empleado_id == empleadoActual.id)
                                .filter(EmpleadoAreaPuesto.f_hasta==None).all())
                
            
            for empAreaPuesto in empleadoAreaPuesto:
                setattr(empAreaPuesto, "f_hasta", fecha_actual)

             #  Crear relaciones (borra las anteriores claro)
            for area_id, puesto_id in zip(areas, puestos):
                db.add(EmpleadoAreaPuesto(
                    empleado_id=empleadoActual.id,
                    area_id=area_id,
                    puesto_id=puesto_id
                ))
        
        db.commit()
        db.refresh(empleadoActual)


        #Si todo fue bien
        return {
            "mensaje": "Empleado Actualizado correctamente",
            "empleado_id": empleadoActual.id
        }

    except IntegrityError as e:
        db.rollback()
        return {
            "error": "Error de integridad (posible duplicado o FK inválida)",
            "detalle": str(e.orig)
        }

    except ValueError as e:
        db.rollback()
        return {
            "error": str(e)
        }

    except Exception as e:
        db.rollback()
        return {
            "error": "Error inesperado",
            "detalle": str(e)
        }
    

##desactiva al empleado
def desactivarEmpleado(db: Session, empleadoActual):
    try:

        fecha_actual=datetime.date.today()
        empleadoActual.activo=False
        empleadoActual.fecha_egreso=fecha_actual

        db.commit()
        db.refresh(empleadoActual)

    #Si todo fue bien
        return {
            "mensaje": "Empleado Desactivado correctamente",
            "empleado_id": empleadoActual.id
        }

    except Exception as e:
        db.rollback()
        return {
            "error": "Error inesperado",
            "detalle": str(e)
        }
    


##Caso especial reactiva al empleado
def activarEmpleado(db: Session, empleadoActual):
    try:

        empleadoActual.activo=True
        empleadoActual.fecha_egreso=None
        
        db.commit()
        db.refresh(empleadoActual)

    #Si todo fue bien
        return {
            "mensaje": "Empleado Reactivado correctamente",
            "empleado_id": empleadoActual.id
        }

    except Exception as e:
        db.rollback()
        return {
            "error": "Error inesperado",
            "detalle": str(e)
        }
    

##Caso especial elimina al empleado
def eliminarEmpleado(db: Session, empleadoActual):
    try:

        fecha_actual=datetime.date.today()
        if(empleadoActual.activo==True):
            empleadoActual.activo=False
            empleadoActual.fecha_egreso=fecha_actual
        
        empleadoActual.f_hasta=fecha_actual

        db.commit()
        db.refresh(empleadoActual)

    #Si todo fue bien
        return {
            "mensaje": "Empleado Eliminado correctamente",
            "empleado_id": empleadoActual.id
        }

    except Exception as e:
        db.rollback()
        return {
            "error": "Error inesperado",
            "detalle": str(e)
        }
    


def serialize_asignaciones(e: Empleado):
    
    return {
        "area":e.area_id,
        "puesto":e.puesto_id
    }