# Ejercicio 1 — Gestión de errores centralizada (API Films)

## Objetivo

Implementar la gestión de errores para la **API Films** usando la clase `AppError` y un middleware centralizado que transforme errores lanzados en respuestas HTTP coherentes.

## Tareas

1. Crear o reutilizar la clase `AppError`.
2. Implementar un middleware de errores (`src/middlewares/error.middleware.ts`).
3. Modificar los controladores/servicios de la API Films para lanzar `AppError` en casos concretos (ejemplos)
4. Registrar el middleware de errores **al final** del pipeline de Express (después de las rutas).
5. Probar que las rutas devuelven los códigos y cuerpos correctos cuando se lanza `AppError`, y que los errores inesperados devuelven `500`.
