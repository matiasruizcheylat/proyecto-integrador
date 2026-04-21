#Create
from pydantic import BaseModel, EmailStr, validator
from typing import Optional
from datetime import date
from typing import List

class AsignacionCreate(BaseModel):
    area_id: int
    puesto_id: int

class EmpleadoCreate(BaseModel):
    nombre: str
    apellido: str
    documento: int
    fecha_nacimiento: date
    email: EmailStr
    telefono: Optional[str] = None
    asignaciones: List[AsignacionCreate]
    

    @validator("nombre", "apellido")
    def no_vacios(cls, v):
        if not v.strip():
            raise ValueError("No puede estar vacío")
        return v
  
    @validator("documento", pre=True)
    def validar_documento(cls, v):

        #  viene como string
        if isinstance(v, str):
            if not v.isdigit():
                raise ValueError("El documento debe ser numérico")
            return int(v)

        # ya es número
        if isinstance(v, int):
            return v

        raise ValueError("Tipo de documento no válido")
    

    @validator("*", pre=True)
    def empty_strings_to_none(cls, v):
        if isinstance(v, str) and v.strip() == "":
            return None
        return v
    

    @validator("fecha_nacimiento", pre=True)
    def parse_fecha(cls, v):
        from datetime import datetime

        formatos = ["%Y-%m-%d", "%d/%m/%Y"]

        for fmt in formatos:
            try:
                return datetime.strptime(v, "%Y-%m-%d").date()
            except:
                continue

        raise ValueError("Formato inválido")


    @validator("fecha_nacimiento")
    def validar_fecha(cls, v):
        from datetime import date

        if v > date.today():
            raise ValueError("No puede ser futura")

        if v.year < 1930:
            raise ValueError("Fecha de nacimiento no válida (muy antigua)")
        
        return v

    @validator("asignaciones")
    def no_vacios(cls, v):
        if not v:
            raise ValueError("Debe tener al menos una asignacion")
        return v
    




class EmpleadoUpdate(BaseModel):
    nombre: str = None
    apellido: str = None
    nro_documento: int = None
    fecha_nacimiento: date = None
    email: EmailStr = None
    telefono: Optional[str] = None
    asignaciones: List[AsignacionCreate]
    

    @validator("nombre", "apellido")
    def no_vacios(cls, v):
        if not v.strip():
            raise ValueError("No puede estar vacío")
        return v
  
    @validator("nro_documento", pre=True)
    def validar_documento(cls, v):

        #  viene como string
        if isinstance(v, str):
            if not v.isdigit():
                raise ValueError("El documento debe ser numérico")
            return int(v)

        # ya es número
        if isinstance(v, int):
            return v

        raise ValueError("Tipo de documento no válido")
    

    @validator("*", pre=True)
    def empty_strings_to_none(cls, v):
        if isinstance(v, str) and v.strip() == "":
            return None
        return v
    

    @validator("fecha_nacimiento", pre=True)
    def parse_fecha(cls, v):
        from datetime import datetime

        formatos = ["%Y-%m-%d", "%d/%m/%Y"]

        for fmt in formatos:
            try:
                return datetime.strptime(v, "%Y-%m-%d").date()
            except:
                continue

        raise ValueError("Formato inválido")


    @validator("fecha_nacimiento")
    def validar_fecha(cls, v):
        from datetime import date

        if v > date.today():
            raise ValueError("No puede ser futura")

        if v.year < 1930:
            raise ValueError("Fecha de nacimiento no válida (muy antigua)")
        
        return v

