# 🏋️‍♂️ Plataforma de Reservas y Membresías - FitHub

## 📌 Descripción del proyecto

Este proyecto consiste en el desarrollo de un backend para la gestión de una plataforma de centros deportivos (FitHub), donde se pueden manejar:

* Registro de personas
* Gestión de clientes y entrenadores
* Creación de sedes
* Creación de actividades
* Sistema de reservas con validaciones

El backend está construido con **Node.js + Express** y utiliza **PostgreSQL (Supabase)** como base de datos.

---

## 🧱 Tecnologías utilizadas

* Node.js
* Express
* PostgreSQL
* Supabase
* Postman (para pruebas)
* Git & GitHub

---

## 🗄️ Estructura de la base de datos

El sistema está compuesto por las siguientes tablas principales:

* `persona`
* `cliente`
* `entrenador`
* `sede`
* `actividad`
* `reserva`
* `pago`
* `membresia`

Relaciones importantes:

* `cliente` → referencia a `persona`
* `entrenador` → referencia a `persona`
* `actividad` → referencia a `sede` y `entrenador`
* `reserva` → referencia a `cliente` y `actividad`

---

## ⚙️ Configuración del proyecto

### 1. Clonar repositorio

```bash
git clone <URL_DEL_REPO>
cd <NOMBRE_DEL_PROYECTO>
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
DB_USER=postgres
DB_HOST=aws-0-us-west-2.pooler.supabase.com
DB_NAME=postgres
DB_PASSWORD=TU_PASSWORD
DB_PORT=5432
```

---

## 🔌 Conexión a Supabase

Para conectar el backend con Supabase se utilizó la librería `pg`.

Archivo: `db/index.js`

```javascript
import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  connectionString: "postgresql://postgres.[PROJECT_REF]:TU_PASSWORD@aws-0-us-west-2.pooler.supabase.com:5432/postgres",
  ssl: {
    rejectUnauthorized: false
  }
});

export default pool;
```

### ⚠️ Cambios importantes realizados

Durante la conexión se realizaron los siguientes ajustes:

* Se utilizó **connection string con pooler de Supabase**
* Se activó SSL:

```javascript
ssl: { rejectUnauthorized: false }
```

* Se evitó usar conexión directa porque Supabase no es compatible con IPv4 en ese modo
* Se validó la conexión con el endpoint:

```http
GET http://localhost:3000/db-test
```

---

## 🚀 Ejecución del servidor

```bash
npm run dev
```

Servidor corriendo en:

```text
http://localhost:3000
```

---

## 🔍 Endpoint de prueba de conexión

```http
GET /db-test
```

Respuesta esperada:

```json
[{"now": "2026-03-24T00:45:09.170Z"}]
```

---

## 📥 Endpoints principales

### 🔹 Crear persona

```http
POST /personas
```

Body:

```json
{
  "nombre": "Juan Perez",
  "correo": "juan@gmail.com",
  "fecha_nacimiento": "2000-01-01",
  "telefono": "99999999",
  "dir_departamento": "Francisco Morazan",
  "dir_ciudad": "Tegucigalpa",
  "dir_colonia": "Palmira",
  "dir_calle_ave": "Avenida La Paz"
}
```

---

### 🔹 Crear reserva

```http
POST /reservas
```

Body:

```json
{
  "cliente_id": 11,
  "actividad_id": 1,
  "precio_aplicado": 150.00,
  "observacion": "Reserva prueba"
}
```

---

## 🧠 Validaciones implementadas

### ✔ Validación de datos de usuario

* Nombre no vacío
* Correo válido
* Teléfono válido

### ✔ Validación de reserva duplicada

* Un cliente no puede reservar la misma actividad más de una vez

### ✔ Validación de cupo

* No se permite reservar si la actividad está llena

---

## 🗃️ Seed de base de datos

El archivo `sql/seed.sql` contiene:

* Inserción de personas
* Inserción de clientes
* Inserción de entrenador
* Inserción de sede

⚠️ Se evitó hardcodear IDs usando consultas dinámicas.

---

## 🧪 Pruebas realizadas

Se utilizó Postman para validar:

* Creación de personas
* Creación de reservas
* Error por reserva duplicada
* Error por cupo lleno
* Error por datos inválidos

---

## ⚠️ Problemas encontrados y solución

### ❌ Error: Foreign key

* Causa: uso de IDs inexistentes
* Solución: usar `SELECT` para obtener IDs reales

### ❌ Error: conexión a BD

* Causa: uso de conexión directa
* Solución: usar **Supabase Pooler**

### ❌ Error: req.body undefined

* Causa: no enviar JSON en Postman
* Solución: usar `Body → raw → JSON`

---

## 📦 Estructura del proyecto

```
/db
  index.js
/middleware
  validation.js
  errorHandler.js
/routes
  reserva.js
/sql
  seed.sql
server.js
.env
README.md
```

---

## 👨‍💻 Autor

Proyecto desarrollado por:

**Elmer Darío Izaguirre Flores**

---

## ✅ Estado del proyecto

✔ Backend funcional
✔ Conexión a Supabase
✔ Validaciones implementadas
✔ Endpoints probados
✔ Listo para entrega

---
