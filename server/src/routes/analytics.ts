import { Router, Request, Response } from 'express';
import { CalculationEngine } from '../services/calculationEngine.js';
import { AnalyticsService } from '../services/analyticsService.js';
import { MarketDataService } from '../services/marketDataService.js';

export const analyticsRouter = Router();

analyticsRouter.get('/:portfolio_id', async (req: Request, res: Response) => {
  try {
    const portfolioId = req.params.portfolio_id;
    const range = (req.query.range as any) || '1Y';

    const summary = CalculationEngine.getPortfolioSummary(portfolioId);
    const diversification = AnalyticsService.calculateDiversification(summary);
    const risk = AnalyticsService.calculateRisk(summary);
    const sectorAllocation = AnalyticsService.calculateSectorAllocation(summary);
    const bestWorst = AnalyticsService.findBestWorstPerformers(summary);
    const history = await AnalyticsService.getPortfolioHistory(summary, range);

    // Stock allocation for pie chart (top 7 + others)
    const stockAllocation = summary.holdings.slice(0, 7).map(h => ({
      symbol: h.symbol,
      name: h.name,
      value: h.current_value,
      weight: h.portfolio_weight
    }));

    if (summary.holdings.length > 7) {
      const remainingValue = summary.holdings.slice(7).reduce((sum, h) => sum + h.current_value, 0);
      const remainingWeight = summary.holdings.slice(7).reduce((sum, h) => sum + h.portfolio_weight, 0);
      stockAllocation.push({
        symbol: 'OTHERS',
        name: 'Other Holdings',
        value: Number(remainingValue.toFixed(2)),
        weight: Number(remainingWeight.toFixed(2))
      });
    }

    // Benchmark comparison vs NIFTY 50 and SENSEX
    const holdingsForBench = summary.holdings.map(h => ({ symbol: h.symbol, current_value: h.current_value }));
    const benchRange = (range === '1M' || range === '6M' || range === '1Y') ? range : '1Y';
    const benchmarkComparison = await MarketDataService.getBenchmarkComparison(holdingsForBench, benchRange);

    res.json({
      summary,
      diversification,
      risk,
      sectorAllocation,
      stockAllocation,
      bestWorst,
      history,
      benchmarkComparison
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
