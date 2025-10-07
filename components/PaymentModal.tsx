import React, { useState, useEffect } from 'react';
import { CreditCardIcon, CashIcon } from './icons';
import { PaymentMethod, Currency } from '../types';
import { formatCurrency } from '../utils/formatters';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
  onConfirmPayment: (method: PaymentMethod, amountTendered?: number) => void;
  currency: Currency;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, totalAmount, onConfirmPayment, currency }) => {
  const [activeMethod, setActiveMethod] = useState<PaymentMethod>('Card');
  const [cashTendered, setCashTendered] = useState('');

  useEffect(() => {
    if (isOpen) {
      setActiveMethod('Card');
      setCashTendered('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (activeMethod === 'Cash') {
      onConfirmPayment(activeMethod, parseFloat(cashTendered));
    } else {
      onConfirmPayment(activeMethod);
    }
  };
  
  const isCashPaymentInvalid = activeMethod === 'Cash' && (parseFloat(cashTendered) < totalAmount || isNaN(parseFloat(cashTendered)));
  const change = activeMethod === 'Cash' && !isCashPaymentInvalid ? parseFloat(cashTendered) - totalAmount : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md m-4">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Checkout</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 dark:hover:text-white text-3xl leading-none">&times;</button>
        </div>
        <div className="p-6">
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 text-center mb-6">
            <p className="text-lg text-gray-600 dark:text-gray-300">Total Amount</p>
            <p className="text-4xl font-extrabold text-primary">{formatCurrency(totalAmount, currency)}</p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Payment Method</h3>
            <div className="grid grid-cols-2 gap-4">
               <button 
                 onClick={() => setActiveMethod('Card')}
                 className={`flex flex-col items-center justify-center p-4 border-2 rounded-lg transition-colors ${activeMethod === 'Card' ? 'border-primary bg-primary-light dark:bg-primary-dark/20 text-primary dark:text-primary-light' : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'}`}>
                 <CreditCardIcon className="w-10 h-10 mb-2"/>
                 <span className="font-semibold">Card</span>
               </button>
               <button 
                 onClick={() => setActiveMethod('Cash')}
                 className={`flex flex-col items-center justify-center p-4 border-2 rounded-lg transition-colors ${activeMethod === 'Cash' ? 'border-primary bg-primary-light dark:bg-primary-dark/20 text-primary dark:text-primary-light' : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'}`}>
                 <CashIcon className="w-10 h-10 mb-2"/>
                 <span className="font-semibold">Cash</span>
               </button>
            </div>
          </div>

          {activeMethod === 'Cash' && (
            <div className="space-y-4">
                <div>
                    <label htmlFor="cash-tendered" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Cash Tendered</label>
                    <input 
                        type="number" 
                        id="cash-tendered"
                        value={cashTendered}
                        onChange={(e) => setCashTendered(e.target.value)}
                        placeholder="0.00"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm dark:bg-gray-700 dark:border-gray-600"
                    />
                </div>
                {!isCashPaymentInvalid && (
                    <div className="flex justify-between text-lg font-semibold bg-gray-100 dark:bg-gray-700 p-3 rounded-md">
                        <span>Change Due</span>
                        <span className="text-green-500">{formatCurrency(change, currency)}</span>
                    </div>
                )}
            </div>
          )}
        </div>
        <div className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-b-lg flex justify-end space-x-3">
            <button onClick={onClose} className="px-6 py-2 rounded-lg bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500">Cancel</button>
            <button onClick={handleConfirm} disabled={isCashPaymentInvalid} className="px-6 py-2 rounded-lg bg-primary text-white font-bold hover:bg-primary-dark disabled:bg-gray-400 dark:disabled:bg-gray-500 disabled:cursor-not-allowed">Confirm Payment</button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;