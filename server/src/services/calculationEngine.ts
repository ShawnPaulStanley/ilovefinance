import { db } from '../db/connection.js';

export interface HoldingCalculated {
  symbol: string;
  name: string;
  sector: string;
  exchange: string;
  quantity: number;
  avg_buy_price: number;
  total_invested: number;
  current_price: number;
  prev_close: number;
  current_value: number;
  unrealized_pl: number;
  unrealized_pl_percent: number;
  day_change: number;
  day_change_percent: number;
  todays_pl: number;
  portfolio_weight: number; // percentage (0 - 100)
  realized_pl: number;
}

export interface PortfolioSummary {
  portfolio_id: string;
  total_value: number;
  total_invested: number;
  unrealized_pl: number;
  unrealized_pl_percent: number;
  realized_pl: number;
  total_dividends: number;
  total_pnl: number;
  total_return_percent: number;
  todays_pl: number;
  todays_pl_percent: number;
  holdings_count: number;
  holdings: HoldingCalculated[];
}

export class CalculationEngine {
  /**
   * Recalculate all holdings and realized P/L for a given portfolio
   * by chronologically replaying all transactions.
   */
  public static recalculatePortfolio(portfolioId: string): PortfolioSummary {
    // 1. Fetch transactions in chronological order
    const transactions = db.prepare(`
      SELECT * FROM transactions
      WHERE portfolio_id = ?
      ORDER BY transaction_date ASC, created_at ASC
    `).all(portfolioId) as Array<{
      id: string;
      portfolio_id: string;
      stock_symbol: string;
      type: 'BUY' | 'SELL' | 'DIVIDEND';
      quantity: number;
      price: number;
      total_amount: number;
      transaction_date: string;
      notes: string;
    }>;

    // Track state per stock
    const stockStates: Record<string, {
      quantity: number;
      avg_buy_price: number;
      realized_pl: number;
      dividends: number;
    }> = {};

    for (const tx of transactions) {
      if (!stockStates[tx.stock_symbol]) {
        stockStates[tx.stock_symbol] = {
          quantity: 0,
          avg_buy_price: 0,
          realized_pl: 0,
          dividends: 0,
        };
      }

      const state = stockStates[tx.stock_symbol];

      if (tx.type === 'BUY') {
        const prevQty = state.quantity;
        const prevAvg = state.avg_buy_price;
        const buyQty = Number(tx.quantity);
        const buyPrice = Number(tx.price);

        const newQty = prevQty + buyQty;
        const newTotalCost = (prevQty * prevAvg) + (buyQty * buyPrice);
        const newAvg = newQty > 0 ? (newTotalCost / newQty) : 0;

        state.quantity = newQty;
        state.avg_buy_price = Number(newAvg.toFixed(4));
      } else if (tx.type === 'SELL') {
        const sellQty = Number(tx.quantity);
        const sellPrice = Number(tx.price);

        // Realized P/L = (sellPrice - current average cost basis) * sellQty
        const costBasisOfSold = sellQty * state.avg_buy_price;
        const saleProceeds = sellQty * sellPrice;
        const plOnThisSale = saleProceeds - costBasisOfSold;

        state.realized_pl += plOnThisSale;
        state.quantity = Math.max(0, state.quantity - sellQty);

        // If zero shares remaining, reset avg buy price
        if (state.quantity <= 0.00001) {
          state.quantity = 0;
          state.avg_buy_price = 0;
        }
      } else if (tx.type === 'DIVIDEND') {
        state.dividends += Number(tx.total_amount || (tx.quantity * tx.price));
      }
    }

    // Update holdings table in DB
    const deleteHoldings = db.prepare('DELETE FROM holdings WHERE portfolio_id = ?');
    const insertHolding = db.prepare(`
      INSERT INTO holdings (id, portfolio_id, stock_symbol, quantity, avg_buy_price, total_invested, realized_pl, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `);

    deleteHoldings.run(portfolioId);

    for (const [symbol, state] of Object.entries(stockStates)) {
      if (state.quantity > 0 || Math.abs(state.realized_pl) > 0.01) {
        const holdingId = `${portfolioId}_${symbol}`;
        const totalInvested = Number((state.quantity * state.avg_buy_price).toFixed(2));
        insertHolding.run(
          holdingId,
          portfolioId,
          symbol,
          state.quantity,
          state.avg_buy_price,
          totalInvested,
          Number(state.realized_pl.toFixed(2))
        );
      }
    }

    // Now compute current market valuations
    return this.getPortfolioSummary(portfolioId);
  }

