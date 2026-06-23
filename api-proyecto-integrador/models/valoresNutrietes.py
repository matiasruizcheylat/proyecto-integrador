from sqlalchemy import Column
from sqlalchemy import BigInteger
from sqlalchemy import DateTime
from sqlalchemy import Float
from sqlalchemy.sql import func

from .base import Base

class ValoresNutrientes(Base):
    __tablename__ = "valores_nutrientes"
    __table_args__ = {"schema": "empleados"}


    id = Column(
        BigInteger,
        primary_key=True,
        autoincrement=True
    )

    fecha_hora = Column(
        DateTime,
        nullable=False
    )

    valor_1 = Column(Float)
    valor_2 = Column(Float)
    valor_3 = Column(Float)
    valor_4 = Column(Float)

    