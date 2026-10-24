import React, { useState, useEffect, useCallback } from 'react';
import { 
  fetchPortfolios, 
  fetchAnalytics, 
  fetchBenchmarks, 
  fetchMarketStatus, 
  seedSamplePortfolio,
  fetchWatchlist,
  addToWatchlist,
  removeFromWatchlist
} from './services/api';
import { 
  Portfolio, 
  AnalyticsResponse, 
  MarketStatusResponse, 
  HoldingCalculated 
} from './types/finance';
import { Navbar } from './components/layout/Navbar';
import { MetricsGrid } from './components/dashboard/MetricsGrid';
import { PerformanceChart } from './components/dashboard/PerformanceChart';
import { BenchmarkComparison } from './components/dashboard/BenchmarkComparison';
import { AllocationCharts } from './components/dashboard/AllocationCharts';
import { RiskAndDiversification } from './components/dashboard/RiskAndDiversification';
import { TopPerformers } from './components/dashboard/TopPerformers';
import { HoldingsTable } from './components/dashboard/HoldingsTable';
import { StockDetailModal } from './components/stocks/StockDetailModal';
import { TransactionModal } from './components/transactions/TransactionModal';
import { TransactionHistoryModal } from './components/transactions/TransactionHistoryModal';
import { WatchlistPanel } from './components/watchlist/WatchlistPanel';
import { PortfolioModal } from './components/portfolio/PortfolioModal';

