from sqlalchemy import Column, Integer, String, Boolean, DateTime,  PrimaryKeyConstraint, UniqueConstraint
from datetime import datetime

from .base import Base  # ajustá el import si tu Base está en otro lado


class Usuario(Base):
    __tablename__ = "usuarios"
    __table_args__ = (
        PrimaryKeyConstraint('id', name='usuarios_pkey'),
        UniqueConstraint('username', name='usuarios_username_key'),
        {'schema': 'empleados'}
    )

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False, index=True)
    password_hash = Column(String, nullable=False)
    activo = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    def __repr__(self):
        return f"<Usuario(id={self.id}, username='{self.username}', activo={self.activo})>"