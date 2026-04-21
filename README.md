#  Proyecto Integrador - Portal de Trámites

Aplicación web fullstack para la gestión y visualización de servicios y trámites, con autenticación de usuarios mediante JWT.

---

##  Demo

 (Agregar link cuando esté deployado)

---


##  Objetivo del proyecto

Este proyecto fue desarrollado como práctica integradora fullstack con el objetivo de:

* Implementar autenticación basada en JWT
* Consumir una API REST
* Construir una SPA con React + TypeScript
* Aplicar buenas prácticas de organización y arquitectura

---

##  Funcionalidades

*  Login de usuarios
*  Consumo de API REST
*  Navegación con rutas protegidas
*  Visualización de servicios
*  Manejo de estado y carga de datos

---

##  Tecnologías

### Frontend

* React
* TypeScript
* Vite
* React Router DOM

### Backend

* FastAPI
* PostgreSQL
* JWT (python-jose)
* Passlib (bcrypt)

---

##  Estructura del proyecto

```
/
├── web-proyecto-integrador   # Frontend
├── api-proyecto-integrador   # Backend
└── database                  # Scripts SQL
```

---

##  Instalación

### 1. Clonar repositorio

```bash
git clone https://github.com/matiasruizcheylat/proyecto-integrador.git
```

---

### 2. Frontend

```bash
cd web-proyecto-integrador
npm install
npm run dev
```

Aplicación disponible en:

```
http://localhost:8000
```

---

### 3. Backend

```bash
cd api-proyecto-integrador
pip install -r requirements.txt
uvicorn main:app --reload --port 8001
```

---

### 4. Base de datos

* Crear base de datos en PostgreSQL
* Ejecutar scripts dentro de `/database/schema.sql`

---

## Autenticación

El sistema utiliza JWT:

* El usuario inicia sesión y recibe un token
* El frontend almacena el token
* Cada request lo envía en el header:

```
Authorization: Bearer <token>
```

---

##  Variables de entorno

### Frontend (`.env`)

```
VITE_API_URL=http://localhost:8000
```

---

##  Estructura del frontend

```
src/
├── api/            
├── components/     
├── pages/          
├── router/         
├── types/          
└── App.tsx
```

---

##  Mejoras futuras

* Deploy en producción
* Manejo global de estado
* Refresh token
* Tests automatizados

---

##  Autor

Carlos Matías Ruiz Cheylat
