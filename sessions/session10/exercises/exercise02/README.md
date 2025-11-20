# Ejercicio 2 — Middleware de Tiempo de Ejecución

## Objetivo

Implementar un **middleware personalizado** que mida el **tiempo que tarda cada petición** en completarse y lo muestre por consola con este formato:

```text
GET /users → 5ms
```

## Tareas

1. Crea un middleware que:

   - guarde la hora de inicio cuando llega la petición,
   - escuche el evento `res.on("finish")`,
   - calcule el tiempo total de la petición,
   - imprima por consola:
     `METHOD URL → Xms`.

2. Añade el middleware como **global** en la aplicación Express antes de las rutas.

3. Realiza al menos **dos peticiones** (GET y POST) y comprueba que en la consola aparece el tiempo correspondiente.

4. No es necesario modificar ningún controlador ni ninguna ruta.

## Resultado esperado (ejemplo de consola)

```text
GET /products → 3ms
POST /users → 11ms
GET /users → 2ms
```

## Consigna importante

- No añadas ninguna dependencia externa.
- El middleware debe usar únicamente `Date.now()` y `res.on("finish")`.
