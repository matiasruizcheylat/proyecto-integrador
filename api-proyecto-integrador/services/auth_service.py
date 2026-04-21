import os
from datetime import datetime, timedelta
from jose import jwt
from fastapi import HTTPException
from core.config import settings
from core.security import verify_password
from dotenv import load_dotenv

from sqlalchemy.orm import Session
from dependencies.sesionDatabase import get_db
from models.usuario import Usuario
from core.config import Settings

load_dotenv(override=True)

# Usuario fake (luego lo cambiás por DB)
user = {
    "username": os.getenv("USER_NAME"),
    "password": os.getenv("PASSWORD")
}

def authenticate_user(db: Session, username: str, password: str):
    user = db.query(Usuario).filter(
        Usuario.username == username,
        Usuario.activo == True
    ).first()
    if not user:
        return None

    if not verify_password(password, user.password_hash):
        return None

    return user


def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=60)
    to_encode.update({"exp": expire})

    return jwt.encode(to_encode, Settings.SECRET_KEY, algorithm="HS256")