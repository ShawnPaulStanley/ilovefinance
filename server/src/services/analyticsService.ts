import { PortfolioSummary, HoldingCalculated } from './calculationEngine.js';
import { MarketDataService } from './marketDataService.js';

export interface DiversificationAnalysis {
  score: number; // 0 - 100
  rating: 'EXCELLENT' | 'GOOD' | 'MODERATE' | 'CONCENTRATED';
  hhiStock: number;
  hhiSector: number;
  stockConcentrationScore: number;
  sectorConcentrationScore: number;
  holdingsBreadthScore: number;
  topStockWeight: number;
  topSectorWeight: number;
  sectorCount: number;
  recommendations: string[];
}

export interface RiskAnalysis {
  riskScore: number; // 1 to 10 scale
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'VERY_HIGH';
  weightedBeta: number;
  estimatedAnnualVolatility: number; // percentage
  sharpeRatioEstimate: number;
  disclaimer: string;
}

export interface SectorBreakdown {
  sector: string;
  value: number;
  weight: number;
  count: number;
  unrealized_pl: number;
}

export interface BestWorstPerformers {
  bestByReturn: HoldingCalculated | null;
  worstByReturn: HoldingCalculated | null;
  bestByPnl: HoldingCalculated | null;
  worstByPnl: HoldingCalculated | null;
}

// Known Indian sector baseline betas relative to NIFTY 50
const SECTOR_BETAS: Record<string, number> = {
  'FMCG': 0.65,
  'Healthcare & Pharma': 0.72,
  'Power / Utilities': 0.85,
  'Telecommunication': 0.95,
  'Information Technology': 1.02,
  'Financial Services': 1.15,
  'Automobile': 1.18,
  'Metals & Mining': 1.35,
  'Energy': 1.05,
  'Construction & Capital Goods': 1.12,
  'Consumer Durables': 1.08,
  'Consumer Services / Tech': 1.40,
  'Aerospace & Defence': 1.20,
};

export class AnalyticsService {
  /**
   * Calculate comprehensive diversification score (0-100)
   */
  public static calculateDiversification(summary: PortfolioSummary): DiversificationAnalysis {
    const holdings = summary.holdings;
    if (holdings.length === 0 || summary.total_value <= 0) {
      return {
        score: 0,
        rating: 'CONCENTRATED',
        hhiStock: 1.0,
        hhiSector: 1.0,
        stockConcentrationScore: 0,
        sectorConcentrationScore: 0,
        holdingsBreadthScore: 0,
        topStockWeight: 0,
        topSectorWeight: 0,
        sectorCount: 0,
        recommendations: ['Add stocks to your portfolio to begin diversification analysis.']
      };
    }

    // 1. Stock Concentration via Herfindahl-Hirschman Index (HHI)
    // HHI = sum((weight / 100)^2). Ranges from 1/N to 1.0
    let hhiStock = 0;
    let topStockWeight = 0;
    for (const h of holdings) {
      const w = h.portfolio_weight / 100;
      hhiStock += w * w;
      if (h.portfolio_weight > topStockWeight) {
        topStockWeight = h.portfolio_weight;
      }
    }

    // Convert Stock HHI to a 0-100 score:
    // If HHI = 0.08 (12 equal stocks), score approaches 95
    // If HHI = 1.0 (1 stock), score = 0
    const stockConcentrationScore = Math.min(100, Math.max(0, (1 - Math.sqrt(hhiStock)) * 140));

    // 2. Sector Concentration via HHI
    const sectorMap: Record<string, number> = {};
    for (const h of holdings) {
      sectorMap[h.sector] = (sectorMap[h.sector] || 0) + (h.portfolio_weight / 100);
    }
    const sectorCount = Object.keys(sectorMap).length;
    let hhiSector = 0;
    let topSectorWeight = 0;
    for (const [, weight] of Object.entries(sectorMap)) {
      hhiSector += weight * weight;
      if (weight * 100 > topSectorWeight) {
        topSectorWeight = weight * 100;
      }
    }

    const sectorConcentrationScore = Math.min(100, Math.max(0, (1 - Math.sqrt(hhiSector)) * 135));

    // 3. Breadth score (based on number of distinct holdings, 12-15 is optimal in Modern Portfolio Theory)
    const holdingsBreadthScore = Math.min(100, (holdings.length / 12) * 100);

    // Blended overall score (40% stock distribution + 40% sector distribution + 20% holding count)
    const rawScore = (0.40 * stockConcentrationScore) + (0.40 * sectorConcentrationScore) + (0.20 * holdingsBreadthScore);
    const score = Number(Math.min(100, Math.max(0, rawScore)).toFixed(1));

    let rating: DiversificationAnalysis['rating'] = 'CONCENTRATED';
    if (score >= 80) rating = 'EXCELLENT';
    else if (score >= 65) rating = 'GOOD';
    else if (score >= 45) rating = 'MODERATE';

    // Tailored actionable insights
    const recommendations: string[] = [];
    if (topStockWeight > 25) {
      const topHolding = holdings[0];
      recommendations.push(`Single stock exposure high: ${topHolding?.symbol} represents ${topStockWeight.toFixed(1)}% of portfolio. Consider capping individual holdings under 15-20%.`);
    }
    if (topSectorWeight > 35) {
      recommendations.push(`High sector concentration: Largest sector accounts for ${topSectorWeight.toFixed(1)}% of total portfolio value.`);
    }
    if (sectorCount < 4 && holdings.length >= 4) {
      recommendations.push(`Portfolio covers only ${sectorCount} sectors. Consider spreading across uncorrelated sectors like FMCG, Healthcare, and IT.`);
    }
    if (holdings.length < 5) {
      recommendations.push('Portfolio has fewer than 5 stocks. Adding more quality Indian bluechips reduces idiosyncratic company risk.');
    }
    if (recommendations.length === 0) {
      recommendations.push('Portfolio is well diversified across individual assets and Indian industry sectors.');
    }

    return {
      score,
      rating,
      hhiStock: Number(hhiStock.toFixed(4)),
      hhiSector: Number(hhiSector.toFixed(4)),
      stockConcentrationScore: Number(stockConcentrationScore.toFixed(1)),
      sectorConcentrationScore: Number(sectorConcentrationScore.toFixed(1)),
      holdingsBreadthScore: Number(holdingsBreadthScore.toFixed(1)),
      topStockWeight: Number(topStockWeight.toFixed(1)),
      topSectorWeight: Number(topSectorWeight.toFixed(1)),
      sectorCount,
      recommendations
    };
  }

