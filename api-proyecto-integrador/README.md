#  API Proyecto Integrador

API REST desarrollada con **FastAPI** para la gestión de empleados, áreas y puestos.
Incluye autenticación mediante JWT y persistencia en PostgreSQL.

---

##  Tecnologías

* FastAPI
* Python 3
* PostgreSQL
* JWT (python-jose)
* Passlib (bcrypt)

---

##  Requisitos

* Python 3.x
* pip
* PostgreSQL

---

##  Instalación

Clonar el repositorio y acceder al directorio de la API:

```bash
git clone <URL_DEL_REPOSITORIO>
cd api-proyecto-integrador
```

Crear entorno virtual:

```bash
python -m venv venv
```

Activar entorno virtual:

```bash
# Windows (cmd)
venv\Scripts\activate

# Git Bash / Linux / Mac
source venv/Scripts/activate
```

Instalar dependencias principales:

```bash
pip install fastapi uvicorn
```

---

## 🗄️ Configuración de base de datos

1. Crear una base de datos en PostgreSQL

2. Ejecutar los scripts:

```bash
schema.sql
data.sql
```

---

### 📜 Scripts disponibles

**Reset completo:**

```bash
drop.sql → schema.sql → data.sql
```

**Limpiar datos:**

```bash
truncate.sql → data.sql
```

---

##  Ejecutar la API

```bash
uvicorn main:app --reload
```

Puerto personalizado:

```bash
uvicorn main:app --reload --port 8001
```

---

##  Autenticación

La API utiliza autenticación basada en JWT.

Instalar dependencias:

```bash
pip install python-jose passlib[bcrypt] python-dotenv
```

Uso en requests:

```http
Authorization: Bearer <token>
```

---

##  Base de datos (PostgreSQL)

Instalar driver:

```bash
pip install psycopg2-binary
```

---

##  Generación de modelos (opcional)

```bash
pip install sqlacodegen
```

Ejemplo:

```bash
sqlacodegen postgresql://user:password@localhost/mi_db --schema empleados > models.py
```

---

##  Documentación automática

Disponible al ejecutar el servidor:

* Swagger UI → http://127.0.0.1:8000/docs
* ReDoc → http://127.0.0.1:8000/redoc

---

##  Variables de entorno

Crear un archivo `.env` en la raíz del proyecto.

* Usar `.env.example` como referencia
* Mantener la misma estructura de variables

---

##  Notas

* Ejecutar `schema.sql` antes de `data.sql`
* Verificar conexión a PostgreSQL
* Asegurar que el entorno virtual esté activo

---

##  Autor

Proyecto integrador desarrollado como práctica backend con FastAPI.
