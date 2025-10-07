import React from 'react';
import { CompletedOrder } from '../types';
import { LogoIcon, ReceiptIcon } from './icons';
import { formatCurrency } from '../utils/formatters';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: CompletedOrder;
}

const ReceiptModal: React.FC<ReceiptModalProps> = ({ isOpen, onClose, order }) => {
  if (!isOpen) return null;
  
  const handlePrint = () => {
    // In a real app, this would format a printer-friendly version
    // For now, we use the browser's print functionality on the modal content
    const printContents = document.getElementById('receipt-content')?.innerHTML;
    const originalContents = document.body.innerHTML;
    if (printContents) {
        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
        window.location.reload(); // Reload to restore styles and scripts
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-sm m-4">
        <div id="receipt-content" className="p-6 text-gray-800 dark:text-gray-200">
          <div className="text-center mb-6">
            <LogoIcon className="h-12 w-12 text-primary mx-auto" />
            <h2 className="text-2xl font-bold mt-2">POSify</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Thank you for your purchase!</p>
            <p className="text-xs text-gray-400 mt-1">{order.date.toLocaleString()}</p>
          </div>
          
          <div className="mb-4">
            <h3 className="font-semibold border-b pb-1 mb-2 dark:border-gray-600">Sold to:</h3>
            <p>{order.customer?.name || 'Walk-in Customer'}</p>
            {order.customer?.email && <p className="text-sm text-gray-500">{order.customer.email}</p>}
          </div>

          <div className="border-t border-b py-2 dark:border-gray-600">
            {order.cartItems.map(item => (
                <div key={item.id} className="flex justify-between text-sm mb-1">
                    <span>{item.quantity} x {item.name}</span>
                    <span>{formatCurrency(item.price * item.quantity, order.currency)}</span>
                </div>
            ))}
          </div>
          
          <div className="space-y-2 text-sm mt-4">
            <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(order.subtotal, order.currency)}</span>
            </div>
             {order.discountAmount && order.discountAmount > 0 && (
                <div className="flex justify-between">
                    <span>Discount</span>
                    <span>-{formatCurrency(order.discountAmount, order.currency)}</span>
                </div>
            )}
            <div className="flex justify-between">
                <span>{order.isFbrInvoice ? 'FBR Tax' : 'Tax'} ({ (order.taxRate * 100).toFixed(0) }%)</span>
                <span>{formatCurrency(order.tax, order.currency)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2 dark:border-gray-600">
                <span>Total</span>
                <span>{formatCurrency(order.total, order.currency)}</span>
            </div>
          </div>
          
           <div className="space-y-2 text-sm mt-4 border-t pt-2 dark:border-gray-600">
            <div className="flex justify-between">
                <span>Payment Method</span>
                <span className="font-semibold">{order.paymentMethod}</span>
            </div>
            {order.paymentMethod === 'Cash' && order.amountTendered && order.change !== undefined && (
                <>
                    <div className="flex justify-between">
                        <span>Amount Tendered</span>
                        <span>{formatCurrency(order.amountTendered, order.currency)}</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                        <span>Change</span>
                        <span>{formatCurrency(order.change, order.currency)}</span>
                    </div>
                </>
            )}
           </div>

            {order.isFbrInvoice && order.fbrInvoiceNumber && (
                <div className="text-center mt-4 pt-2 border-t dark:border-gray-600">
                    <p className="text-xs text-gray-500 dark:text-gray-400">FBR Invoice Number</p>
                    <p className="font-mono text-sm">{order.fbrInvoiceNumber}</p>
                </div>
            )}

        </div>
        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-b-lg flex justify-between space-x-3">
            <button onClick={handlePrint} className="flex-1 px-6 py-2 rounded-lg bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500 flex items-center justify-center gap-2">
                <ReceiptIcon className="w-5 h-5" /> Print
            </button>
            <button onClick={onClose} className="flex-1 px-6 py-2 rounded-lg bg-primary text-white font-bold hover:bg-primary-dark">New Order</button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal;