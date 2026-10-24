import React, { useState, useEffect } from 'react';
import { 
  X, 
  Plus, 
  Trash, 
  MagnifyingGlass,
  ShoppingCart,
  ArrowSquareOut
} from '@phosphor-icons/react';
import { WatchlistItem } from '../../types/finance';
import { fetchWatchlist, addToWatchlist, removeFromWatchlist, searchStocks } from '../../services/api';
import { formatINR, formatPercent, cleanTicker } from '../../utils/formatters';

interface WatchlistPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onTrade: (symbol: string, type: 'BUY') => void;
  onSelectStock: (symbol: string) => void;
}

export const WatchlistPanel: React.FC<WatchlistPanelProps> = ({
  isOpen,
  onClose,
  onTrade,
  onSelectStock
}) => {
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const loadWatchlist = () => {
    setLoading(true);
    fetchWatchlist()
      .then(res => setItems(res))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (isOpen) {
      loadWatchlist();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!search || search.trim().length === 0) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(() => {
      searchStocks(search)
        .then(res => setSearchResults(res))
        .catch(() => {});
    }, 250);
    return () => clearTimeout(timer);
  }, [search]);

  if (!isOpen) return null;

  const handleAdd = async (symbol: string) => {
    try {
      await addToWatchlist(symbol);
      setSearch('');
      setSearchResults([]);
      loadWatchlist();
    } catch (err: any) {
      alert(err.message || 'Failed to add to watchlist');
    }
  };

  const handleRemove = async (symbol: string) => {
    try {
      await removeFromWatchlist(symbol);
      loadWatchlist();
    } catch (err: any) {
      alert(err.message || 'Failed to remove from watchlist');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="bg-[#0D0D0D] border-l-2 border-[#2B2F23] w-full max-w-md h-full flex flex-col shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-[#2B2F23] flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl font-extrabold uppercase tracking-wide text-white">MARKET WATCHLIST</h2>
            <p className="text-xs font-mono uppercase text-[#8E9482] mt-0.5">TRACK INDIAN EQUITIES</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-[#8E9482] hover:text-white transition">
            <X size={20} weight="bold" />
          </button>
        </div>

        {/* Add Stock to Watchlist Search Box */}
        <div className="p-5 border-b border-[#2B2F23] bg-[#141710]">
          <div className="relative font-mono">
            <MagnifyingGlass size={16} weight="bold" className="text-[#8E9482] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="SEARCH STOCK TO WATCH..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#0D0D0D] text-xs text-white placeholder:text-[#8E9482] pl-10 pr-3.5 py-3 rounded-2xl border border-[#2B2F23] focus:outline-none focus:border-[#D7FF00] uppercase"
            />
          </div>

          {searchResults.length > 0 && (
            <div className="mt-2 max-h-40 overflow-y-auto bg-[#0D0D0D] border border-[#2B2F23] rounded-2xl divide-y divide-[#2B2F23] font-mono">
              {searchResults.map((st) => (
                <div
                  key={st.symbol}
                  onClick={() => handleAdd(st.symbol)}
                  className="p-3 hover:bg-[#1C2016] cursor-pointer flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-white uppercase">{cleanTicker(st.symbol)}</span>
                    <span className="text-[10px] text-[#8E9482] ml-2 uppercase">{st.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[#D7FF00] font-bold">{formatINR(st.current_price)}</span>
                    <Plus size={14} weight="bold" className="text-[#D7FF00]" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Watchlist Items */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3 font-mono">
          {loading ? (
            <div className="py-12 text-center text-[#8E9482] text-xs uppercase">Loading monitored assets...</div>
          ) : items.length > 0 ? (
            items.map((item) => {
              const isDayPositive = item.day_change >= 0;
              return (
                <div
                  key={item.stock_symbol}
                  className="bg-[#141710] border border-[#2B2F23] hover:border-[#D7FF00]/40 rounded-3xl p-4 transition group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div 
                        onClick={() => onSelectStock(item.stock_symbol)}
                        className="font-display text-xl font-bold uppercase tracking-wide text-white group-hover:text-[#D7FF00] cursor-pointer transition flex items-center space-x-2"
                      >
                        <span>{cleanTicker(item.stock_symbol)}</span>
                        <span className="text-[10px] font-mono text-[#8E9482] px-1.5 py-0.2 bg-[#0D0D0D] border border-[#2B2F23] rounded">
                          {item.exchange}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#8E9482] truncate max-w-[180px] uppercase mt-0.5">{item.name}</div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-bold text-white">{formatINR(item.current_price)}</div>
                      <div className={`text-[11px] font-bold ${
                        isDayPositive ? 'text-[#D7FF00]' : 'text-[#FF4343]'
                      }`}>
                        {isDayPositive ? '+' : ''}{formatINR(item.day_change)} ({formatPercent(item.day_change_percent)})
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-3.5 pt-3 border-t border-[#2B2F23] flex items-center justify-between text-xs">
                    <div className="text-[10px] text-[#8E9482] uppercase">
                      PREV: {formatINR(item.prev_close)}
                    </div>

                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={() => onTrade(item.stock_symbol, 'BUY')}
                        className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-[#D7FF00] text-black text-xs font-display font-extrabold uppercase tracking-wider transition shadow-[0_0_10px_rgba(215,255,0,0.3)]"
                      >
                        <ShoppingCart size={13} weight="bold" />
                        <span>BUY</span>
                      </button>

                      <button
                        onClick={() => onSelectStock(item.stock_symbol)}
                        className="p-1.5 rounded-xl text-[#8E9482] hover:text-white hover:bg-[#1C2016] transition"
                        title="View Details"
                      >
                        <ArrowSquareOut size={16} weight="bold" />
                      </button>

                      <button
                        onClick={() => handleRemove(item.stock_symbol)}
                        className="p-1.5 rounded-xl text-[#8E9482] hover:text-[#FF4343] hover:bg-[#FF4343]/10 transition"
                        title="Remove from Watchlist"
                      >
                        <Trash size={16} weight="bold" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center text-[#8E9482] text-xs uppercase">
              Your watchlist is currently empty.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
