import { Router, Request, Response } from 'express';
import { MarketDataService } from '../services/marketDataService.js';
import { db } from '../db/connection.js';

export const stocksRouter = Router();

// Search stocks
stocksRouter.get('/search', async (req: Request, res: Response) => {
  try {
    const q = req.query.q as string;
    if (!q || !q.trim()) {
      // Return top bluechips if empty query
      const topStocks = db.prepare(`
        SELECT symbol, symbol as stock_symbol, name, short_name, exchange, sector, current_price, prev_close, day_change_percent
        FROM stocks
        ORDER BY market_cap DESC
        LIMIT 12
      `).all();
      return res.json(topStocks);
    }

    let results = MarketDataService.searchStocks(q);

    // If no match in local database, attempt dynamic quote fetch for the requested ticker
    if (results.length === 0) {
      const cleanQ = q.trim().toUpperCase().replace('.NS', '').replace('.BO', '');
      const candidateSymbol = `${cleanQ}.NS`;
      try {
        const liveQuote = await MarketDataService.getQuote(candidateSymbol);
        if (liveQuote && liveQuote.current_price > 0) {
          results = [{
            symbol: liveQuote.symbol,
            stock_symbol: liveQuote.symbol,
            name: liveQuote.name,
            short_name: liveQuote.short_name,
            exchange: liveQuote.exchange,
            sector: liveQuote.sector,
            current_price: liveQuote.current_price,
            prev_close: liveQuote.prev_close,
            day_change_percent: liveQuote.day_change_percent
          }];
        }
      } catch (_e) {}
    }

    const mapped = results.map((r: any) => ({
      ...r,
      stock_symbol: r.stock_symbol || r.symbol,
      symbol: r.symbol || r.stock_symbol
    }));

    res.json(mapped);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Market status (Indian trading session check)
stocksRouter.get('/market-status', (req: Request, res: Response) => {
  try {
    const status = MarketDataService.getMarketStatus();
    res.json(status);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Benchmark indices status (NIFTY 50 and SENSEX)
stocksRouter.get('/benchmarks/summary', async (req: Request, res: Response) => {
  try {
    const [niftyQuote, sensexQuote] = await Promise.all([
      MarketDataService.getQuote('^NSEI'),
      MarketDataService.getQuote('^BSESN')
    ]);

    res.json({
      nifty: {
        symbol: '^NSEI',
        name: 'NIFTY 50',
        current_price: niftyQuote.current_price || 24850.30,
        prev_close: niftyQuote.prev_close || 24780.00,
        day_change: niftyQuote.day_change || 70.30,
        day_change_percent: niftyQuote.day_change_percent || 0.28
      },
      sensex: {
        symbol: '^BSESN',
        name: 'BSE SENSEX',
        current_price: sensexQuote.current_price || 81420.50,
        prev_close: sensexQuote.prev_close || 81210.00,
        day_change: sensexQuote.day_change || 210.50,
        day_change_percent: sensexQuote.day_change_percent || 0.26
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Stock detail quote (and quote alias)
stocksRouter.get('/:symbol/quote', async (req: Request, res: Response) => {
  try {
    const symbol = req.params.symbol;
    const quote = await MarketDataService.getQuote(symbol);
    res.json(quote);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Stock detail quote
stocksRouter.get('/:symbol', async (req: Request, res: Response) => {
  try {
    const symbol = req.params.symbol;
    const quote = await MarketDataService.getQuote(symbol);
    res.json(quote);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Stock historical prices
stocksRouter.get('/:symbol/history', async (req: Request, res: Response) => {
  try {
    const symbol = req.params.symbol;
    const range = (req.query.range as any) || '1Y';
    const history = await MarketDataService.getHistoricalPrices(symbol, range);
    res.json(history);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
