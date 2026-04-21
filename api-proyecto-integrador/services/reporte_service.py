import math
from sqlalchemy.orm import Session, joinedload
from models.empleado import Empleado
from models.empleadoAreaPuesto import EmpleadoAreaPuesto
from models.area import Area
from models.puesto import Puesto
from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy import or_, func, distinct
from sqlalchemy import text


def query_activos(db: Session):
    return db.query(
            func.count().label("total"),
            func.count().filter(Empleado.f_hasta == None).filter(Empleado.activo).label("activos"),
            func.count().filter(Empleado.f_hasta == None).filter(Empleado.activo==False ).label("inactivos")
            ).one()
    

def query_activos_por_area(db: Session):
    result = (
            db.query(
                Area.nombre.label("area"),
                
                func.count(distinct(Empleado.id))
                .filter(Empleado.f_hasta == None, Empleado.activo == True)
                .label("activos"),

                func.count(distinct(Empleado.id))
                .filter(Empleado.f_hasta == None, Empleado.activo == False)
                .label("inactivos"),
            )
            .join(EmpleadoAreaPuesto, EmpleadoAreaPuesto.empleado_id == Empleado.id)
            .join(Area, Area.id == EmpleadoAreaPuesto.area_id)
            .group_by(Area.nombre)
            .order_by(Area.nombre)
            .all()
        )
    return result


def query_activos_por_puesto(db: Session):
    result = (
            db.query(
                Puesto.nombre.label("puesto"),
                
                func.count(distinct(Empleado.id))
                .filter(Empleado.f_hasta == None, Empleado.activo == True)
                .label("activos"),

                func.count(distinct(Empleado.id))
                .filter(Empleado.f_hasta == None, Empleado.activo == False)
                .label("inactivos"),
            )
            .join(EmpleadoAreaPuesto, EmpleadoAreaPuesto.empleado_id == Empleado.id)
            .join(Puesto, Puesto.id == EmpleadoAreaPuesto.puesto_id)
            .group_by(Puesto.nombre)
            .order_by(Puesto.nombre)
            .all()
        )
    return result


def query_antiguedad(db: Session):
    query = text("""
        SELECT 
            AVG(EXTRACT(YEAR FROM AGE(CURRENT_DATE, fecha_ingreso))) AS promedio
        FROM empleados.empleado
        WHERE activo = true
    """)

    result = db.execute(query).mappings().first()

    return result