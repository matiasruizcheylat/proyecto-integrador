from typing import Optional
import datetime

from sqlalchemy import Boolean, Date, DateTime, ForeignKeyConstraint, Identity, Integer, PrimaryKeyConstraint, Sequence, String, UniqueConstraint, text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .empleado import Empleado
    from .puesto import Puesto
    from .area import Area


class EmpleadoAreaPuesto(Base):
    __tablename__ = 'empleado_area_puesto'
    __table_args__ = (
        ForeignKeyConstraint(['area_id'], ['empleados.area.id'], ondelete='CASCADE', name='fk_empleado_area_puesto_area'),
        ForeignKeyConstraint(['empleado_id'], ['empleados.empleado.id'], ondelete='CASCADE', name='fk_empleado_area_puesto_empleado'),
        ForeignKeyConstraint(['puesto_id'], ['empleados.puesto.id'], ondelete='CASCADE', name='fk_empleado_area_puesto_puesto'),
        PrimaryKeyConstraint('id', name='empleado_area_puesto_pkey'),
        UniqueConstraint('area_id', 'empleado_id', 'puesto_id', name='uq_empleado_area_puesto'),
        {'schema': 'empleados'}


    )

    id: Mapped[int] = mapped_column(Integer, Identity(always=True, start=1, increment=1, minvalue=1, maxvalue=2147483647, cycle=False, cache=1), primary_key=True)
    empleado_id: Mapped[int] = mapped_column(Integer, nullable=False)
    puesto_id: Mapped[int] = mapped_column(Integer, nullable=False)
    area_id: Mapped[int] = mapped_column(Integer, nullable=False)
    f_hasta: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime(True))


    area: Mapped['Area'] = relationship('Area', back_populates='empleado_area_puesto')
    empleado: Mapped['Empleado'] = relationship('Empleado', back_populates='empleado_area_puesto')
    puesto: Mapped['Puesto'] = relationship('Puesto', back_populates='empleado_area_puesto')

