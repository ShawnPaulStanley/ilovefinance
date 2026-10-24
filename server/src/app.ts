import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDatabase } from './db/schema.js';
import { seedInitialData } from './db/seed.js';
import { portfoliosRouter } from './routes/portfolios.js';
import { transactionsRouter } from './routes/transactions.js';
import { stocksRouter } from './routes/stocks.js';
import { watchlistRouter } from './routes/watchlist.js';
import { analyticsRouter } from './routes/analytics.js';

dotenv.config();

const app = express();

// Global Middlewares
app.use(cors());
app.use(express.json());

// Initialize Database schema and seed default Indian reference stocks
initializeDatabase();
seedInitialData();

// Build API sub-router
const apiRouter = express.Router();
apiRouter.use('/portfolios', portfoliosRouter);
apiRouter.use('/transactions', transactionsRouter);
apiRouter.use('/stocks', stocksRouter);
apiRouter.use('/watchlist', watchlistRouter);
apiRouter.use('/analytics', analyticsRouter);

// Health check endpoint
apiRouter.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'ilovefinance',
    environment: process.env.VERCEL ? 'vercel-serverless' : (process.env.NODE_ENV || 'development'),
    timestamp: new Date().toISOString(),
    market: 'NSE/BSE India'
  });
});

// Mount router on both /api (standard) and / (in case Vercel rewrite strips prefix)
app.use('/api', apiRouter);
app.use('/', apiRouter);

export { app };
export default app;
