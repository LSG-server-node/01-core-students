// Punto de entrada de la aplicación.
// Inicia el servidor HTTP, expone Express y habilita la demo de WebSocket.

import { createServer } from 'http';
import { app } from './app.js';
import { PORT } from './config/env.js';
import logger from './config/logger.js';
import { handGateway, HANDS_WEBSOCKET_PATH } from './realtime/hand.gateway.js';

const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? `https://${process.env.RENDER_EXTERNAL_HOSTNAME}`
    : `http://localhost:${PORT}`;

const server = createServer(app);
handGateway.attach(server);

server.listen(PORT, () => {
  logger.info(`⚡️[server]: Server is running at ${BASE_URL}`);
  logger.info(
    `⚡️[realtime]: Socket.IO available at http://localhost:${PORT}${HANDS_WEBSOCKET_PATH}`
  );
});
