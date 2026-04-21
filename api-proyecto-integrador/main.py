import os
from core.security import verify_password
os.environ["PYTHONIOENCODING"] = "utf-8"
os.environ["PGCLIENTENCODING"] = "utf8"

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth
from routers import home
from routers import health
from routers import employs
from routers import reportes
from dotenv import load_dotenv

app = FastAPI()

app.include_router(auth.router)
app.include_router(home.router)
app.include_router(health.router)
app.include_router(employs.router)
app.include_router(reportes.router)

load_dotenv()
from core.security import *



#  CONFIGURACIÓN CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("HOST_FRONT")],  # después lo podemos restringir
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
   
    return {"msg": "Hola backend"}