from pydantic import BaseModel

class AreaOut(BaseModel):
    id: int
    nombre: str

    model_config = {"from_attributes": True}


class PuestoOut(BaseModel):
    id: int
    nombre: str

    model_config = {"from_attributes": True}


class AreaPuestoCompatibleOut(BaseModel):
    id: int
    area: AreaOut
    puesto: PuestoOut

    model_config = {"from_attributes": True}