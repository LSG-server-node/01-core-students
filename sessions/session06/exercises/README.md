# Ejercicio: Mostrar una película vía API

Utiliza la API creada en la clase anterior para realizar este ejercicio.

## Objetivo

Crear una ruta para obtener una película a través de su ID desde un array en memoria (que usaremos como BBDD).

## Requisitos

- **Ruta:** `mydominio/api/v1/films/:id`
- **Método HTTP:** `GET`
- **Origen de datos:** un array en memoria con varias películas creadas manualmente.
- **Respuesta:** devolver **solo** los campos:
  - `id`
  - `title`
  - `releasedDate`
  - `director`

> Nota: En cada película se puede guardar información adicional (por ejemplo `createdAt`, `updatedAt`), pero **no** debe incluirse en la respuesta.

## Esquema de datos (ejemplo en memoria)

```json
[
  {
    "id": 1,
    "title": "The Example Movie",
    "releasedDate": "2020-05-12",
    "director": "Jane Doe",
    "createdAt": "2020-05-01T10:00:00Z",
    "updatedAt": "2020-05-10T12:30:00Z"
  },
  {
    "id": 2,
    "title": "Another Example",
    "releasedDate": "2021-03-08",
    "director": "John Smith",
    "createdAt": "2021-03-01T09:15:00Z",
    "updatedAt": "2021-03-05T14:45:00Z"
  }
]
```
