import { Currency } from '../types';

export const formatCurrency = (amount: number, currency: Currency): string => {
    return `${currency.symbol} ${amount.toFixed(2)}`;
};
