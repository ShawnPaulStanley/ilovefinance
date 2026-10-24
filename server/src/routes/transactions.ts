import { Router, Request, Response } from 'express';
import { db } from '../db/connection.js';
import { CalculationEngine } from '../services/calculationEngine.js';
import { MarketDataService } from '../services/marketDataService.js';

export const transactionsRouter = Router();

// GET transactions for a specific portfolio
transactionsRouter.get('/portfolio/:portfolio_id', (req: Request, res: Response) => {
  try {
    const portfolio_id = req.params.portfolio_id;
    const transactions = db.prepare(`
      SELECT t.*, s.name as stock_name, s.sector, s.exchange
      FROM transactions t
      LEFT JOIN stocks s ON t.stock_symbol = s.symbol
      WHERE t.portfolio_id = ?
      ORDER BY t.transaction_date DESC, t.created_at DESC
    `).all(portfolio_id);
    res.json(transactions);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET transactions with optional filters
transactionsRouter.get('/', (req: Request, res: Response) => {
  try {
    const { portfolio_id, stock_symbol, type } = req.query;

    let query = `
      SELECT t.*, s.name as stock_name, s.sector, s.exchange
      FROM transactions t
      LEFT JOIN stocks s ON t.stock_symbol = s.symbol
      WHERE 1=1
    `;
    const params: any[] = [];

    if (portfolio_id) {
      query += ' AND t.portfolio_id = ?';
      params.push(portfolio_id);
    }
    if (stock_symbol) {
      query += ' AND t.stock_symbol = ?';
      params.push(MarketDataService.normalizeSymbol(String(stock_symbol)));
    }
    if (type) {
      query += ' AND t.type = ?';
      params.push(String(type).toUpperCase());
    }

    query += ' ORDER BY t.transaction_date DESC, t.created_at DESC';

    const transactions = db.prepare(query).all(...params);
    res.json(transactions);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST add new transaction (BUY, SELL, DIVIDEND)
transactionsRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { portfolio_id, stock_symbol, type, quantity, price, transaction_date, notes } = req.body;

    if (!portfolio_id || !stock_symbol || !type || quantity === undefined || price === undefined) {
      return res.status(400).json({ error: 'Missing required fields: portfolio_id, stock_symbol, type, quantity, price' });
    }

    const normType = String(type).toUpperCase();
    if (!['BUY', 'SELL', 'DIVIDEND'].includes(normType)) {
      return res.status(400).json({ error: 'Invalid transaction type. Allowed: BUY, SELL, DIVIDEND' });
    }

    const numQty = parseFloat(quantity);
    const numPrice = parseFloat(price);
    if (isNaN(numQty) || numQty <= 0) {
      return res.status(400).json({ error: 'Quantity must be a positive number' });
    }
    if (isNaN(numPrice) || numPrice < 0) {
      return res.status(400).json({ error: 'Price must be a non-negative number' });
    }

    const normSymbol = MarketDataService.normalizeSymbol(stock_symbol);

    // Verify stock exists in DB or fetch quote to register it
    let stock = db.prepare('SELECT * FROM stocks WHERE symbol = ?').get(normSymbol);
    if (!stock) {
      const quote = await MarketDataService.getQuote(normSymbol);
      stock = db.prepare('SELECT * FROM stocks WHERE symbol = ?').get(normSymbol);
    }

    // If SELL, validate user has sufficient shares
    if (normType === 'SELL') {
      const currentHolding = db.prepare(`
        SELECT quantity FROM holdings WHERE portfolio_id = ? AND stock_symbol = ?
      `).get(portfolio_id, normSymbol) as { quantity: number } | undefined;

      const availableQty = currentHolding?.quantity || 0;
      if (numQty > availableQty) {
        return res.status(400).json({
          error: `Insufficient shares to sell. Available: ${availableQty}, requested sell: ${numQty}`
        });
      }
    }

    const id = `tx_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const totalAmount = Number((numQty * numPrice).toFixed(2));
    const txDate = transaction_date || new Date().toISOString().split('T')[0];

    db.prepare(`
      INSERT INTO transactions (id, portfolio_id, stock_symbol, type, quantity, price, total_amount, transaction_date, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, portfolio_id, normSymbol, normType, numQty, numPrice, totalAmount, txDate, notes?.trim() || '');

    // Recompute holdings and cost-basis
    const summary = CalculationEngine.recalculatePortfolio(portfolio_id);

    const createdTx = db.prepare(`
      SELECT t.*, s.name as stock_name, s.sector, s.exchange
      FROM transactions t
      LEFT JOIN stocks s ON t.stock_symbol = s.symbol
      WHERE t.id = ?
    `).get(id);

    res.status(201).json({
      transaction: createdTx,
      summary
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE transaction
transactionsRouter.delete('/:id', (req: Request, res: Response) => {
  try {
    const tx = db.prepare('SELECT * FROM transactions WHERE id = ?').get(req.params.id) as any;
    if (!tx) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    db.prepare('DELETE FROM transactions WHERE id = ?').run(req.params.id);

    // Replay calculations
    const summary = CalculationEngine.recalculatePortfolio(tx.portfolio_id);

    res.json({
      message: 'Transaction deleted successfully',
      summary
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
