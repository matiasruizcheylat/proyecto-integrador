from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy import text
from database import engine
from fastapi import Query


from services.empleado_service import *
from services.area_puesto_compatible_service import *


from schemas.area_puesto_compatible import AreaPuestoCompatibleOut
from sqlalchemy.orm import joinedload
import datetime

router = APIRouter(prefix="", tags=["Health"])

@router.get("/health")
def health_check():
    try:
        with engine.connect() as conn:
            conn.execute(text("SET client_encoding TO 'UTF8'"))
            conn.execute(text("SELECT 1"))
        return {"status": "ok"}
    except Exception as e:
        print("ERROR REAL:", e) 
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
    