// Configura el servidor Express, los middlewares, las rutas y el manejo de errores.

import cors from 'cors';
import express from 'express';
import { CLIENT_URL, NODE_ENV } from './config/config';
import { createConnection } from './config/db';
import { baseRouter } from './routes/base.routes';

// Inicializa Express
export const app = express();
app.disable('x-powered-by');

// Conecta con la base de datos
await createConnection();

// Configura CORS según el entorno
if (NODE_ENV === 'production') {
  // Producción: CORS restrictivo para un cliente específico
  app.use(cors({ origin: CLIENT_URL }));
} else {
  // Desarrollo: CORS abierto para todas las conexiones
  app.use(cors());
}

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/v1', baseRouter);
