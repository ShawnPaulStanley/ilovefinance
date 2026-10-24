import React, { useState, useEffect } from 'react';
import { X, MagnifyingGlass, WarningCircle } from '@phosphor-icons/react';
import { HoldingCalculated } from '../../types/finance';
import { searchStocks, fetchStockQuote, addTransaction } from '../../services/api';
import { formatINR, cleanTicker } from '../../utils/formatters';

interface TransactionModalProps {
  portfolioId: string;
  isOpen: boolean;
  onClose: () => void;
  onTransactionSuccess: () => void;
  initialSymbol?: string;
  initialType?: 'BUY' | 'SELL' | 'DIVIDEND';
  holdings: HoldingCalculated[];
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  portfolioId,
  isOpen,
  onClose,
  onTransactionSuccess,
  initialSymbol = '',
  initialType = 'BUY',
  holdings
}) => {
  const [type, setType] = useState<'BUY' | 'SELL' | 'DIVIDEND'>(initialType);
  const [symbol, setSymbol] = useState(initialSymbol);
  const [searchQuery, setSearchQuery] = useState(initialSymbol);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [quantity, setQuantity] = useState<string>('10');
  const [price, setPrice] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setType(initialType);
      setSymbol(initialSymbol);
      setSearchQuery(cleanTicker(initialSymbol));
      setError(null);
      setShowDropdown(false);

      if (initialSymbol) {
        fetchStockQuote(initialSymbol).then(q => {
          setPrice(String(q.current_price));
        }).catch(() => {});
      } else {
        searchStocks('').then(res => setSearchResults(res)).catch(() => {});
      }
    }
  }, [isOpen, initialSymbol, initialType]);

  useEffect(() => {
    const timer = setTimeout(() => {
      searchStocks(searchQuery || '')
        .then(res => setSearchResults(res))
        .catch(() => {});
    }, 200);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  if (!isOpen) return null;

  const currentHolding = holdings.find(h => (h.symbol || '').toLowerCase() === (symbol || '').toLowerCase());
  const maxSellQty = currentHolding ? currentHolding.quantity : 0;

  const numQty = parseFloat(quantity) || 0;
  const numPrice = parseFloat(price) || 0;
  const totalAmount = numQty * numPrice;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const effectiveSymbol = symbol || (searchQuery.trim() ? (
      searchQuery.trim().toUpperCase().endsWith('.NS') || searchQuery.trim().toUpperCase().endsWith('.BO')
        ? searchQuery.trim().toUpperCase()
        : `${searchQuery.trim().toUpperCase()}.NS`
    ) : '');

    if (!effectiveSymbol) {
      setError('Please select or enter a valid stock instrument (e.g. RELIANCE, TCS, INFY).');
      return;
    }

    if (numQty <= 0) {
      setError('Quantity must be greater than 0.');
      return;
    }

    let finalPrice = numPrice;
    if (finalPrice <= 0) {
      try {
        const q = await fetchStockQuote(effectiveSymbol);
        if (q && q.current_price > 0) {
          finalPrice = q.current_price;
          setPrice(String(finalPrice));
        }
      } catch (_e) {}
    }

    if (finalPrice <= 0 || isNaN(finalPrice)) {
      setError('Please enter a valid price per share.');
      return;
    }

    if (type === 'SELL' && numQty > maxSellQty) {
      setError(`Cannot sell ${numQty} shares. You currently only hold ${maxSellQty} shares.`);
      return;
    }

    setIsSubmitting(true);
    try {
      await addTransaction({
        portfolio_id: portfolioId,
        stock_symbol: effectiveSymbol,
        type,
        quantity: numQty,
        price: finalPrice,
        transaction_date: date,
        notes
      });
      onTransactionSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to record transaction');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectStock = (st: any) => {
    const sym = st.symbol || st.stock_symbol;
    setSymbol(sym);
    setSearchQuery(st.short_name || cleanTicker(sym));
    setPrice(String(st.current_price));
    setShowDropdown(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="bg-[#0D0D0D] border-2 border-[#2B2F23] rounded-3xl w-full max-w-lg p-6 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-[#2B2F23]">
          <h2 className="font-display text-2xl font-extrabold uppercase tracking-wide text-white">RECORD TRADE</h2>
          <button onClick={onClose} className="p-2 rounded-xl text-[#8E9482] hover:text-white transition">
            <X size={20} weight="bold" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-2xl bg-[#FF4343]/10 border border-[#FF4343]/30 text-xs font-mono text-[#FF4343] flex items-center space-x-2">
            <WarningCircle size={16} weight="bold" className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          
          {/* Type Selector (BUY / SELL / DIVIDEND) */}
          <div className="grid grid-cols-3 gap-2 p-1.5 bg-[#141710] rounded-2xl border border-[#2B2F23]">
            <button
              type="button"
              onClick={() => setType('BUY')}
              className={`py-2 text-xs font-display font-extrabold uppercase tracking-wider rounded-xl transition ${
                type === 'BUY' 
                  ? 'bg-[#D7FF00] text-black shadow-[0_0_15px_rgba(215,255,0,0.35)]' 
                  : 'text-[#8E9482] hover:text-white'
              }`}
            >
              BUY
            </button>
            <button
              type="button"
              onClick={() => setType('SELL')}
              className={`py-2 text-xs font-display font-extrabold uppercase tracking-wider rounded-xl transition ${
                type === 'SELL' 
                  ? 'bg-[#FF4343] text-white shadow-[0_0_15px_rgba(255,67,67,0.35)]' 
                  : 'text-[#8E9482] hover:text-white'
              }`}
            >
              SELL
            </button>
            <button
              type="button"
              onClick={() => setType('DIVIDEND')}
              className={`py-2 text-xs font-display font-extrabold uppercase tracking-wider rounded-xl transition ${
                type === 'DIVIDEND' 
                  ? 'bg-[#C7FF3D] text-black shadow-[0_0_15px_rgba(199,255,61,0.35)]' 
                  : 'text-[#8E9482] hover:text-white'
              }`}
            >
              DIVIDEND
            </button>
          </div>

          {/* Stock Search Input */}
          <div className="relative font-mono">
            <label className="block text-xs uppercase tracking-wider text-[#8E9482] font-bold mb-1.5">
              STOCK INSTRUMENT (NSE / BSE)
            </label>
            <div className="relative">
              <MagnifyingGlass size={16} weight="bold" className="text-[#8E9482] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="SEARCH TICKER (E.G. RELIANCE, TCS, INFY)..."
                value={searchQuery}
                onFocus={() => {
                  setShowDropdown(true);
                  if (searchResults.length === 0) {
                    searchStocks(searchQuery || '').then(res => setSearchResults(res));
                  }
                }}
                onChange={(e) => {
                  const val = e.target.value;
                  setSearchQuery(val);
                  setShowDropdown(true);
                  if (!val.trim()) setSymbol('');
                }}
                className="w-full bg-[#141710] text-xs font-bold text-white placeholder:text-[#8E9482] pl-10 pr-3.5 py-3 rounded-2xl border border-[#2B2F23] focus:outline-none focus:border-[#D7FF00] uppercase font-mono"
              />
            </div>

            {/* Selected ticker indicator */}
            {symbol && (
              <div className="mt-1.5 flex items-center justify-between px-3 py-1 bg-[#1C2016] border border-[#D7FF00]/30 rounded-xl text-[11px] text-[#D7FF00]">
                <span>SELECTED: <strong>{symbol}</strong></span>
                <span className="text-[#8E9482] text-[10px]">CLICK TO CHANGE</span>
              </div>
            )}

            {/* Autocomplete dropdown */}
            {showDropdown && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 max-h-52 overflow-y-auto bg-[#0D0D0D] border-2 border-[#2B2F23] rounded-2xl shadow-2xl z-30 divide-y divide-[#2B2F23]">
                {searchResults.map((st) => {
                  const sym = st.symbol || st.stock_symbol;
                  return (
                    <div
                      key={sym}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleSelectStock(st);
                      }}
                      className="p-3 hover:bg-[#1C2016] cursor-pointer flex items-center justify-between text-xs transition"
                    >
                      <div className="truncate mr-2">
                        <span className="font-bold text-white uppercase">{cleanTicker(sym)}</span>
                        <span className="text-[10px] text-[#8E9482] ml-2 uppercase truncate">{st.name}</span>
                      </div>
                      <div className="font-mono text-[#D7FF00] font-bold shrink-0">
                        {formatINR(st.current_price)}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Current Holding Alert if Selling */}
          {type === 'SELL' && (
            <div className="p-3 bg-[#1C2016] border border-[#FF4343]/30 rounded-2xl text-xs font-mono flex justify-between items-center text-white">
              <span className="uppercase text-[#8E9482]">Available Shares to Sell:</span>
              <span className="font-bold text-[#FF4343]">{maxSellQty} SHARES</span>
            </div>
          )}

          {/* Quantity and Price Grid */}
          <div className="grid grid-cols-2 gap-3 font-mono">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#8E9482] font-bold mb-1.5">
                {type === 'DIVIDEND' ? 'ELIGIBLE SHARES' : 'QUANTITY (SHARES)'}
              </label>
              <input
                type="number"
                min="0.01"
                step="any"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full bg-[#141710] text-xs font-bold text-white px-3.5 py-3 rounded-2xl border border-[#2B2F23] focus:outline-none focus:border-[#D7FF00]"
                placeholder="10"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#8E9482] font-bold mb-1.5">
                {type === 'DIVIDEND' ? 'DIVIDEND / SHARE (₹)' : 'PRICE / SHARE (₹)'}
              </label>
              <input
                type="number"
                min="0"
                step="any"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-[#141710] text-xs font-bold text-white px-3.5 py-3 rounded-2xl border border-[#2B2F23] focus:outline-none focus:border-[#D7FF00]"
                placeholder="₹ Price"
              />
            </div>
          </div>

          {/* Date & Total Amount Preview */}
          <div className="grid grid-cols-2 gap-3 font-mono">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#8E9482] font-bold mb-1.5">TRADE DATE</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-[#141710] text-xs text-white px-3.5 py-3 rounded-2xl border border-[#2B2F23] focus:outline-none focus:border-[#D7FF00]"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#8E9482] font-bold mb-1.5">TOTAL CAPITAL</label>
              <div className="w-full bg-[#141710] text-xs font-bold text-[#D7FF00] px-3.5 py-3 rounded-2xl border border-[#2B2F23] flex items-center justify-between">
                <span>{formatINR(totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="font-mono">
            <label className="block text-xs uppercase tracking-wider text-[#8E9482] font-bold mb-1.5">NOTES / RATIONALE (OPTIONAL)</label>
            <input
              type="text"
              placeholder="e.g. Quarterly earnings breakout, long-term accumulation..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-[#141710] text-xs text-white px-3.5 py-3 rounded-2xl border border-[#2B2F23] focus:outline-none focus:border-[#D7FF00]"
            />
          </div>

          {/* Submit CTA */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3.5 rounded-2xl font-display font-extrabold text-sm uppercase tracking-wider transition active:scale-98 ${
                type === 'BUY'
                  ? 'bg-[#D7FF00] hover:bg-[#C7FF3D] text-black shadow-[0_0_20px_rgba(215,255,0,0.35)]'
                  : type === 'SELL'
                  ? 'bg-[#FF4343] hover:bg-[#e03a3a] text-white shadow-[0_0_20px_rgba(255,67,67,0.35)]'
                  : 'bg-[#C7FF3D] hover:bg-[#D7FF00] text-black shadow-[0_0_20px_rgba(199,255,61,0.35)]'
              } disabled:opacity-50`}
            >
              {isSubmitting ? 'RECORDING TRADE...' : `CONFIRM ${type} TRANSACTION`}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
