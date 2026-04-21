from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy import text
from database import engine
from fastapi import Query

from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy import text
from database import engine
from fastapi import Query
import math
from sqlalchemy.orm import Session
from sqlalchemy import or_, func, distinct

from dependencies.get_db import get_db
from services.empleado_service import *
from services.reporte_service import *
from services.area_puesto_compatible_service import *

from models import Empleado, Area,Puesto, EmpleadoAreaPuesto

from sqlalchemy.orm import joinedload
import datetime
from dependencies.auth import get_current_user

router = APIRouter(
    prefix="/resumen",
    dependencies=[Depends(get_current_user)],
    tags=["Reportes"]
)

@router.get("/activos")
def activosPorArea( db: Session = Depends(get_db)):
    try:
        result = query_activos(db)
        otros= db.query(
            func.count().filter(Empleado.f_hasta != None).label("eliminados")
            ).one()
        
        return {
            "total": result.total,
            "activos": result.activos,
            "inactivos": result.inactivos,
            "eliminados": otros.eliminados
            }
    except Exception as e:
        print("ERROR REAL:", e) 
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
    

@router.get("/activosPorArea")
def activosPorArea( db: Session = Depends(get_db)):
    try:
        result=query_activos_por_area(db)

        data = [
            {
            "area": row[0],
            "activos": row[1],
            "inactivos": row[2],
        }
        for row in result
        ]
        return data

    except Exception as e:
        print("ERROR REAL:", e) 
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
    

@router.get("/activosPorPuesto")
def activosPorArea( db: Session = Depends(get_db)):
    try:
        result=query_activos_por_puesto(db)

        data = [
            {
            "puesto": row[0],
            "activos": row[1],
            "inactivos": row[2],
        }
        for row in result
        ]
        return data

    except Exception as e:
        print("ERROR REAL:", e) 
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
    
@router.get("/antiguedad")
def antiguedad( db: Session = Depends(get_db)):
    try:
        result=query_antiguedad(db)
        return result

    except Exception as e:
        print("ERROR REAL:", e) 
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )