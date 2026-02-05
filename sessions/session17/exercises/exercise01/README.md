# 📝 Ejercicio — Protección de rutas con JWT

## 🎯 Objetivo

Proteger rutas de **Films** usando **JWT** y configurar el token para que **no sea válido inmediatamente**, gestionando correctamente ese caso en el middleware.

---

## 📋 Tareas

### 1️⃣ Login (`POST /auth/login`)

- Login con `email` + `password`.
- Credenciales incorrectas → `401`.
- `isBlocked === true` → `403` (no generar token).
- OK → devolver **JWT**.

---

### 2️⃣ Generación del JWT

Al firmar el token configura que se expira en `2h` y que no está disponible hasta dentro de `10min`. Busca que opciones harán falta definir.