  /**
   * Get full summary metrics with latest prices for the portfolio
   */
  public static getPortfolioSummary(portfolioId: string): PortfolioSummary {
    const rawHoldings = db.prepare(`
      SELECT 
        h.stock_symbol,
        h.quantity,
        h.avg_buy_price,
        h.total_invested,
        h.realized_pl,
        s.name,
        s.sector,
        s.exchange,
        s.current_price,
        s.prev_close,
        s.day_change,
        s.day_change_percent
      FROM holdings h
      LEFT JOIN stocks s ON h.stock_symbol = s.symbol
      WHERE h.portfolio_id = ? AND h.quantity > 0
    `).all(portfolioId) as Array<{
      stock_symbol: string;
      quantity: number;
      avg_buy_price: number;
      total_invested: number;
      realized_pl: number;
      name: string | null;
      sector: string | null;
      exchange: string | null;
      current_price: number | null;
      prev_close: number | null;
      day_change: number | null;
      day_change_percent: number | null;
    }>;

    // Realized PL across all closed/partially closed positions
    const realizedResult = db.prepare(`
      SELECT COALESCE(SUM(realized_pl), 0) as total_realized_pl
      FROM holdings
      WHERE portfolio_id = ?
    `).get(portfolioId) as { total_realized_pl: number };

    // Dividend income
    const dividendResult = db.prepare(`
      SELECT COALESCE(SUM(total_amount), 0) as total_dividends
      FROM transactions
      WHERE portfolio_id = ? AND type = 'DIVIDEND'
    `).get(portfolioId) as { total_dividends: number };

    let total_value = 0;
    let total_invested = 0;
    let todays_pl = 0;
    let prev_total_value = 0;

    const holdingsList: HoldingCalculated[] = [];

    for (const h of rawHoldings) {
      const currentPrice = h.current_price ?? h.avg_buy_price;
      const prevClose = h.prev_close ?? currentPrice;
      const qty = h.quantity;
      const invested = Number((qty * h.avg_buy_price).toFixed(2));
      const value = Number((qty * currentPrice).toFixed(2));
      const unrealized_pl = Number((value - invested).toFixed(2));
      const unrealized_pl_percent = invested > 0 ? Number(((unrealized_pl / invested) * 100).toFixed(2)) : 0;
      
      const dayChange = Number((currentPrice - prevClose).toFixed(2));
      const dayChangePercent = prevClose > 0 ? Number(((dayChange / prevClose) * 100).toFixed(2)) : 0;
      const itemTodaysPl = Number((qty * (currentPrice - prevClose)).toFixed(2));

      total_value += value;
      total_invested += invested;
      todays_pl += itemTodaysPl;
      prev_total_value += (qty * prevClose);

      holdingsList.push({
        symbol: h.stock_symbol,
        name: h.name || h.stock_symbol,
        sector: h.sector || 'Diversified',
        exchange: h.exchange || 'NSE',
        quantity: qty,
        avg_buy_price: h.avg_buy_price,
        total_invested: invested,
        current_price: currentPrice,
        prev_close: prevClose,
        current_value: value,
        unrealized_pl,
        unrealized_pl_percent,
        day_change: dayChange,
        day_change_percent: dayChangePercent,
        todays_pl: itemTodaysPl,
        portfolio_weight: 0, // calculated below once total_value is known
        realized_pl: h.realized_pl || 0,
      });
    }

    // Calculate weights
    for (const item of holdingsList) {
      item.portfolio_weight = total_value > 0 ? Number(((item.current_value / total_value) * 100).toFixed(2)) : 0;
    }

    // Sort holdings by value descending
    holdingsList.sort((a, b) => b.current_value - a.current_value);

    const unrealized_pl = Number((total_value - total_invested).toFixed(2));
    const unrealized_pl_percent = total_invested > 0 ? Number(((unrealized_pl / total_invested) * 100).toFixed(2)) : 0;

    const realized_pl = Number(realizedResult.total_realized_pl.toFixed(2));
    const total_dividends = Number(dividendResult.total_dividends.toFixed(2));
    const total_pnl = Number((unrealized_pl + realized_pl + total_dividends).toFixed(2));
    
    // Overall return relative to total capital deployed
    const total_return_percent = total_invested > 0 ? Number(((total_pnl / total_invested) * 100).toFixed(2)) : 0;
    const todays_pl_percent = prev_total_value > 0 ? Number(((todays_pl / prev_total_value) * 100).toFixed(2)) : 0;

    return {
      portfolio_id: portfolioId,
      total_value: Number(total_value.toFixed(2)),
      total_invested: Number(total_invested.toFixed(2)),
      unrealized_pl,
      unrealized_pl_percent,
      realized_pl,
      total_dividends,
      total_pnl,
      total_return_percent,
      todays_pl: Number(todays_pl.toFixed(2)),
      todays_pl_percent,
      holdings_count: holdingsList.length,
      holdings: holdingsList,
    };
  }
}
