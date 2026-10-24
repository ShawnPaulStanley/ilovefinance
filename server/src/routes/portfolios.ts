import { Router, Request, Response } from 'express';
import { db } from '../db/connection.js';
import { CalculationEngine } from '../services/calculationEngine.js';

export const portfoliosRouter = Router();

// GET all portfolios
portfoliosRouter.get('/', (req: Request, res: Response) => {
  try {
    const portfolios = db.prepare(`
      SELECT p.*, 
        COUNT(DISTINCT h.stock_symbol) as active_holdings_count
      FROM portfolios p
      LEFT JOIN holdings h ON p.id = h.portfolio_id AND h.quantity > 0
      GROUP BY p.id
      ORDER BY p.is_default DESC, p.created_at ASC
    `).all();

    // Attach summary for each
    const result = portfolios.map((p: any) => {
      const summary = CalculationEngine.getPortfolioSummary(p.id);
      return {
        ...p,
        total_value: summary.total_value,
        total_invested: summary.total_invested,
        unrealized_pl: summary.unrealized_pl,
        unrealized_pl_percent: summary.unrealized_pl_percent,
        realized_pl: summary.realized_pl,
        total_pnl: summary.total_pnl,
        total_return_percent: summary.total_return_percent,
        todays_pl: summary.todays_pl,
        todays_pl_percent: summary.todays_pl_percent
      };
    });

    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET single portfolio by id
portfoliosRouter.get('/:id', (req: Request, res: Response) => {
  try {
    const portfolio = db.prepare('SELECT * FROM portfolios WHERE id = ?').get(req.params.id);
    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }

    const summary = CalculationEngine.getPortfolioSummary(req.params.id);
    res.json({
      portfolio,
      summary
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST create portfolio
portfoliosRouter.post('/', (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Portfolio name is required' });
    }

    const id = `port_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    db.prepare(`
      INSERT INTO portfolios (id, name, description, is_default)
      VALUES (?, ?, ?, 0)
    `).run(id, name.trim(), description?.trim() || '');

    const newPortfolio = db.prepare('SELECT * FROM portfolios WHERE id = ?').get(id);
    res.status(201).json(newPortfolio);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update portfolio
portfoliosRouter.put('/:id', (req: Request, res: Response) => {
  try {
    const { name, description, is_default } = req.body;
    const portfolioId = req.params.id;

    if (is_default) {
      // Remove default from other portfolios
      db.prepare('UPDATE portfolios SET is_default = 0').run();
    }

    db.prepare(`
      UPDATE portfolios
      SET name = COALESCE(?, name),
          description = COALESCE(?, description),
          is_default = COALESCE(?, is_default),
          updated_at = datetime('now')
      WHERE id = ?
    `).run(name?.trim(), description?.trim(), is_default ? 1 : 0, portfolioId);

    const updated = db.prepare('SELECT * FROM portfolios WHERE id = ?').get(portfolioId);
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE portfolio
portfoliosRouter.delete('/:id', (req: Request, res: Response) => {
  try {
    const portfolioId = req.params.id;
    // Don't delete if it's the only portfolio
    const countResult = db.prepare('SELECT count(*) as count FROM portfolios').get() as { count: number };
    if (countResult.count <= 1) {
      return res.status(400).json({ error: 'Cannot delete the only existing portfolio. Please create another portfolio first.' });
    }

    db.prepare('DELETE FROM transactions WHERE portfolio_id = ?').run(portfolioId);
    db.prepare('DELETE FROM holdings WHERE portfolio_id = ?').run(portfolioId);
    db.prepare('DELETE FROM dividends WHERE portfolio_id = ?').run(portfolioId);
    db.prepare('DELETE FROM portfolios WHERE id = ?').run(portfolioId);

    res.json({ message: 'Portfolio deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST clear all transactions and reset portfolio to empty
portfoliosRouter.post('/:id/clear', (req: Request, res: Response) => {
  try {
    const portfolioId = req.params.id;
    const portfolio = db.prepare('SELECT * FROM portfolios WHERE id = ?').get(portfolioId);
    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }

    db.prepare('DELETE FROM transactions WHERE portfolio_id = ?').run(portfolioId);
    db.prepare('DELETE FROM dividends WHERE portfolio_id = ?').run(portfolioId);
    db.prepare('DELETE FROM holdings WHERE portfolio_id = ?').run(portfolioId);

    const summary = CalculationEngine.recalculatePortfolio(portfolioId);
    res.json({ message: 'Portfolio cleared successfully', summary });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST seed sample Indian portfolio transactions
portfoliosRouter.post('/:id/seed-sample', (req: Request, res: Response) => {
  try {
    const portfolioId = req.params.id;
    const portfolio = db.prepare('SELECT * FROM portfolios WHERE id = ?').get(portfolioId);
    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }

    // Clear existing transactions for this portfolio
    db.prepare('DELETE FROM transactions WHERE portfolio_id = ?').run(portfolioId);
    db.prepare('DELETE FROM dividends WHERE portfolio_id = ?').run(portfolioId);

    // Sample bluechip and high-growth transactions (with post-split realistic cost basis)
    const sampleTransactions = [
      {
        id: `tx_sample_1`,
        portfolio_id: portfolioId,
        stock_symbol: 'RELIANCE.NS',
        type: 'BUY',
        quantity: 60,
        price: 1120.00,
        total_amount: 67200.00,
        transaction_date: '2024-03-15',
        notes: 'Initial bluechip investment in energy and retail giant'
      },
      {
        id: `tx_sample_2`,
        portfolio_id: portfolioId,
        stock_symbol: 'RELIANCE.NS',
        type: 'BUY',
        quantity: 25,
        price: 1150.00,
        total_amount: 28750.00,
        transaction_date: '2024-06-10',
        notes: 'Accumulated on dip'
      },
      {
        id: `tx_sample_3`,
        portfolio_id: portfolioId,
        stock_symbol: 'TCS.NS',
        type: 'BUY',
        quantity: 30,
        price: 2420.00,
        total_amount: 72600.00,
        transaction_date: '2024-01-05',
        notes: 'Core IT exposure'
      },
      {
        id: `tx_sample_4`,
        portfolio_id: portfolioId,
        stock_symbol: 'TCS.NS',
        type: 'DIVIDEND',
        quantity: 30,
        price: 28.00,
        total_amount: 840.00,
        transaction_date: '2024-04-18',
        notes: 'Interim dividend payout'
      },
      {
        id: `tx_sample_5`,
        portfolio_id: portfolioId,
        stock_symbol: 'HDFCBANK.NS',
        type: 'BUY',
        quantity: 80,
        price: 650.00,
        total_amount: 52000.00,
        transaction_date: '2024-01-22',
        notes: 'Private bank anchor'
      },
      {
        id: `tx_sample_6`,
        portfolio_id: portfolioId,
        stock_symbol: 'INFY.NS',
        type: 'BUY',
        quantity: 60,
        price: 1080.00,
        total_amount: 64800.00,
        transaction_date: '2024-02-14',
        notes: 'Infosys large-cap tech'
      },
      {
        id: `tx_sample_7`,
        portfolio_id: portfolioId,
        stock_symbol: 'ITC.NS',
        type: 'BUY',
        quantity: 150,
        price: 440.00,
        total_amount: 66000.00,
        transaction_date: '2023-09-01',
        notes: 'FMCG defensive & high dividend yield'
      },
      {
        id: `tx_sample_8`,
        portfolio_id: portfolioId,
        stock_symbol: 'ITC.NS',
        type: 'DIVIDEND',
        quantity: 150,
        price: 6.25,
        total_amount: 937.50,
        transaction_date: '2024-02-15',
        notes: 'Interim dividend'
      },
      {
        id: `tx_sample_9`,
        portfolio_id: portfolioId,
        stock_symbol: 'TATAMOTORS.NS',
        type: 'BUY',
        quantity: 80,
        price: 810.00,
        total_amount: 64800.00,
        transaction_date: '2024-02-01',
        notes: 'EV and commercial vehicle turnaround'
      },
      {
        id: `tx_sample_10`,
        portfolio_id: portfolioId,
        stock_symbol: 'TATAMOTORS.NS',
        type: 'SELL',
        quantity: 20,
        price: 940.00,
        total_amount: 18800.00,
        transaction_date: '2024-08-12',
        notes: 'Booked partial profit on rally'
      },
      {
        id: `tx_sample_11`,
        portfolio_id: portfolioId,
        stock_symbol: 'SUNPHARMA.NS',
        type: 'BUY',
        quantity: 40,
        price: 1680.00,
        total_amount: 67200.00,
        transaction_date: '2024-04-10',
        notes: 'Pharma healthcare growth'
      },
      {
        id: `tx_sample_12`,
        portfolio_id: portfolioId,
        stock_symbol: 'BHARTIARTL.NS',
        type: 'BUY',
        quantity: 45,
        price: 1540.00,
        total_amount: 69300.00,
        transaction_date: '2024-03-20',
        notes: 'ARPU growth and 5G leadership'
      },
      {
        id: `tx_sample_13`,
        portfolio_id: portfolioId,
        stock_symbol: 'SBIN.NS',
        type: 'BUY',
        quantity: 70,
        price: 740.00,
        total_amount: 51800.00,
        transaction_date: '2024-03-01',
        notes: 'India largest public sector bank'
      }
    ];

    const insertTx = db.prepare(`
      INSERT INTO transactions (id, portfolio_id, stock_symbol, type, quantity, price, total_amount, transaction_date, notes)
      VALUES (@id, @portfolio_id, @stock_symbol, @type, @quantity, @price, @total_amount, @transaction_date, @notes)
    `);

    for (const tx of sampleTransactions) {
      insertTx.run(tx);
    }

    // Replay calculations
    const summary = CalculationEngine.recalculatePortfolio(portfolioId);

    res.json({
      message: 'Sample Indian portfolio loaded successfully',
      summary
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
