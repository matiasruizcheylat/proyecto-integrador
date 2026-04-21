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


class AreaPuestoCompatible(Base):
    __tablename__ = 'area_puesto_compatible'
    __table_args__ = (
        ForeignKeyConstraint(['area_id'], ['empleados.area.id'], ondelete='CASCADE', name='fk_area'),
        ForeignKeyConstraint(['puesto_id'], ['empleados.puesto.id'], ondelete='CASCADE', name='fk_puesto'),
        PrimaryKeyConstraint('id', name='empleado_area_compatible_pkey'),
        {'schema': 'empleados'}


    )

    id: Mapped[int] = mapped_column(Integer, Identity(always=True, start=1, increment=1, minvalue=1, maxvalue=2147483647, cycle=False, cache=1), primary_key=True)
    puesto_id: Mapped[int] = mapped_column(Integer, nullable=False)
    area_id: Mapped[int] = mapped_column(Integer, nullable=False)


    area: Mapped['Area'] = relationship('Area', back_populates='area_puesto_compatible')
    puesto: Mapped['Puesto'] = relationship('Puesto', back_populates='area_puesto_compatible')