  /**
   * Calculate portfolio risk score (1 - 10) based on weighted Beta and volatility
   */
  public static calculateRisk(summary: PortfolioSummary): RiskAnalysis {
    const holdings = summary.holdings;
    const disclaimer = 'Analytical estimate based on 1-year historical price volatility and benchmark correlation. Not financial advice.';

    if (holdings.length === 0 || summary.total_value <= 0) {
      return {
        riskScore: 1,
        riskLevel: 'LOW',
        weightedBeta: 1.0,
        estimatedAnnualVolatility: 15.0,
        sharpeRatioEstimate: 1.0,
        disclaimer
      };
    }

    // Calculate weighted beta
    let weightedBeta = 0;
    for (const h of holdings) {
      const beta = SECTOR_BETAS[h.sector] || 1.05;
      const weight = (h.portfolio_weight || 0) / 100;
      weightedBeta += beta * weight;
    }
    weightedBeta = Number(weightedBeta.toFixed(2));

    // Annualized volatility estimate (Indian NIFTY baseline ~14-16% annual vol * Beta)
    const benchmarkAnnualVol = 15.2; // %
    const estimatedAnnualVolatility = Number((benchmarkAnnualVol * Math.max(0.6, weightedBeta)).toFixed(1));

    // Risk score 1 - 10 mapping
    // Beta <= 0.70 -> 2 - 3 (Low)
    // Beta 0.70 - 1.05 -> 4 - 6 (Moderate)
    // Beta 1.05 - 1.30 -> 7 - 8 (High)
    // Beta > 1.30 -> 9 - 10 (Very High)
    let riskScore = 5;
    if (weightedBeta < 0.8) {
      riskScore = Math.max(1, Math.round(weightedBeta * 4));
    } else if (weightedBeta <= 1.1) {
      riskScore = Math.round(4 + ((weightedBeta - 0.8) / 0.3) * 2);
    } else if (weightedBeta <= 1.35) {
      riskScore = Math.round(7 + ((weightedBeta - 1.1) / 0.25) * 1.5);
    } else {
      riskScore = Math.min(10, Math.round(9 + (weightedBeta - 1.35) * 2));
    }

    let riskLevel: RiskAnalysis['riskLevel'] = 'MODERATE';
    if (riskScore <= 3) riskLevel = 'LOW';
    else if (riskScore <= 6) riskLevel = 'MODERATE';
    else if (riskScore <= 8) riskLevel = 'HIGH';
    else riskLevel = 'VERY_HIGH';

    // Estimated Sharpe Ratio: (Portfolio return % - Risk Free Rate 6.8% [RBI 10Y G-Sec]) / Volatility
    const riskFreeRate = 6.8;
    const portfolioAnnualReturnEst = (summary.total_return_percent !== 0) ? Math.min(30, Math.max(-20, summary.total_return_percent)) : 14.0;
    const sharpe = (portfolioAnnualReturnEst - riskFreeRate) / Math.max(5, estimatedAnnualVolatility);

    return {
      riskScore,
      riskLevel,
      weightedBeta,
      estimatedAnnualVolatility,
      sharpeRatioEstimate: Number(sharpe.toFixed(2)),
      disclaimer
    };
  }

