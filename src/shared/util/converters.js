export const formatNumber = (value, { decimals, locale = 'en-US' } = {}) => {
  const num = parseFloat(value);
  if (isNaN(num)) return '0';

  const formatter = new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals ?? 0,
    maximumFractionDigits: decimals ?? 20,
  });

  return formatter.format(num);
};


export const formatPrice = (amount, currency = 'USD', locale = 'en-US') => {
  const num = parseFloat(amount);
  if (isNaN(num)) return '$0.00';

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(num);
};