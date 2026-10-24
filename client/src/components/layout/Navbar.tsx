import React from 'react';
import { 
  TrendUp, 
  Plus, 
  BookmarkSimple, 
  ClockCounterClockwise, 
  FolderSimple, 
  Sparkle,
  ArrowsClockwise
} from '@phosphor-icons/react';
import { Portfolio } from '../../types/finance';
import { formatINR, formatPercent } from '../../utils/formatters';

interface NavbarProps {
  portfolios: Portfolio[];
  selectedPortfolioId: string;
  onSelectPortfolio: (id: string) => void;
  onOpenNewTransaction: () => void;
  onOpenHistory: () => void;
  onOpenPortfolioManager: () => void;
  onOpenWatchlist: () => void;
  onLoadSample: () => void;
  onRefresh: () => void;
  isLoading: boolean;
  benchmarkData: {
    nifty?: { current_price: number; day_change: number; day_change_percent: number };
    sensex?: { current_price: number; day_change: number; day_change_percent: number };
  } | null;
  marketStatus: {
    isOpen: boolean;
    status: string;
    istTime: string;
  } | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  portfolios,
  selectedPortfolioId,
  onSelectPortfolio,
  onOpenNewTransaction,
  onOpenHistory,
  onOpenPortfolioManager,
  onOpenWatchlist,
  onLoadSample,
  onRefresh,
  isLoading,
  benchmarkData,
  marketStatus
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0D0D0D]/95 backdrop-blur-xl border-b border-[#2B2F23]">
      
      {/* 1. Live Indian Benchmark Ticker Strip (Tier 1 Top Bar) */}
      <div className="bg-[#080808] border-b border-[#2B2F23]/80 py-1.5 px-4 sm:px-6 lg:px-8 text-xs font-mono">
        <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto no-scrollbar gap-4 sm:gap-6">
          
          {/* Indices Group */}
          <div className="flex items-center space-x-4 sm:space-x-6 shrink-0">
            {/* NIFTY 50 */}
            <div className="flex items-center space-x-2">
              <span className="text-[#8E9482] font-semibold uppercase tracking-wider text-[11px]">
                NIFTY 50
              </span>
              <span className="font-bold text-white text-xs sm:text-sm">
                {benchmarkData?.nifty ? benchmarkData.nifty.current_price.toLocaleString('en-IN') : '24,850.30'}
              </span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                (benchmarkData?.nifty?.day_change ?? 1) >= 0 
                  ? 'text-[#D7FF00] bg-[#D7FF00]/10 border border-[#D7FF00]/30' 
                  : 'text-[#FF4343] bg-[#FF4343]/10 border border-[#FF4343]/30'
              }`}>
                {benchmarkData?.nifty ? formatPercent(benchmarkData.nifty.day_change_percent) : '+0.28%'}
              </span>
            </div>

            <div className="w-px h-3.5 bg-[#2B2F23]"></div>

            {/* SENSEX */}
            <div className="flex items-center space-x-2">
              <span className="text-[#8E9482] font-semibold uppercase tracking-wider text-[11px]">
                SENSEX
              </span>
              <span className="font-bold text-white text-xs sm:text-sm">
                {benchmarkData?.sensex ? benchmarkData.sensex.current_price.toLocaleString('en-IN') : '81,420.50'}
              </span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                (benchmarkData?.sensex?.day_change ?? 1) >= 0 
                  ? 'text-[#D7FF00] bg-[#D7FF00]/10 border border-[#D7FF00]/30' 
                  : 'text-[#FF4343] bg-[#FF4343]/10 border border-[#FF4343]/30'
              }`}>
                {benchmarkData?.sensex ? formatPercent(benchmarkData.sensex.day_change_percent) : '+0.26%'}
              </span>
            </div>
          </div>

          {/* Session Status & Market Provider */}
          <div className="flex items-center space-x-4 shrink-0 text-[11px]">
            {marketStatus && (
              <div className="flex items-center space-x-2">
                <span className={`w-2 h-2 rounded-full ${marketStatus.isOpen ? 'bg-[#D7FF00] animate-pulse shadow-[0_0_8px_#D7FF00]' : 'bg-[#FFB800]'}`} />
                <span className={marketStatus.isOpen ? 'text-[#D7FF00] font-bold uppercase' : 'text-[#FFB800] font-bold uppercase'}>
                  {marketStatus.isOpen ? 'LIVE SESSION' : 'MARKET CLOSED'}
                </span>
                <span className="text-[#8E9482] hidden sm:inline">({marketStatus.istTime})</span>
              </div>
            )}
            <div className="hidden md:flex items-center space-x-1.5 pl-3 border-l border-[#2B2F23] text-[#8E9482]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D7FF00]/60"></span>
              <span className="text-[10px] uppercase tracking-wider">BSE / NSE MARKET FEED</span>
            </div>
          </div>

        </div>
      </div>

      {/* 2. Main Navigation Bar (Tier 2 Primary Bar) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3 sm:gap-6">
          
          {/* Logo & Visual Identity */}
          <div className="flex items-center space-x-3 shrink-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#141710] border-2 border-[#D7FF00] flex items-center justify-center shadow-[0_0_15px_rgba(215,255,0,0.2)] shrink-0">
              <TrendUp size={22} weight="bold" className="text-[#D7FF00]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <span className="font-display text-2xl sm:text-3xl font-extrabold tracking-wider text-white uppercase leading-none truncate">
                  ILOVEFINANCE
                </span>
                <span className="text-[10px] uppercase tracking-widest font-mono font-bold px-1.5 py-0.5 rounded bg-[#2B2F23] text-[#D7FF00] border border-[#D7FF00]/40 shrink-0">
                  NSE / BSE
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] font-mono tracking-tight text-[#8E9482] uppercase mt-0.5 truncate hidden sm:block">
                Indian Equities Intelligence
              </p>
            </div>
          </div>

          {/* Action Buttons & Portfolio Switcher */}
          <div className="flex items-center space-x-2 sm:space-x-2.5 shrink-0">
            
            {/* Portfolio Selector */}
            <div className="flex items-center bg-[#141710] rounded-xl border border-[#2B2F23] p-0.5 max-w-[140px] xs:max-w-[180px] sm:max-w-[220px] md:max-w-[260px]">
              <select
                value={selectedPortfolioId}
                onChange={(e) => onSelectPortfolio(e.target.value)}
                className="bg-transparent text-white text-xs sm:text-sm font-semibold rounded-lg px-2 sm:px-3 py-1.5 focus:outline-none cursor-pointer truncate w-full"
              >
                {portfolios.map((p) => (
                  <option key={p.id} value={p.id} className="bg-[#141710] text-white">
                    {p.name.toUpperCase()} {p.total_value ? `(${formatINR(p.total_value)})` : ''}
                  </option>
                ))}
              </select>
              <button
                onClick={onOpenPortfolioManager}
                title="Manage Portfolios"
                className="p-1.5 sm:p-2 text-[#8E9482] hover:text-[#D7FF00] hover:bg-[#1C2016] rounded-lg transition shrink-0"
              >
                <FolderSimple size={16} weight="bold" />
              </button>
            </div>

            {/* Load Sample Data Button */}
            <button
              onClick={onLoadSample}
              title="Load Indian Bluechip Sample Portfolio"
              className="hidden lg:flex items-center space-x-1.5 px-3 py-2 text-xs font-bold uppercase tracking-wider text-black bg-[#C7FF3D] hover:bg-[#D7FF00] rounded-xl transition shadow-[0_0_15px_rgba(199,255,61,0.25)] shrink-0"
            >
              <Sparkle size={14} weight="fill" />
              <span>Sample</span>
            </button>

            {/* Watchlist Toggle */}
            <button
              onClick={onOpenWatchlist}
              title="Watchlist"
              className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-[#141710] hover:bg-[#1C2016] hover:text-[#D7FF00] border border-[#2B2F23] rounded-xl transition shrink-0"
            >
              <BookmarkSimple size={16} weight="bold" className="text-[#D7FF00]" />
              <span className="hidden md:inline">Watchlist</span>
            </button>

            {/* Transaction History Button */}
            <button
              onClick={onOpenHistory}
              title="Transaction History"
              className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-[#141710] hover:bg-[#1C2016] hover:text-[#D7FF00] border border-[#2B2F23] rounded-xl transition shrink-0"
            >
              <ClockCounterClockwise size={16} weight="bold" className="text-[#C7FF3D]" />
              <span className="hidden md:inline">Trades</span>
            </button>

            {/* Refresh Market Data */}
            <button
              onClick={onRefresh}
              disabled={isLoading}
              title="Refresh Prices"
              className="p-2 text-[#8E9482] hover:text-[#D7FF00] hover:bg-[#1C2016] bg-[#141710] rounded-xl border border-[#2B2F23] transition disabled:opacity-50 shrink-0"
            >
              <ArrowsClockwise size={16} weight="bold" className={isLoading ? 'animate-spin text-[#D7FF00]' : ''} />
            </button>

            {/* Add Transaction CTA */}
            <button
              onClick={onOpenNewTransaction}
              className="flex items-center space-x-1.5 px-3 sm:px-4 py-2 text-xs sm:text-sm font-display font-extrabold uppercase tracking-wider text-black bg-[#D7FF00] hover:bg-[#C7FF3D] rounded-xl shadow-[0_0_20px_rgba(215,255,0,0.35)] transition active:scale-95 shrink-0"
            >
              <Plus size={16} weight="bold" />
              <span className="hidden sm:inline">RECORD TRADE</span>
              <span className="sm:hidden">TRADE</span>
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
