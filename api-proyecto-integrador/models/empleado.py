from typing import Optional
import datetime

from sqlalchemy import Boolean, Date, DateTime, ForeignKeyConstraint, Identity, Integer, PrimaryKeyConstraint, Sequence, String, UniqueConstraint, text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .empleadoAreaPuesto import EmpleadoAreaPuesto


class Empleado(Base):
    __tablename__ = 'empleado'
    __table_args__ = (
        PrimaryKeyConstraint('id', name='empleado_pkey'),
        UniqueConstraint('email', name='empleado_email_key'),
        UniqueConstraint('nro_documento', name='empleado_nro_documento_key'),
        {'schema': 'empleados'}
    )

    id: Mapped[int] = mapped_column(Integer, Identity(always=True, start=1, increment=1, minvalue=1, maxvalue=2147483647, cycle=False, cache=1), primary_key=True)
    nombre: Mapped[str] = mapped_column(String(100), nullable=False)
    apellido: Mapped[str] = mapped_column(String(100), nullable=False)
    nro_documento: Mapped[str] = mapped_column(String(20), nullable=False)
    fecha_nacimiento: Mapped[datetime.date] = mapped_column(Date, nullable=False)
    email: Mapped[str] = mapped_column(String(150), nullable=False)
    fecha_ingreso: Mapped[datetime.date] = mapped_column(Date, nullable=False)
    telefono: Mapped[Optional[str]] = mapped_column(String(20))
    activo: Mapped[Optional[bool]] = mapped_column(Boolean, server_default=text('true'))
    fecha_egreso: Mapped[Optional[datetime.date]] = mapped_column(Date)
    f_hasta: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime(True))

    empleado_area_puesto: Mapped[list['EmpleadoAreaPuesto']] = relationship(
        'EmpleadoAreaPuesto',
        back_populates='empleado',
        cascade="all, delete-orphan"
    )