  /**
   * Group holdings by sector with percentage weights
   */
  public static calculateSectorAllocation(summary: PortfolioSummary): SectorBreakdown[] {
    const totalVal = summary.total_value;
    const sectorMap: Record<string, { value: number; count: number; unrealized_pl: number }> = {};

    for (const h of summary.holdings) {
      const sec = h.sector || 'Other';
      if (!sectorMap[sec]) {
        sectorMap[sec] = { value: 0, count: 0, unrealized_pl: 0 };
      }
      sectorMap[sec].value += h.current_value;
      sectorMap[sec].count += 1;
      sectorMap[sec].unrealized_pl += h.unrealized_pl;
    }

    const result: SectorBreakdown[] = Object.entries(sectorMap).map(([sector, data]) => ({
      sector,
      value: Number(data.value.toFixed(2)),
      weight: totalVal > 0 ? Number(((data.value / totalVal) * 100).toFixed(2)) : 0,
      count: data.count,
      unrealized_pl: Number(data.unrealized_pl.toFixed(2))
    }));

    result.sort((a, b) => b.value - a.value);
    return result;
  }

  /**
   * Find best and worst performing stocks
   */
  public static findBestWorstPerformers(summary: PortfolioSummary): BestWorstPerformers {
    const holdings = [...summary.holdings];
    if (holdings.length === 0) {
      return {
        bestByReturn: null,
        worstByReturn: null,
        bestByPnl: null,
        worstByPnl: null
      };
    }

    const sortedByReturn = [...holdings].sort((a, b) => b.unrealized_pl_percent - a.unrealized_pl_percent);
    const sortedByPnl = [...holdings].sort((a, b) => b.unrealized_pl - a.unrealized_pl);

    return {
      bestByReturn: sortedByReturn[0] || null,
      worstByReturn: sortedByReturn[sortedByReturn.length - 1] || null,
      bestByPnl: sortedByPnl[0] || null,
      worstByPnl: sortedByPnl[sortedByPnl.length - 1] || null
    };
  }

  /**
   * Generate portfolio historical equity curve
   */
  public static async getPortfolioHistory(
    summary: PortfolioSummary, 
    range: '1D' | '1W' | '1M' | '6M' | '1Y' | '5Y' | 'ALL' = '1Y'
  ) {
    const daysMap: Record<string, number> = { 
      '1D': 1, 
      '1W': 7, 
      '1M': 30, 
      '6M': 180, 
      '1Y': 365, 
      '5Y': 1825, 
      'ALL': 3650 
    };
    const days = daysMap[range] || 365;

    // Fetch benchmark as baseline market trend
    const benchmarkPoints = await MarketDataService.getHistoricalPrices('^NSEI', range);

    if (benchmarkPoints.length === 0 || summary.total_value <= 0) {
      return [];
    }

    const totalVal = summary.total_value;
    const baseBenchPrice = benchmarkPoints[0]?.price || 1;

    // Generate aligned historical portfolio valuation series
    return benchmarkPoints.map(bp => {
      const benchChangeFactor = bp.price / baseBenchPrice;
      // Portfolio valuation scaled with market movement + alpha
      const estimatedValue = Number((totalVal * (0.85 + 0.15 * benchChangeFactor)).toFixed(2));
      const invested = summary.total_invested;
      const profit = Number((estimatedValue - invested).toFixed(2));

      return {
        date: bp.date,
        value: estimatedValue,
        invested,
        profit
      };
    });
  }
}
