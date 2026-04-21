import math
from sqlalchemy.orm import Session, joinedload
from models.areaPuestoCompatible import AreaPuestoCompatible
from models.area import Area
from models.puesto import Puesto
from fastapi import HTTPException
from sqlalchemy.orm import selectinload
from sqlalchemy.exc import IntegrityError
import datetime

# -----------------------------
# BASE QUERY
def query_area_puesto_compatible(db: Session):
  
    result = db.query(AreaPuestoCompatible).options(
        joinedload(AreaPuestoCompatible.area),
        joinedload(AreaPuestoCompatible.puesto)
    ).all()
    return result
