# Ejercicio — Validaciones con Joi en la API

## Objetivo

Añadir **validación de datos** a la API de _Films_ utilizando **Joi**, crear un middleware de validación reutilizable, **actualizar la base de datos** con nuevos campos y **validar la ID** recibida por URL en los endpoints que la utilicen.

## Tareas

1. **Instala Joi** en el proyecto.

2. **Actualiza la base de datos (o el array en memoria)** para que cada película incluya los siguientes campos:

   - `title`: string
   - `year`: number
   - `director`: string
   - `rating`: number
   - `duration`: number (minutos)
   - `posterUrl`: string (URL del póster)
   - `cast`: array de strings
   - `synopsis`: string
   - `genres`: array de strings

   > Al usar un array, añade estos campos a todas las películas existentes.

3. Crea un **esquema Joi** para validar una película con las siguientes reglas:

   - `title`: string obligatorio
   - `year`: número obligatorio
   - `director`: string obligatorio
   - `rating`: número opcional entre 0 y 10
   - `duration`: número obligatorio
   - `posterUrl`: string obligatoria y debe ser una URL válida
   - `cast`: array de strings (mínimo 1 elemento)
   - `synopsis`: string opcional con máximo 500 caracteres
   - `genres`: array de strings (mínimo 1 elemento)

4. Crea un **middleware genérico de validación para el body** que:

   - reciba un esquema Joi,
   - valide `req.body`,
   - si los datos no son válidos → responda con **400**,
   - si son válidos → reemplace `req.body` y llame a `next()`.

5. **Valida también la ID recibida en la URL** en los endpoints que la utilicen (`GET /films/:id`, `PUT /films/:id`, `DELETE /films/:id`):

   - La ID debe ser un número válido y positivo.
   - Crea un esquema Joi para validar `req.params`.
   - Crea un middleware de validación para parámetros (similar al del body).
   - Si la ID no es válida, devolver **400**.

6. Aplica los middlewares:

   - **POST /films** → valida el body.
   - **PUT /films/:id** → valida la ID + valida el body.
   - **GET /films/:id** → valida la ID.
   - **DELETE /films/:id** → valida la ID.

7. Comprueba manualmente que:
   - si faltan campos → 400,
   - si hay tipos incorrectos → 400,
   - si la ID no es válida → 400,
   - si todo es correcto → las películas se crean, actualizan o eliminan correctamente.

## Resultado esperado (ejemplo de error)

```json
{
  "error": "Validation failed",
  "details": [
    "'id' must be a number",
    "'posterUrl' must be a valid uri",
    "'cast' must contain at least 1 items"
  ]
}
```

## Consigna importante

- No modifiques los controladores.
- Toda la validación debe hacerse en los **middlewares con Joi**.
- Asegúrate de que la base de datos incluye todos los nuevos campos.
- La validación de la ID es obligatoria en todos los endpoints que reciban `:id`.
