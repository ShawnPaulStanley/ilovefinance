import express from 'express';
import cors from 'cors';
import path from 'node:path';
import fs from 'node:fs';
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
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Database & Seed reference stocks
initializeDatabase();
seedInitialData();

// API Routes
app.use('/api/portfolios', portfoliosRouter);
app.use('/api/transactions', transactionsRouter);
app.use('/api/stocks', stocksRouter);
app.use('/api/watchlist', watchlistRouter);
app.use('/api/analytics', analyticsRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'ilovefinance',
    timestamp: new Date().toISOString(),
    market: 'NSE/BSE India'
  });
});

// Production client serving
const candidateDist1 = path.resolve(process.cwd(), '../client/dist');
const candidateDist2 = path.resolve(process.cwd(), 'client/dist');
const candidateDist3 = path.resolve(process.cwd(), '../../client/dist');
const clientDist = [candidateDist1, candidateDist2, candidateDist3].find(p => fs.existsSync(p));

if (clientDist) {
  console.log(`[ilovefinance] Serving static frontend from: ${clientDist}`);
  app.use(express.static(clientDist));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
} else {
  console.warn('[ilovefinance] Warning: client/dist not found. Run "npm run build" to build the client.');
}

const portNumber = Number(PORT) || 5000;
app.listen(portNumber, '0.0.0.0', () => {
  console.log(`[ilovefinance Server] Running on http://localhost:${portNumber}`);
  console.log(`[ilovefinance Server] Running on http://127.0.0.1:${portNumber}`);
});
