import React, { useState, useEffect } from 'react';
import { X, Trash } from '@phosphor-icons/react';
import { Transaction } from '../../types/finance';
import { fetchTransactions, deleteTransaction } from '../../services/api';
import { formatINR, cleanTicker, formatDate } from '../../utils/formatters';

interface TransactionHistoryModalProps {
  portfolioId: string;
  isOpen: boolean;
  onClose: () => void;
  onDataChanged: () => void;
}

export const TransactionHistoryModal: React.FC<TransactionHistoryModalProps> = ({
  portfolioId,
  isOpen,
  onClose,
  onDataChanged
}) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filterType, setFilterType] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);

  const loadTransactions = () => {
    setLoading(true);
    fetchTransactions(portfolioId)
      .then(res => setTransactions(res))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (isOpen) {
      loadTransactions();
    }
  }, [isOpen, portfolioId]);

  if (!isOpen) return null;

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this trade? Portfolio cost basis and holdings will be automatically recomputed.')) {
      try {
        await deleteTransaction(id);
        loadTransactions();
        onDataChanged();
      } catch (err: any) {
        alert(err.message || 'Failed to delete transaction');
      }
    }
  };

  const filtered = transactions.filter(t => filterType === 'ALL' || t.type === filterType);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="bg-[#0D0D0D] border-2 border-[#2B2F23] rounded-3xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-5 border-b border-[#2B2F23] flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl font-extrabold uppercase tracking-wide text-white">TRADE AUDIT LOG</h2>
            <p className="text-xs font-mono uppercase text-[#8E9482] mt-0.5">COMPLETE CHRONOLOGICAL RECORD</p>
          </div>

          <div className="flex items-center space-x-3">
            {/* Filter buttons */}
            <div className="flex items-center space-x-1 bg-[#141710] p-1.5 rounded-2xl border border-[#2B2F23]">
              {['ALL', 'BUY', 'SELL', 'DIVIDEND'].map(t => (
                <button
                  key={t}
                  onClick={() => setFilterType(t)}
                  className={`px-3 py-1 text-xs font-mono font-bold uppercase rounded-xl transition ${
                    filterType === t 
                      ? 'bg-[#D7FF00] text-black shadow-[0_0_10px_rgba(215,255,0,0.35)]' 
                      : 'text-[#8E9482] hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <button onClick={onClose} className="p-2 rounded-xl text-[#8E9482] hover:text-white transition">
              <X size={20} weight="bold" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto flex-1 font-mono">
          {loading ? (
            <div className="py-12 text-center text-[#8E9482] text-xs uppercase">Loading trade audit records...</div>
          ) : filtered.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#2B2F23] text-[#8E9482] font-bold uppercase text-[11px]">
                    <th className="pb-3.5">Date</th>
                    <th className="pb-3.5">Type</th>
                    <th className="pb-3.5">Instrument</th>
                    <th className="pb-3.5 text-right">Shares</th>
                    <th className="pb-3.5 text-right">Price</th>
                    <th className="pb-3.5 text-right">Total Amount</th>
                    <th className="pb-3.5">Notes</th>
                    <th className="pb-3.5 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2B2F23]/60">
                  {filtered.map(t => (
                    <tr key={t.id} className="hover:bg-[#141710] transition">
                      <td className="py-3.5 text-white">{formatDate(t.transaction_date)}</td>
                      <td className="py-3.5">
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                          t.type === 'BUY'
                            ? 'bg-[#D7FF00]/15 text-[#D7FF00] border border-[#D7FF00]/40'
                            : t.type === 'SELL'
                            ? 'bg-[#FF4343]/15 text-[#FF4343] border border-[#FF4343]/40'
                            : 'bg-[#C7FF3D]/15 text-[#C7FF3D] border border-[#C7FF3D]/40'
                        }`}>
                          {t.type}
                        </span>
                      </td>
                      <td className="py-3.5 font-bold text-white uppercase">
                        {cleanTicker(t.stock_symbol)}
                        <span className="text-[10px] text-[#8E9482] font-normal ml-1">({t.exchange || 'NSE'})</span>
                      </td>
                      <td className="py-3.5 text-right text-white font-bold">{t.quantity}</td>
                      <td className="py-3.5 text-right text-[#8E9482]">{formatINR(t.price)}</td>
                      <td className="py-3.5 text-right font-bold text-[#D7FF00]">{formatINR(t.total_amount)}</td>
                      <td className="py-3.5 text-[#8E9482] truncate max-w-[150px] uppercase text-[11px]">{t.notes || '-'}</td>
                      <td className="py-3.5 text-center">
                        <button
                          onClick={() => handleDelete(t.id)}
                          className="p-1.5 rounded-lg text-[#8E9482] hover:text-[#FF4343] hover:bg-[#FF4343]/10 transition"
                          title="Delete trade"
                        >
                          <Trash size={14} weight="bold" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center text-[#8E9482] text-xs uppercase">No trades found for this filter.</div>
          )}
        </div>
      </div>
    </div>
  );
};
