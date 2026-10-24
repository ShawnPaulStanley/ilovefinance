import React, { useState } from 'react';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  MagnifyingGlass, 
  ArrowsDownUp, 
  Plus, 
  Minus, 
  ArrowSquareOut 
} from '@phosphor-icons/react';
import { HoldingCalculated } from '../../types/finance';
import { formatINR, formatPercent, cleanTicker } from '../../utils/formatters';

interface HoldingsTableProps {
  holdings: HoldingCalculated[];
  onSelectStock: (symbol: string) => void;
  onTradeStock: (symbol: string, defaultType: 'BUY' | 'SELL') => void;
}

type SortField = 'symbol' | 'current_value' | 'portfolio_weight' | 'unrealized_pl_percent' | 'todays_pl';

export const HoldingsTable: React.FC<HoldingsTableProps> = ({
  holdings,
  onSelectStock,
  onTradeStock,
}) => {
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<SortField>('current_value');
  const [sortAsc, setSortAsc] = useState(false);

  const filteredHoldings = holdings.filter(h => 
    h.symbol.toLowerCase().includes(search.toLowerCase()) ||
    h.name.toLowerCase().includes(search.toLowerCase()) ||
    h.sector.toLowerCase().includes(search.toLowerCase())
  );

  filteredHoldings.sort((a, b) => {
    let aVal: any = a[sortField];
    let bVal: any = b[sortField];
    if (typeof aVal === 'string') {
      return sortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }
    return sortAsc ? aVal - bVal : bVal - aVal;
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <div className="bg-[#141710] border border-[#2B2F23] rounded-3xl p-6 shadow-sm my-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-[#2B2F23] gap-4">
        <div>
          <h3 className="font-display text-2xl sm:text-3xl font-extrabold uppercase tracking-wide text-white">
            ACTIVE PORTFOLIO HOLDINGS
          </h3>
          <p className="text-xs font-mono uppercase tracking-wider text-[#8E9482] mt-0.5">
            EQUITY POSITIONS, WEIGHTED COST BASIS & PERFORMANCE
          </p>
        </div>

        {/* Search Filter */}
        <div className="relative w-full sm:w-72">
          <MagnifyingGlass size={16} weight="bold" className="text-[#8E9482] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="SEARCH HOLDING OR SECTOR..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0D0D0D] text-xs font-mono text-white placeholder:text-[#8E9482] pl-10 pr-3.5 py-2.5 rounded-2xl border border-[#2B2F23] focus:outline-none focus:border-[#D7FF00] uppercase"
          />
        </div>
      </div>

      <div className="overflow-x-auto mt-5">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-[#2B2F23] text-[#8E9482] font-mono font-bold uppercase tracking-wider select-none text-[11px]">
              <th className="pb-3.5 cursor-pointer" onClick={() => handleSort('symbol')}>
                <div className="flex items-center space-x-1.5">
                  <span>Instrument</span>
                  <ArrowsDownUp size={12} weight="bold" />
                </div>
              </th>
              <th className="pb-3.5 text-right">Shares</th>
              <th className="pb-3.5 text-right">Avg Cost</th>
              <th className="pb-3.5 text-right">LTP (Price)</th>
              <th className="pb-3.5 text-right cursor-pointer" onClick={() => handleSort('todays_pl')}>
                <div className="flex items-center justify-end space-x-1.5">
                  <span>Today's Change</span>
                  <ArrowsDownUp size={12} weight="bold" />
                </div>
              </th>
              <th className="pb-3.5 text-right cursor-pointer" onClick={() => handleSort('current_value')}>
                <div className="flex items-center justify-end space-x-1.5">
                  <span>Valuation</span>
                  <ArrowsDownUp size={12} weight="bold" />
                </div>
              </th>
              <th className="pb-3.5 text-right cursor-pointer" onClick={() => handleSort('unrealized_pl_percent')}>
                <div className="flex items-center justify-end space-x-1.5">
                  <span>Net P&L</span>
                  <ArrowsDownUp size={12} weight="bold" />
                </div>
              </th>
              <th className="pb-3.5 text-right cursor-pointer" onClick={() => handleSort('portfolio_weight')}>
                <div className="flex items-center justify-end space-x-1.5">
                  <span>Weight</span>
                  <ArrowsDownUp size={12} weight="bold" />
                </div>
              </th>
              <th className="pb-3.5 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2B2F23]/60">
            {filteredHoldings.length > 0 ? (
              filteredHoldings.map((h) => {
                const isPlPositive = h.unrealized_pl >= 0;
                const isDayPositive = h.day_change >= 0;

                return (
                  <tr 
                    key={h.symbol}
                    className="hover:bg-[#1C2016] transition group cursor-pointer"
                    onClick={() => onSelectStock(h.symbol)}
                  >
                    {/* Symbol & Name */}
                    <td className="py-4 pr-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-xl bg-[#0D0D0D] border border-[#2B2F23] text-[#D7FF00] font-display font-extrabold flex items-center justify-center text-sm shrink-0">
                          {cleanTicker(h.symbol).slice(0, 2)}
                        </div>
                        <div>
                          <div className="font-display text-base font-extrabold uppercase tracking-wide text-white group-hover:text-[#D7FF00] transition flex items-center space-x-1.5">
                            <span>{cleanTicker(h.symbol)}</span>
                            <span className="text-[10px] font-mono text-[#8E9482] px-1 py-0.2 bg-[#0D0D0D] border border-[#2B2F23] rounded">
                              {h.exchange}
                            </span>
                          </div>
                          <div className="text-[11px] font-mono text-[#8E9482] truncate max-w-[160px] uppercase">{h.name}</div>
                        </div>
                      </div>
                    </td>

                    {/* Quantity */}
                    <td className="py-4 text-right font-mono font-bold text-white">
                      {h.quantity.toLocaleString('en-IN')}
                    </td>

                    {/* Avg Buy Price */}
                    <td className="py-4 text-right font-mono text-[#8E9482]">
                      {formatINR(h.avg_buy_price)}
                    </td>

                    {/* Current Market Price */}
                    <td className="py-4 text-right font-mono font-bold text-white">
                      {formatINR(h.current_price)}
                    </td>

                    {/* Today's Change */}
                    <td className="py-4 text-right font-mono">
                      <div className={`font-bold ${isDayPositive ? 'text-[#D7FF00]' : 'text-[#FF4343]'}`}>
                        {isDayPositive ? '+' : ''}{formatINR(h.day_change)}
                      </div>
                      <div className={`text-[10px] ${isDayPositive ? 'text-[#D7FF00]' : 'text-[#FF4343]'}`}>
                        {formatPercent(h.day_change_percent)}
                      </div>
                    </td>

                    {/* Current Value */}
                    <td className="py-4 text-right font-mono">
                      <div className="font-bold text-white">{formatINR(h.current_value)}</div>
                      <div className="text-[10px] text-[#8E9482]">INV: {formatINR(h.total_invested)}</div>
                    </td>

                    {/* Unrealized P/L */}
                    <td className="py-4 text-right font-mono">
                      <div className={`font-bold flex items-center justify-end ${
                        isPlPositive ? 'text-[#D7FF00]' : 'text-[#FF4343]'
                      }`}>
                        {isPlPositive ? <ArrowUpRight size={14} weight="bold" /> : <ArrowDownRight size={14} weight="bold" />}
                        {isPlPositive ? '+' : ''}{formatINR(h.unrealized_pl)}
                      </div>
                      <div className={`text-[10px] ${isPlPositive ? 'text-[#D7FF00]' : 'text-[#FF4343]'}`}>
                        {formatPercent(h.unrealized_pl_percent)}
                      </div>
                    </td>

                    {/* Weight */}
                    <td className="py-4 text-right font-mono">
                      <span className="px-2.5 py-1 rounded-lg bg-[#0D0D0D] text-[#D7FF00] font-bold border border-[#2B2F23]">
                        {h.portfolio_weight.toFixed(1)}%
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center space-x-1.5">
                        <button
                          onClick={() => onTradeStock(h.symbol, 'BUY')}
                          title="Buy More Shares"
                          className="p-2 rounded-xl bg-[#0D0D0D] text-[#D7FF00] hover:bg-[#D7FF00] hover:text-black border border-[#2B2F23] transition"
                        >
                          <Plus size={14} weight="bold" />
                        </button>
                        <button
                          onClick={() => onTradeStock(h.symbol, 'SELL')}
                          title="Sell Shares"
                          className="p-2 rounded-xl bg-[#0D0D0D] text-[#FF4343] hover:bg-[#FF4343] hover:text-white border border-[#2B2F23] transition"
                        >
                          <Minus size={14} weight="bold" />
                        </button>
                        <button
                          onClick={() => onSelectStock(h.symbol)}
                          title="View Details"
                          className="p-2 rounded-xl bg-[#0D0D0D] text-white hover:text-[#D7FF00] hover:border-[#D7FF00] border border-[#2B2F23] transition"
                        >
                          <ArrowSquareOut size={14} weight="bold" />
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={9} className="py-10 text-center text-[#8E9482] font-mono text-xs uppercase">
                  {search ? 'No positions matching search.' : 'No active holdings in this portfolio.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
