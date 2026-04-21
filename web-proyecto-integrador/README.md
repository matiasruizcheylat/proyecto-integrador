#  Web Proyecto Integrador

Aplicación frontend desarrollada con **React + TypeScript + Vite**.
Consume una API REST para la gestión y visualización de servicios y trámites, 
incluyendo autenticación de usuarios.

---

##  Tecnologías

* React
* TypeScript
* Vite
* React Router DOM

---

##  Requisitos

* Node.js (recomendado 18+)
* npm

---

##  Instalación

Clonar el repositorio y acceder al directorio del frontend:

```
git clone https://github.com/matiasruizcheylat/proyecto-integrador.git
cd web-proyecto-integrador
```

Instalar dependencias:

```
npm install
```

---

##  Ejecutar la aplicación

```bash 
npm run dev
```

La aplicación estará disponible en:

```
http://localhost:8000
```

---

##  Enrutamiento

Se utiliza `react-router-dom` para la navegación entre vistas.

Instalar (si es necesario):

```bash
npm install react-router-dom
```

---

##  Autenticación

La aplicación consume una API que maneja autenticación mediante JWT.

Flujo general:

* El usuario inicia sesión
* Se recibe un token desde la API
* El token se almacena en el frontend
* Se envía en cada request

```
Authorization: Bearer <token>
```

---

## 🌍 Variables de entorno

Crear un archivo `.env` en la raíz del proyecto:

```
VITE_API_URL=http://localhost:8001
```

👉 Esta variable define la URL base de la API

---

##  Estructura del proyecto

```id="o9n3xq"
src/
├── api/            # Cliente HTTP / llamadas a la API
├── components/     # Componentes reutilizables
├── pages/          # Vistas principales
├── router/         # Configuración de rutas
├── types/          # Tipos TypeScript
└── App.tsx
```

---

##  Scripts disponibles

```bash id="2r0n8f"
npm run dev       # Servidor de desarrollo
npm run build     # Build de producción
npm run preview   # Preview del build
```

---

##  Notas

* Asegurarse de que la API esté corriendo antes de iniciar sesión
* Verificar correctamente la variable `VITE_API_URL`
* Mantener el proyecto organizado por módulos (components, pages, api, etc.)

---

##  Autor

Proyecto integrador desarrollado como práctica frontend con React + TypeScript.
