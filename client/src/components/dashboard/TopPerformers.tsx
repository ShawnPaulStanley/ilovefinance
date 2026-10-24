import React from 'react';
import { Trophy, TrendDown, ArrowUpRight, ArrowDownRight } from '@phosphor-icons/react';
import { BestWorstPerformers } from '../../types/finance';
import { formatINR, formatPercent, cleanTicker } from '../../utils/formatters';

interface TopPerformersProps {
  data: BestWorstPerformers | null;
  onSelectStock: (symbol: string) => void;
}

export const TopPerformers: React.FC<TopPerformersProps> = ({ data, onSelectStock }) => {
  if (!data || (!data.bestByReturn && !data.worstByReturn)) return null;

  const { bestByReturn, worstByReturn } = data;

  return (
    <div className="grid grid-cols-1 gap-4 my-4">
      
      {/* Best Performer Card */}
      {bestByReturn && (
        <div 
          onClick={() => onSelectStock(bestByReturn.symbol)}
          className="bg-[#141710] border border-[#2B2F23] hover:border-[#D7FF00]/50 rounded-3xl p-5 shadow-sm cursor-pointer transition group overflow-hidden"
        >
          {/* Card Header */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center space-x-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-[#1C2016] border border-[#D7FF00]/30 text-[#D7FF00] flex items-center justify-center shrink-0">
                <Trophy size={16} weight="bold" />
              </div>
              <span className="font-display text-xs font-bold text-[#D7FF00] uppercase tracking-wider truncate">
                TOP PERFORMER
              </span>
            </div>
            <span className="text-xs font-mono font-bold text-[#D7FF00] px-2.5 py-1 rounded-xl bg-[#D7FF00]/10 border border-[#D7FF00]/30 flex items-center shrink-0">
              <ArrowUpRight size={13} weight="bold" className="mr-0.5" />
              {formatPercent(bestByReturn.unrealized_pl_percent)}
            </span>
          </div>

          {/* Card Body */}
          <div className="mt-4 flex items-end justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="font-display text-2xl font-extrabold uppercase tracking-wide text-white group-hover:text-[#D7FF00] transition truncate">
                {cleanTicker(bestByReturn.symbol)}
              </div>
              <div className="text-[11px] text-[#8E9482] uppercase font-mono truncate mt-0.5">
                {bestByReturn.name}
              </div>
            </div>
            <div className="text-right font-mono shrink-0">
              <div className="text-sm font-bold text-[#D7FF00]">
                +{formatINR(bestByReturn.unrealized_pl)}
              </div>
              <div className="text-[11px] text-[#8E9482] mt-0.5">
                VAL: {formatINR(bestByReturn.current_value)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Worst Performer Card */}
      {worstByReturn && (
        <div 
          onClick={() => onSelectStock(worstByReturn.symbol)}
          className="bg-[#141710] border border-[#2B2F23] hover:border-[#FF4343]/50 rounded-3xl p-5 shadow-sm cursor-pointer transition group overflow-hidden"
        >
          {/* Card Header */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center space-x-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-[#201616] border border-[#FF4343]/30 text-[#FF4343] flex items-center justify-center shrink-0">
                <TrendDown size={16} weight="bold" />
              </div>
              <span className="font-display text-xs font-bold text-[#FF4343] uppercase tracking-wider truncate">
                LAGGING ASSET
              </span>
            </div>
            <span className="text-xs font-mono font-bold text-[#FF4343] px-2.5 py-1 rounded-xl bg-[#FF4343]/10 border border-[#FF4343]/30 flex items-center shrink-0">
              <ArrowDownRight size={13} weight="bold" className="mr-0.5" />
              {formatPercent(worstByReturn.unrealized_pl_percent)}
            </span>
          </div>

          {/* Card Body */}
          <div className="mt-4 flex items-end justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="font-display text-2xl font-extrabold uppercase tracking-wide text-white group-hover:text-[#FF4343] transition truncate">
                {cleanTicker(worstByReturn.symbol)}
              </div>
              <div className="text-[11px] text-[#8E9482] uppercase font-mono truncate mt-0.5">
                {worstByReturn.name}
              </div>
            </div>
            <div className="text-right font-mono shrink-0">
              <div className={`text-sm font-bold ${worstByReturn.unrealized_pl >= 0 ? 'text-[#D7FF00]' : 'text-[#FF4343]'}`}>
                {worstByReturn.unrealized_pl >= 0 ? '+' : ''}{formatINR(worstByReturn.unrealized_pl)}
              </div>
              <div className="text-[11px] text-[#8E9482] mt-0.5">
                VAL: {formatINR(worstByReturn.current_value)}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
