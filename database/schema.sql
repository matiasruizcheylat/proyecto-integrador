
-- Database connection schema


DROP DATABASE IF EXISTS "userRsa";


CREATE DATABASE "userRsa";

\connect "userRsa"


CREATE SCHEMA IF NOT EXISTS empleados;

--Tables

CREATE TABLE empleados.area (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE
);


CREATE TABLE empleados.puesto (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE
);


CREATE TABLE empleados.empleado (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    nro_documento VARCHAR(20) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    email VARCHAR(150) NOT NULL,
    telefono VARCHAR(20),
    activo BOOLEAN DEFAULT true,
    fecha_ingreso DATE NOT NULL,
    fecha_egreso DATE,
    f_hasta TIMESTAMP
);


CREATE TABLE empleados.usuarios (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE empleados.area_puesto_compatible (
    id SERIAL PRIMARY KEY,
    area_id INTEGER NOT NULL,
    puesto_id INTEGER NOT NULL,
    FOREIGN KEY (area_id) REFERENCES empleados.area(id),
    FOREIGN KEY (puesto_id) REFERENCES empleados.puesto(id)
);


CREATE TABLE empleados.empleado_area_puesto (
    id SERIAL PRIMARY KEY,
    empleado_id INTEGER NOT NULL,
    area_id INTEGER NOT NULL,
    puesto_id INTEGER NOT NULL,
    f_hasta DATE,
    FOREIGN KEY (empleado_id) REFERENCES empleados.empleado(id),
    FOREIGN KEY (area_id) REFERENCES empleados.area(id),
    FOREIGN KEY (puesto_id) REFERENCES empleados.puesto(id)
);


-- Indexes


CREATE UNIQUE INDEX empleado_email_key ON empleados.empleado USING btree (email) WHERE (f_hasta IS NULL);

CREATE UNIQUE INDEX empleado_nro_documento_key ON empleados.empleado USING btree (nro_documento) WHERE (f_hasta IS NULL);

CREATE UNIQUE INDEX uq_empleado_area_puesto_activo ON empleados.empleado_area_puesto USING btree (empleado_id, area_id, puesto_id) WHERE (f_hasta IS NULL);

