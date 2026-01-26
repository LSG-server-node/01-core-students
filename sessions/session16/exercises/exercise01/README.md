# 📝 Ejercicio — Registro y Login con JWT en la API de _Films_

## 🎯 Objetivo

Añadir **autenticación básica con JWT** a la API de _Films_ mediante **registro y login de usuarios**, generando tokens de acceso, **sin proteger todavía las rutas de Films**.

---

## 📋 Tareas

### 1️⃣ Registro de usuarios (`POST /auth/register`)

- Permite registrar un nuevo usuario con:
  - `email`
  - `password`
- La contraseña debe guardarse **hasheada**.
- **Tras el registro**, el usuario debe:
  - quedar **automáticamente logueado**,
  - recibir un **JWT válido** en la respuesta.

---

### 2️⃣ Login de usuarios (`POST /auth/login`)

- Permite iniciar sesión con `email` y `password`.
- Si las credenciales son correctas:
  - genera y devuelve un **JWT**.
- Si son incorrectas:
  - devuelve un error adecuado (`401`).

---

### 3️⃣ Generación de JWT

- El token debe:
  - generarse usando una **clave secreta** almacenada en variables de entorno,
  - incluir al menos el `id` del usuario,
  - tener un tiempo de expiración configurado de `1min`.
