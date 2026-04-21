from typing import Optional
import datetime

from sqlalchemy import Boolean, Date, DateTime, ForeignKeyConstraint, Identity, Integer, PrimaryKeyConstraint, Sequence, String, UniqueConstraint, text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .empleadoAreaPuesto import EmpleadoAreaPuesto
    from .areaPuestoCompatible import AreaPuestoCompatible


class Puesto(Base):
    __tablename__ = 'puesto'
    __table_args__ = (
        PrimaryKeyConstraint('id', name='puesto_empleado_pkey'),
        UniqueConstraint('nombre', name='puesto_empleado_nombre_key'),
        {'schema': 'empleados'}
    )

    id: Mapped[int] = mapped_column(Integer, Sequence('puesto_empleado_id_seq', schema='empleados'), primary_key=True)
    nombre: Mapped[str] = mapped_column(String(100), nullable=False)

    empleado_area_puesto: Mapped[list['EmpleadoAreaPuesto']] = relationship('EmpleadoAreaPuesto', back_populates='puesto')
    area_puesto_compatible: Mapped[list['AreaPuestoCompatible']] = relationship('AreaPuestoCompatible', back_populates='puesto')