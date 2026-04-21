from fastapi import APIRouter, Depends, HTTPException
from schemas.usuario import LoginRequest, TokenResponse
from services.auth_service import authenticate_user, create_access_token
from dependencies.auth import verify_token



from sqlalchemy.orm import Session
from dependencies.sesionDatabase import get_db

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/login", response_model=TokenResponse)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = authenticate_user(db, data.username, data.password)

    if not user:
        raise HTTPException(status_code=401, detail="Credenciales inválidas")

    token = create_access_token({
        "sub": user.username,
        "user_id": user.id
    })

    return {"access_token": token}


