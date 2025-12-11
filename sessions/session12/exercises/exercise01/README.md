# 📝 Ejercicio — Conexión a MongoDB con Mongoose

## 🎯 Objetivo

Configurar la conexión a una base de datos **MongoDB** usando **Mongoose**, en un módulo separado, leyendo la URL desde variables de entorno.

## ✔️ Requisitos

1. Crea un archivo en `src/config/db.ts` que exporte una función asíncrona, por ejemplo `createConnection`, que:

   - lea `process.env.DATABASE_URL`,
   - muestre un mensaje **antes** de conectar,
   - intente conectar con `mongoose.connect(...)`,
   - muestre un mensaje cuando la conexión se haya establecido correctamente,
   - capture errores de conexión y los muestre por consola.

2. Integra esa función en la app:

   - En el archivo principal (`app.ts`), llama a `createConnection()` cuando arranque la aplicación.
   - Si `DATABASE_URL` no está definida, la aplicación debe mostrar un error claro.

> 💡 Puedes usar IA para ayudarte, pero debes adaptar el código a la estructura del proyecto y entenderlo.
