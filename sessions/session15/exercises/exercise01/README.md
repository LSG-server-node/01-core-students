# 📝 Ejercicio — BaseRepository con MongoDB y Mongoose

## 🎯 Objetivo

Refactorizar el repositorio de films para **eliminar código duplicado** mediante un **BaseRepository** que encapsule la lógica CRUD común, aplicando el principio DRY (Don't Repeat Yourself).

## ✔️ Requisitos

1. **Crea un `BaseRepository` abstracto** (`base.repository.ts`) que:

   - sea genérico y reutilizable para cualquier entidad,
   - implemente métodos CRUD comunes: `getAll`, `getById`, `create`, `update`, `delete`,
   - transforme automáticamente el `_id` de MongoDB a `id`,
   - use logging consistente con el nombre de la entidad.

2. **Refactoriza `FilmRepository`** para que:

   - herede de `BaseRepository`,
   - solo contenga métodos específicos de films (si los hay),
   - elimine toda la lógica CRUD duplicada.

3. **Mantén la funcionalidad existente**:

   - Los endpoints deben seguir funcionando exactamente igual,
   - No cambies la interfaz pública del repositorio.

4. **Implementa el CRUD completo de Director**: Crea `DirectorRepository` que:

   - herede de `BaseRepository`,
   - tenga un método específico `getByNationality(nationality: string)`,
   - demuestre la reutilización del código base,
   - **implementa los endpoints CRUD** (`GET`, `POST`, `PATCH`, `DELETE`) para directores,
   - usa el mismo patrón de respuesta que los films.

5. **Implementa búsqueda avanzada** en `BaseRepository`:

   - Añade un método `search(query: string, fields: string[])` que busque texto en múltiples campos,
   - Úsalo en `FilmRepository` para buscar por título y descripción.

6. **Bonus** (opcional):
   - Cambia el endpoint `PUT /films/:id` a `PATCH /films/:id` para actualizaciones parciales,
   - Añade paginación avanzada con `page` y `pageSize` en lugar de `skip` y `limit`,
   - Implementa un método `count(filters)` en `BaseRepository` para obtener el total de documentos.

## 🎨 Estructura sugerida para Director

```typescript
interface IDirector {
  id: string;
  name: string;
  nationality: string;
  birthYear: number;
  biography?: string;
}
```

> 💡 Puedes usar IA para ayudarte, pero debes adaptar el código a la estructura del proyecto y entender TODO lo que estás haciendo.

## 🤔 Preguntas de reflexión

- ¿Cuántas líneas de código has eliminado del `FilmRepository`?
- ¿Qué ventajas tiene usar herencia en este caso vs. composición?
- ¿Cómo facilitaría este patrón añadir una nueva entidad (ej: `Actor`)?

## 🚀 Desafío avanzado

- Implementa **soft delete**: en lugar de eliminar documentos, marca un campo `deletedAt`,
- Añade un método `restore(id)` para recuperar documentos eliminados,
- Modifica `getAll` para excluir automáticamente documentos con `deletedAt` no nulo.
