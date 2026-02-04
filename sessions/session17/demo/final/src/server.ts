// Punto de entrada de la aplicación.
// Inicia el servidor y queda a la escucha de peticiones entrantes.

import { app } from './app.js';
import { PORT } from './config/config.js';
import logger from './config/logger.js';

const BASE_URL = `http://localhost:${PORT}`;

app.listen(PORT, () => {
  logger.info(`⚡️[server]: Server is running at ${BASE_URL}`);
});
