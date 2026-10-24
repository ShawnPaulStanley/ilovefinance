import express from 'express';
import path from 'node:path';
import fs from 'node:fs';
import { app } from './app.js';

const PORT = process.env.PORT || 5000;

// Production client serving when running as a standalone node server
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
  console.warn('[ilovefinance] Notice: client/dist not found. Run "npm run build" to build client assets.');
}

// Only start standalone HTTP server when not running in a serverless lambda (e.g. Vercel)
if (!process.env.VERCEL) {
  const portNumber = Number(PORT) || 5000;
  app.listen(portNumber, '0.0.0.0', () => {
    console.log(`[ilovefinance Server] Running on http://localhost:${portNumber}`);
    console.log(`[ilovefinance Server] Running on http://127.0.0.1:${portNumber}`);
  });
}

export { app };
export default app;
