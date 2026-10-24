import { Router, Request, Response } from 'express';
import { db } from '../db/connection.js';
import { MarketDataService } from '../services/marketDataService.js';

export const watchlistRouter = Router();

// GET watchlist
watchlistRouter.get('/', async (req: Request, res: Response) => {
  try {
    const items = db.prepare(`
      SELECT w.id, w.stock_symbol, w.target_price, w.notes, w.added_at,
             s.name, s.short_name, s.sector, s.exchange, s.current_price, s.prev_close, s.day_change, s.day_change_percent
      FROM watchlist w
      LEFT JOIN stocks s ON w.stock_symbol = s.symbol
      ORDER BY w.added_at DESC
    `).all() as any[];

    // Fetch sparkline and latest quotes for watchlist items
    const enriched = await Promise.all(
      items.map(async item => {
        const quote = await MarketDataService.getQuote(item.stock_symbol);
        const sparkline = await MarketDataService.getHistoricalPrices(item.stock_symbol, '1M');
        return {
          ...item,
          current_price: quote.current_price,
          prev_close: quote.prev_close,
          day_change: quote.day_change,
          day_change_percent: quote.day_change_percent,
          fifty_two_week_high: quote.fifty_two_week_high,
          fifty_two_week_low: quote.fifty_two_week_low,
          sparkline: sparkline.slice(-15).map(p => p.price)
        };
      })
    );

    res.json(enriched);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST add to watchlist
watchlistRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { stock_symbol, target_price, notes } = req.body;
    if (!stock_symbol) {
      return res.status(400).json({ error: 'stock_symbol is required' });
    }

    const normSymbol = MarketDataService.normalizeSymbol(stock_symbol);
    // Ensure stock exists
    await MarketDataService.getQuote(normSymbol);

    const id = `watch_${Date.now()}`;
    db.prepare(`
      INSERT INTO watchlist (id, stock_symbol, target_price, notes)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(stock_symbol) DO UPDATE SET
        target_price = excluded.target_price,
        notes = excluded.notes
    `).run(id, normSymbol, target_price || 0, notes || '');

    res.status(201).json({ message: 'Stock added to watchlist', symbol: normSymbol });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE from watchlist
watchlistRouter.delete('/:symbol', (req: Request, res: Response) => {
  try {
    const normSymbol = MarketDataService.normalizeSymbol(req.params.symbol);
    db.prepare('DELETE FROM watchlist WHERE stock_symbol = ?').run(normSymbol);
    res.json({ message: 'Stock removed from watchlist' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
