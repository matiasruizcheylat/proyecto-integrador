from fastapi import APIRouter, Depends
from schemas.usuario import LoginRequest, TokenResponse
from services.auth_service import authenticate_user, create_access_token
from dependencies.auth import verify_token


from sqlalchemy.orm import Session
from dependencies.sesionDatabase import get_db

router = APIRouter(prefix="", tags=["home"])