export const App: React.FC = () => {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([
    { id: 'main-portfolio-1', name: 'Main Growth Portfolio', description: 'Primary Indian equities portfolio', is_default: 1, created_at: '', updated_at: '' }
  ]);
  const [selectedPortfolioId, setSelectedPortfolioId] = useState<string>('main-portfolio-1');
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
  const [benchmarks, setBenchmarks] = useState<any | null>(null);
  const [marketStatus, setMarketStatus] = useState<MarketStatusResponse | null>(null);
  const [watchlistSymbols, setWatchlistSymbols] = useState<Set<string>>(new Set());
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '6M' | '1Y' | 'ALL'>('1Y');
  const [isLoading, setIsLoading] = useState(false);

  // Modals state
  const [selectedStockSymbol, setSelectedStockSymbol] = useState<string | null>(null);
  const [tradeModalOpen, setTradeModalOpen] = useState(false);
  const [tradeDefaultSymbol, setTradeDefaultSymbol] = useState('');
  const [tradeDefaultType, setTradeDefaultType] = useState<'BUY' | 'SELL' | 'DIVIDEND'>('BUY');
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [portfolioModalOpen, setPortfolioModalOpen] = useState(false);
  const [watchlistOpen, setWatchlistOpen] = useState(false);

  // 1. Initial Load of Portfolios & Market Benchmarks
  const loadInitial = useCallback(async () => {
    try {
      setIsLoading(true);
      const [ports, bench, status, wList] = await Promise.all([
        fetchPortfolios().catch(() => []),
        fetchBenchmarks().catch(() => null),
        fetchMarketStatus().catch(() => null),
        fetchWatchlist().catch(() => [])
      ]);

      if (ports && ports.length > 0) {
        setPortfolios(ports);
        const defaultPort = ports.find(p => p.is_default) || ports[0];
        setSelectedPortfolioId(defaultPort.id);
      }
      if (bench) setBenchmarks(bench);
      if (status) setMarketStatus(status);
      if (wList && wList.length > 0) {
        setWatchlistSymbols(new Set(wList.map(w => w.stock_symbol.toUpperCase())));
      }
    } catch (err) {
      console.error('Failed to load initial portfolio data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInitial();
  }, [loadInitial]);

  // 2. Load Analytics when selected portfolio or timeframe changes
  const loadPortfolioAnalytics = useCallback(async () => {
    const portId = selectedPortfolioId || 'main-portfolio-1';
    try {
      setIsLoading(true);
      const data = await fetchAnalytics(portId, timeframe);
      setAnalytics(data);
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedPortfolioId, timeframe]);

  useEffect(() => {
    loadPortfolioAnalytics();
  }, [loadPortfolioAnalytics]);

  // Load sample portfolio action
  const handleLoadSample = async () => {
    const portId = selectedPortfolioId || (portfolios[0]?.id) || 'main-portfolio-1';
    setSelectedPortfolioId(portId);
    try {
      setIsLoading(true);
      await seedSamplePortfolio(portId);
      await loadInitial();
      await loadPortfolioAnalytics();
    } catch (err: any) {
      console.error('Failed to load sample portfolio:', err);
      // Retry once after 1s in case serverless cold-start
      setTimeout(async () => {
        try {
          await loadInitial();
          await loadPortfolioAnalytics();
        } catch (_) {}
      }, 1000);
      alert(err.message || 'Connecting to portfolio service... please try again in a few seconds.');
    } finally {
      setIsLoading(false);
    }
  };

  // Open trade modal for specific stock
  const handleTradeStock = (symbol: string, defaultType: 'BUY' | 'SELL' = 'BUY') => {
    setTradeDefaultSymbol(symbol);
    setTradeDefaultType(defaultType);
    setTradeModalOpen(true);
  };

  // Toggle watchlist
  const handleWatchlistToggle = async (symbol: string) => {
    const upper = symbol.toUpperCase();
    try {
      if (watchlistSymbols.has(upper)) {
        await removeFromWatchlist(upper);
        setWatchlistSymbols(prev => {
          const next = new Set(prev);
          next.delete(upper);
          return next;
        });
      } else {
        await addToWatchlist(upper);
        setWatchlistSymbols(prev => new Set(prev).add(upper));
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  const selectedHolding: HoldingCalculated | null = 
    analytics?.summary.holdings.find(h => h.symbol.toLowerCase() === selectedStockSymbol?.toLowerCase()) || null;

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white flex flex-col font-sans overflow-x-hidden w-full">
      
      {/* Top Navbar */}
      <Navbar
        portfolios={portfolios}
        selectedPortfolioId={selectedPortfolioId}
        onSelectPortfolio={setSelectedPortfolioId}
        onOpenNewTransaction={() => {
          setTradeDefaultSymbol('');
          setTradeDefaultType('BUY');
          setTradeModalOpen(true);
        }}
        onOpenHistory={() => setHistoryModalOpen(true)}
        onOpenPortfolioManager={() => setPortfolioModalOpen(true)}
        onOpenWatchlist={() => setWatchlistOpen(true)}
        onLoadSample={handleLoadSample}
        onRefresh={() => {
          loadInitial();
          loadPortfolioAnalytics();
        }}
        isLoading={isLoading}
        benchmarkData={benchmarks}
        marketStatus={marketStatus}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* KPI 4 Cards Grid */}
        <MetricsGrid 
          summary={analytics?.summary || null} 
          onLoadSample={handleLoadSample}
        />

        {/* Dashboard Grid */}
        {analytics && analytics.summary.holdings.length > 0 && (
          <div className="space-y-8">
            
            {/* Top Row: Performance Chart (8 cols) & Allocation Charts (4 cols) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              <div className="lg:col-span-8 space-y-6">
                <PerformanceChart
                  data={analytics.history}
                  currentValue={analytics.summary.total_value}
                  totalInvested={analytics.summary.total_invested}
                  selectedRange={timeframe}
                  onTimeframeChange={setTimeframe}
                />

                <BenchmarkComparison 
                  data={analytics.benchmarkComparison} 
                />
              </div>

              <div className="lg:col-span-4 space-y-6">
                <AllocationCharts
                  sectors={analytics.sectorAllocation}
                  stocks={analytics.stockAllocation}
                />

                <TopPerformers
                  data={analytics.bestWorst}
                  onSelectStock={setSelectedStockSymbol}
                />
              </div>

            </div>

            {/* Middle Row: Diversification & Risk Score Cards */}
            <RiskAndDiversification
              diversification={analytics.diversification}
              risk={analytics.risk}
            />

            {/* Bottom Row: Detailed Active Holdings Table */}
            <HoldingsTable
              holdings={analytics.summary.holdings}
              onSelectStock={setSelectedStockSymbol}
              onTradeStock={handleTradeStock}
            />

          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-[#2B2F23] bg-[#080808] py-8 text-center text-xs font-mono text-[#8E9482]">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-display text-lg tracking-widest text-white uppercase">
            ILOVEFINANCE <span className="text-[#D7FF00]">/</span> NSE & BSE ANALYTICS
          </p>
          <p className="text-[11px] text-[#8E9482] uppercase tracking-wide">
            Powered by Alpha Vantage and local quantitative models. Analytical estimates are for tracking purposes only and do not constitute financial advice.
          </p>
        </div>
      </footer>

      {/* Modals & Slide-overs */}
      <StockDetailModal
        symbol={selectedStockSymbol}
        onClose={() => setSelectedStockSymbol(null)}
        userHolding={selectedHolding}
        onTrade={handleTradeStock}
        isWatchlisted={selectedStockSymbol ? watchlistSymbols.has(selectedStockSymbol.toUpperCase()) : false}
        onWatchlistToggle={handleWatchlistToggle}
      />

      <TransactionModal
        portfolioId={selectedPortfolioId}
        isOpen={tradeModalOpen}
        onClose={() => setTradeModalOpen(false)}
        onTransactionSuccess={() => {
          loadPortfolioAnalytics();
          loadInitial();
        }}
        initialSymbol={tradeDefaultSymbol}
        initialType={tradeDefaultType}
        holdings={analytics?.summary.holdings || []}
      />

      <TransactionHistoryModal
        portfolioId={selectedPortfolioId}
        isOpen={historyModalOpen}
        onClose={() => setHistoryModalOpen(false)}
        onDataChanged={() => {
          loadPortfolioAnalytics();
          loadInitial();
        }}
      />

      <WatchlistPanel
        isOpen={watchlistOpen}
        onClose={() => setWatchlistOpen(false)}
        onTrade={(sym) => {
          setWatchlistOpen(false);
          handleTradeStock(sym, 'BUY');
        }}
        onSelectStock={(sym) => {
          setWatchlistOpen(false);
          setSelectedStockSymbol(sym);
        }}
      />

      <PortfolioModal
        portfolios={portfolios}
        selectedPortfolioId={selectedPortfolioId}
        isOpen={portfolioModalOpen}
        onClose={() => setPortfolioModalOpen(false)}
        onSelectPortfolio={(id) => {
          setSelectedPortfolioId(id);
          setPortfolioModalOpen(false);
        }}
        onPortfoliosChanged={() => {
          loadInitial();
          loadPortfolioAnalytics();
        }}
      />

    </div>
  );
};

export default App;
