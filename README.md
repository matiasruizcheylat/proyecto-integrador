#  Proyecto Integrador -  Full Stack

Aplicación web fullstack para la gestión y visualización de servicios y trámites, con autenticacion de usuarios basado en JWT
---

# Proyecto Integrador

Sistema de gestión de empleados desarrollado con React, FastAPI y PostgreSQL.

## 🚀 Demo Online

URL: https://proyecto-integrador-eight-gray.vercel.app/home

**Usuario:** `demo`  
**Contraseña:** `demo123`

## 📸 Capturas

### Login
![Login](demo-capturas/login.png)

### Gestión de empleados
![Listado](demo-capturas/empleados-listado.png)

### Alta de empleado
![Alta](demo-capturas/empleado-alta.png)

### Detalle de empleado
![Detalle](demo-capturas/empleado-detalle.png)

### Reportes
![Reportes](demo-capturas/reportes-dashboard.png)

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
* JWT (python)
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

Aplicación local disponible en:

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
