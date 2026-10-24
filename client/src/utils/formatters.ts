/**
 * Format a number into Indian Rupee (INR) representation with Indian grouping (Lakhs and Crores).
 * Example: 1234567.89 -> ₹12,34,567.89
 */
export function formatINR(val: number | null | undefined, showSymbol: boolean = true): string {
  if (val === null || val === undefined || isNaN(val)) {
    return showSymbol ? '₹0.00' : '0.00';
  }

  const isNegative = val < 0;
  const absVal = Math.abs(val);

  // Use en-IN locale
  const formatted = absVal.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const prefix = isNegative ? '-₹' : '₹';
  return showSymbol ? `${prefix}${formatted}` : `${isNegative ? '-' : ''}${formatted}`;
}

/**
 * Format large INR numbers compactly into Crores (Cr) or Lakhs (L).
 * Example: 15400000 -> ₹1.54 Cr, 250000 -> ₹2.50 L
 */
export function formatCompactINR(val: number | null | undefined): string {
  if (val === null || val === undefined || isNaN(val)) return '₹0.00';
  const isNegative = val < 0;
  const abs = Math.abs(val);

  let formatted = '';
  if (abs >= 10000000) { // 1 Crore = 10,000,000
    formatted = `₹${(abs / 10000000).toFixed(2)} Cr`;
  } else if (abs >= 100000) { // 1 Lakh = 100,000
    formatted = `₹${(abs / 100000).toFixed(2)} L`;
  } else {
    formatted = formatINR(abs);
  }

  return isNegative ? `-${formatted}` : formatted;
}

/**
 * Format percentage with explicit + or - sign
 * Example: 14.8 -> +14.80%, -2.1 -> -2.10%
 */
export function formatPercent(val: number | null | undefined, showPlus: boolean = true): string {
  if (val === null || val === undefined || isNaN(val)) return '0.00%';
  const prefix = (val > 0 && showPlus) ? '+' : '';
  return `${prefix}${val.toFixed(2)}%`;
}

/**
 * Format ISO date string into Indian readable date
 * Example: '2024-03-10' -> '10 Mar 2024'
 */
export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return dateStr;
  }
}

/**
 * Clean ticker for display (e.g. RELIANCE.NS -> RELIANCE)
 */
export function cleanTicker(symbol: string): string {
  if (!symbol) return '';
  return symbol.replace('.NS', '').replace('.BO', '');
}
