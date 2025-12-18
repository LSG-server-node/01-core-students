// Sets up the Express server, middleware, routes, and error handling.

import express from 'express';
import cors from 'cors';
import { CLIENT_URL } from './config/config';
import { baseRouter } from './routes/base.routes';
import { createConnection } from './config/db';

// Initialize express
export const app = express();
app.disable('x-powered-by');

// Connect to the database
await createConnection();

// Allow cors for all connexions (development)
app.use(cors());
// Allow cors for especific client url (production)
app.use(cors({ origin: CLIENT_URL }));

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/v1', baseRouter);
