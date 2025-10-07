import React, { useState } from 'react';
import { CartItem, Customer, HeldOrder, Currency, LoyaltySettings } from '../types';
import { TrashIcon, UsersIcon, HandHoldingDollarIcon } from './icons';
import { formatCurrency } from '../utils/formatters';

interface CartProps {
  cartItems: CartItem[];
  onUpdateQuantity: (productId: number, newQuantity: number) => void;
  onClearCart: () => void;
  subtotal: number;
  discountAmount: number;
  discount: { type: 'percentage' | 'fixed'; value: number } | null;
  tax: number;
  total: number;
  onCheckout: () => void;
  customers: Customer[];
  selectedCustomer: Customer | null;
  onSelectCustomer: (customer: Customer | null) => void;
  heldOrders: HeldOrder[];
  onHoldOrder: () => void;
  onRecallOrder: (orderId: number) => void;
  onDeleteHeldOrder: (orderId: number) => void;
  currency: Currency;
  taxRate: number;
  onApplyDiscount: (type: 'percentage' | 'fixed', value: number) => void;
  onRemoveDiscount: () => void;
  loyaltySettings: LoyaltySettings;
  onApplyLoyaltyDiscount: () => void;
  loyaltyDiscountApplied: boolean;
}

const Cart: React.FC<CartProps> = ({
  cartItems,
  onUpdateQuantity,
  onClearCart,
  subtotal,
  discountAmount,
  discount,
  tax,
  total,
  onCheckout,
  customers,
  selectedCustomer,
  onSelectCustomer,
  heldOrders,
  onHoldOrder,
  onRecallOrder,
  onDeleteHeldOrder,
  currency,
  taxRate,
  onApplyDiscount,
  onRemoveDiscount,
  loyaltySettings,
  onApplyLoyaltyDiscount,
  loyaltyDiscountApplied,
}) => {
  const [discountInput, setDiscountInput] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');

  const handleCustomerChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const customerId = parseInt(event.target.value, 10);
    const customer = customers.find(c => c.id === customerId) || null;
    onSelectCustomer(customer);
  };

  const handleApplyClick = () => {
    const value = parseFloat(discountInput);
    if (!isNaN(value) && value > 0) {
        onApplyDiscount(discountType, value);
    }
  };

  const handleRemoveClick = () => {
      setDiscountInput('');
      onRemoveDiscount();
  };


  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold">Current Order</h2>
        <button onClick={onClearCart} className="text-red-500 hover:text-red-700 disabled:opacity-50" disabled={cartItems.length === 0} aria-label="Clear Cart">
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>

      <div className="my-4">
        <label htmlFor="customer-select" className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <UsersIcon className="w-5 h-5 mr-2" />
            Customer
        </label>
        <select
          id="customer-select"
          value={selectedCustomer?.id || ''}
          onChange={handleCustomerChange}
          className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {customers.map(customer => (
            <option key={customer.id} value={customer.id}>
              {customer.name}
            </option>
          ))}
        </select>
      </div>
      
      {loyaltySettings.enabled && selectedCustomer?.rewardAvailable && (
          <div className="mb-3 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-center border border-blue-200 dark:border-blue-700">
            <p className="font-semibold text-blue-700 dark:text-blue-300">
              🎉 Loyalty Reward Available!
            </p>
            <p className="text-sm text-blue-600 dark:text-blue-400">
              {loyaltySettings.rewardPercentage}% off this order.
            </p>
            <button
              onClick={onApplyLoyaltyDiscount}
              disabled={discountAmount > 0}
              className="mt-2 px-4 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 text-sm font-semibold"
            >
              {loyaltyDiscountApplied ? 'Applied!' : 'Apply Reward'}
            </button>
          </div>
      )}

      <div className="flex-grow overflow-y-auto -mr-4 pr-4 border-b dark:border-gray-700 pb-2">
        {cartItems.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
            <p>Your cart is empty.</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {cartItems.map((item) => (
              <li key={item.id} className="flex items-center space-x-3 bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg">
                <img src={item.imageUrl} alt={item.name} className="w-12 h-12 rounded-md object-cover" />
                <div className="flex-1">
                  <p className="font-semibold text-sm truncate">{item.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{formatCurrency(item.price, currency)}</p>
                </div>
                <div className="flex items-center space-x-2">
                   <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center font-bold">-</button>
                   <span>{item.quantity}</span>
                   <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center font-bold">+</button>
                </div>
                <p className="font-semibold w-20 text-right">{formatCurrency(item.price * item.quantity, currency)}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {heldOrders.length > 0 && (
        <div className="pt-3">
            <h3 className="text-md font-semibold mb-2">On Hold</h3>
            <div className="space-y-2 max-h-24 overflow-y-auto -mr-4 pr-4">
                {heldOrders.map(order => (
                    <div key={order.id} className="flex justify-between items-center bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg text-sm">
                        <div>
                            <span className="font-medium">{order.customer?.name || 'Walk-in'}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">({order.cart.length} items)</span>
                        </div>
                        <div className="space-x-2">
                            <button onClick={() => onRecallOrder(order.id)} className="text-blue-500 hover:underline">Recall</button>
                            <button onClick={() => onDeleteHeldOrder(order.id)} className="text-red-500 hover:underline">Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      )}

      <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className={`mb-3 transition-opacity ${loyaltyDiscountApplied ? 'opacity-50 cursor-not-allowed' : ''}`}>
          {discountAmount <= 0 ? (
            <div className="flex items-center gap-2">
              <div className="relative flex-grow">
                <input
                  type="number"
                  placeholder="Discount"
                  value={discountInput}
                  onChange={(e) => setDiscountInput(e.target.value)}
                  className="w-full pl-3 pr-16 py-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-gray-200 dark:disabled:bg-gray-800"
                  aria-label="Discount value"
                  disabled={loyaltyDiscountApplied}
                />
                <div className="absolute inset-y-0 right-0 flex items-center">
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as 'percentage' | 'fixed')}
                    className="h-full rounded-r-lg border-l border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-600 py-0 pl-2 pr-7 text-gray-500 dark:text-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm disabled:bg-gray-200 dark:disabled:bg-gray-800"
                    aria-label="Discount type"
                    disabled={loyaltyDiscountApplied}
                  >
                    <option value="percentage">%</option>
                    <option value="fixed">{currency.symbol}</option>
                  </select>
                </div>
              </div>
              <button
                onClick={handleApplyClick}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 text-sm font-semibold"
                disabled={!discountInput || cartItems.length === 0 || loyaltyDiscountApplied}
              >
                Apply
              </button>
            </div>
          ) : (
            <div className="flex justify-between items-center bg-green-50 dark:bg-green-900/30 p-2 rounded-lg">
              <p className="text-sm font-medium text-green-700 dark:text-green-300">
                {loyaltyDiscountApplied ? 'Loyalty ' : ''}Discount Applied
              </p>
              <button onClick={handleRemoveClick} className="text-red-500 hover:text-red-700 text-sm font-semibold">
                Remove
              </button>
            </div>
          )}
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal, currency)}</span>
          </div>
          {discountAmount > 0 && discount && (
            <div className="flex justify-between text-green-600 dark:text-green-400">
                <span>
                    {loyaltyDiscountApplied ? 'Loyalty Discount' : 'Discount'}{' '}
                    <span className="text-xs font-normal">
                      ({discount.type === 'percentage'
                        ? `${discount.value}%`
                        : formatCurrency(discount.value, currency)})
                    </span>
                </span>
                <span>-{formatCurrency(discountAmount, currency)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Tax ({ (taxRate * 100).toFixed(0) }%)</span>
            <span>{formatCurrency(tax, currency)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>{formatCurrency(total, currency)}</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-4">
            <button
                onClick={onHoldOrder}
                disabled={cartItems.length === 0}
                className="w-full flex items-center justify-center gap-2 bg-amber-500 text-white font-bold py-3 rounded-lg hover:bg-amber-600 transition-colors duration-200 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
                <HandHoldingDollarIcon className="w-5 h-5" />
                Hold
            </button>
            <button
              onClick={onCheckout}
              disabled={cartItems.length === 0}
              className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary-dark transition-colors duration-200 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
              Pay Now
            </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;