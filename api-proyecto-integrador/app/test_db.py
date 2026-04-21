from sqlalchemy import text
from database import engine

def test_connection():
    try:
        with engine.connect() as connection:
            result = connection.execute(text("SELECT 1"))
            print("✅ Conectado a la base de datos")
    except Exception as e:
        print("❌ Error de conexión:", e)