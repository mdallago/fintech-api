import 'dotenv/config';
import express from 'express';
import { initDB } from './db/init.js';
import transactionsRouter from './routes/transactions.routes.js';
import { errorHandler } from './middleware/errorHandler.js';
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';

const app = express();
const PORT = process.env.PORT || 3000;

// ── Swagger ────────────────────────────────────────────────────────────────
const swaggerOptions = {
  swaggerDefinition: {
    myapi: '1.0.0',
    info: {
      title: 'Fintech API',
      version: '1.0.0',
      description: 'API documentation',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['./src/index.js', './src/routes/*.js'], // files containing annotations as above
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


// ── Middleware ────────────────────────────────────────────────────────────────
app.use(express.json());

// ── Routes ────────────────────────────────────────────────────────────────────
/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     responses:
 *       200:
 *         description: Ok Message
 *         content:
 *           application/json:
 *             schema:
 *                 properties:
 *                   status:
 *                     type: string
 *                     example: ok
 */
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/transactions', transactionsRouter);

// ── 404 ───────────────────────────────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ error: 'Route not found' }));

// ── Error handler (must be last) ──────────────────────────────────────────────
app.use(errorHandler);

// ── Bootstrap ─────────────────────────────────────────────────────────────────
async function bootstrap() {
  await initDB();
  app.listen(PORT, () => {
    console.log(`🚀  Server listening on http://localhost:${PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
