# 📝 Ejercicio — Repository con MongoDB y Mongoose

## 🎯 Objetivo

Sustituir el almacenamiento en memoria (array) por un **Repository basado en MongoDB**, usando **Mongoose**, manteniendo la estructura actual de la API.

## ✔️ Requisitos

1. Crea un **repository de films** en un archivo específico (por ejemplo `film.repository.ts`) que se encargue exclusivamente del acceso a datos.

2. El repository debe:

   - usar **Mongoose** y la conexión a MongoDB ya configurada,
   - encapsular todo el acceso a la base de datos,
   - no exponer directamente Mongoose a los controladores.

3. No elimines ni sobreescribas el repository en memoria actual. En lugar de eso, crea un **nuevo** repository específico para MongoDB en un fichero separado (por ejemplo `film.repository.mongodb.ts`) que utilice **Mongoose** per acceder a la base de datos. Mantén el repository en memoria disponible para poder comparar con la implementación Mongoose.

4. El repository debe implementar los mismos métodos que el repository en memoria.

5. Los endpoints de la API deben seguir funcionando igual que antes desde el punto de vista del cliente.

> 💡 Puedes usar IA para ayudarte, pero debes adaptar el código a la estructura del proyecto y entender lo que estás haciendo.
> En la próxima sesión se mostrará una **implementación refactorizada de referencia** y se comparará con vuestras soluciones.
