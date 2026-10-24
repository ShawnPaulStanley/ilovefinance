import React from 'react';
import { 
  TrendUp, 
  TrendDown, 
  Wallet, 
  Coins, 
  ArrowUpRight, 
  ArrowDownRight,
  Sparkle,
  ChartPie
} from '@phosphor-icons/react';
import { PortfolioSummary } from '../../types/finance';
import { formatINR, formatPercent } from '../../utils/formatters';

interface MetricsGridProps {
  summary: PortfolioSummary | null;
  onLoadSample: () => void;
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({ summary, onLoadSample }) => {
  if (!summary || summary.holdings.length === 0) {
    return (
      <div className="bg-[#141710] rounded-3xl border-2 border-dashed border-[#2B2F23] p-10 text-center my-8">
        <div className="max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-[#1C2016] border border-[#D7FF00]/40 text-[#D7FF00] mx-auto flex items-center justify-center shadow-[0_0_20px_rgba(215,255,0,0.15)]">
            <ChartPie size={32} weight="bold" />
          </div>
          <h3 className="font-display text-3xl font-extrabold uppercase tracking-wide text-white">
            PORTFOLIO TRACKER READY
          </h3>
          <p className="text-xs text-[#8E9482] font-sans">
            Start tracking and analyzing Indian equities (NSE & BSE). Record your first stock transaction or import a balanced Indian bluechip portfolio with one click.
          </p>
          <div className="pt-2">
            <button
              onClick={onLoadSample}
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-2xl bg-[#D7FF00] hover:bg-[#C7FF3D] text-black font-display font-extrabold uppercase text-sm tracking-wider shadow-[0_0_25px_rgba(215,255,0,0.35)] transition active:scale-95"
            >
              <Sparkle size={18} weight="fill" />
              <span>LOAD INDIAN BLUECHIP PORTFOLIO</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isReturnPositive = summary.total_pnl >= 0;
  const isTodayPositive = summary.todays_pl >= 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-8">
      
      {/* 1. Portfolio Value */}
      <div className="bg-[#141710] border border-[#2B2F23] hover:border-[#D7FF00]/40 rounded-3xl p-6 shadow-sm relative overflow-hidden transition group">
        <div className="flex items-center justify-between">
          <span className="font-display text-sm font-bold uppercase tracking-widest text-[#8E9482]">
            PORTFOLIO VALUE
          </span>
          <div className="w-10 h-10 rounded-2xl bg-[#1C2016] border border-[#2B2F23] text-[#D7FF00] flex items-center justify-center">
            <Wallet size={20} weight="bold" />
          </div>
        </div>
        <div className="mt-4">
          <div className="font-display text-4xl sm:text-5xl font-extrabold tracking-wide text-white">
            {formatINR(summary.total_value)}
          </div>
          <div className="mt-2 flex items-center space-x-2 text-xs font-mono text-[#8E9482]">
            <span className="text-[#D7FF00] font-bold">{summary.holdings_count} STOCKS</span>
            <span>/</span>
            <span>CURRENT VALUATION</span>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-28 h-28 bg-[#D7FF00]/5 rounded-full blur-2xl pointer-events-none group-hover:bg-[#D7FF00]/10 transition" />
      </div>

      {/* 2. Total Return */}
      <div className="bg-[#141710] border border-[#2B2F23] hover:border-[#D7FF00]/40 rounded-3xl p-6 shadow-sm relative overflow-hidden transition group">
        <div className="flex items-center justify-between">
          <span className="font-display text-sm font-bold uppercase tracking-widest text-[#8E9482]">
            TOTAL RETURN
          </span>
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${
            isReturnPositive 
              ? 'bg-[#1C2016] border-[#D7FF00]/40 text-[#D7FF00]' 
              : 'bg-[#201616] border-[#FF4343]/40 text-[#FF4343]'
          }`}>
            {isReturnPositive ? <TrendUp size={20} weight="bold" /> : <TrendDown size={20} weight="bold" />}
          </div>
        </div>
        <div className="mt-4">
          <div className={`font-display text-4xl sm:text-5xl font-extrabold tracking-wide flex items-center ${
            isReturnPositive ? 'text-[#D7FF00]' : 'text-[#FF4343]'
          }`}>
            {isReturnPositive ? <ArrowUpRight size={32} weight="bold" className="mr-0.5 inline shrink-0" /> : <ArrowDownRight size={32} weight="bold" className="mr-0.5 inline shrink-0" />}
            {formatPercent(summary.total_return_percent)}
          </div>
          <div className="mt-2 flex items-center space-x-2 text-xs font-mono">
            <span className={`font-bold ${isReturnPositive ? 'text-[#D7FF00]' : 'text-[#FF4343]'}`}>
              {formatINR(summary.total_pnl)}
            </span>
            <span className="text-[#8E9482]">/</span>
            <span className="text-[#8E9482] uppercase">NET GAIN</span>
          </div>
        </div>
      </div>

      {/* 3. Today's P/L */}
      <div className="bg-[#141710] border border-[#2B2F23] hover:border-[#D7FF00]/40 rounded-3xl p-6 shadow-sm relative overflow-hidden transition group">
        <div className="flex items-center justify-between">
          <span className="font-display text-sm font-bold uppercase tracking-widest text-[#8E9482]">
            TODAY'S P&L
          </span>
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${
            isTodayPositive 
              ? 'bg-[#1C2016] border-[#D7FF00]/40 text-[#D7FF00]' 
              : 'bg-[#201616] border-[#FF4343]/40 text-[#FF4343]'
          }`}>
            {isTodayPositive ? <TrendUp size={20} weight="bold" /> : <TrendDown size={20} weight="bold" />}
          </div>
        </div>
        <div className="mt-4">
          <div className={`font-display text-4xl sm:text-5xl font-extrabold tracking-wide flex items-center ${
            isTodayPositive ? 'text-[#D7FF00]' : 'text-[#FF4343]'
          }`}>
            {isTodayPositive ? '+' : ''}{formatINR(summary.todays_pl)}
          </div>
          <div className="mt-2 flex items-center space-x-2 text-xs font-mono">
            <span className={`font-bold px-2 py-0.5 rounded ${
              isTodayPositive ? 'bg-[#D7FF00]/15 text-[#D7FF00] border border-[#D7FF00]/30' : 'bg-[#FF4343]/15 text-[#FF4343] border border-[#FF4343]/30'
            }`}>
              {formatPercent(summary.todays_pl_percent)}
            </span>
            <span className="text-[#8E9482] uppercase">VS PREV CLOSE</span>
          </div>
        </div>
      </div>

      {/* 4. Invested Capital */}
      <div className="bg-[#141710] border border-[#2B2F23] hover:border-[#D7FF00]/40 rounded-3xl p-6 shadow-sm relative overflow-hidden transition group">
        <div className="flex items-center justify-between">
          <span className="font-display text-sm font-bold uppercase tracking-widest text-[#8E9482]">
            INVESTED CAPITAL
          </span>
          <div className="w-10 h-10 rounded-2xl bg-[#1C2016] border border-[#2B2F23] text-[#C7FF3D] flex items-center justify-center">
            <Coins size={20} weight="bold" />
          </div>
        </div>
        <div className="mt-4">
          <div className="font-display text-4xl sm:text-5xl font-extrabold tracking-wide text-white">
            {formatINR(summary.total_invested)}
          </div>
          <div className="mt-2 flex items-center space-x-2 text-xs font-mono text-[#8E9482]">
            <span>DIVIDENDS: <span className="text-[#D7FF00] font-bold">{formatINR(summary.total_dividends)}</span></span>
            <span>/</span>
            <span>REALIZED: <span className={`font-bold ${summary.realized_pl >= 0 ? 'text-[#D7FF00]' : 'text-[#FF4343]'}`}>{formatINR(summary.realized_pl)}</span></span>
          </div>
        </div>
      </div>

    </div>
  );
};
