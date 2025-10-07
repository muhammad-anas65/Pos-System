import React from 'react';
import { Customer, CompletedOrder, LoyaltySettings, Currency } from '../types';
import { formatCurrency } from '../utils/formatters';

interface CustomerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer;
  orders: CompletedOrder[];
  loyaltySettings: LoyaltySettings;
  currency: Currency;
}

const CustomerProfileModal: React.FC<CustomerProfileModalProps> = ({
  isOpen,
  onClose,
  customer,
  orders,
  loyaltySettings,
  currency
}) => {
  if (!isOpen) return null;

  const totalSpent = customer.totalSpent || 0;
  const rewardAvailable = customer.rewardAvailable || false;
  
  const progressPercentage = rewardAvailable 
    ? 100 
    : (loyaltySettings.enabled 
        ? Math.min((totalSpent / loyaltySettings.spendThreshold) * 100, 100) 
        : 0);

  const amountToNextReward = loyaltySettings.enabled ? Math.max(0, loyaltySettings.spendThreshold - totalSpent) : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl m-4 max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold">{customer.name}'s Profile</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 dark:hover:text-white text-3xl leading-none">&times;</button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Customer Details & Loyalty */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Customer Details</h3>
              <p><span className="font-medium text-gray-600 dark:text-gray-400">Name:</span> {customer.name}</p>
              <p><span className="font-medium text-gray-600 dark:text-gray-400">Email:</span> {customer.email || 'N/A'}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Loyalty Status</h3>
              <p><span className="font-medium text-gray-600 dark:text-gray-400">Total Spent:</span> {formatCurrency(totalSpent, currency)}</p>
              <p><span className="font-medium text-gray-600 dark:text-gray-400">Reward Available:</span> 
                <span className={`ml-2 font-bold ${rewardAvailable ? 'text-green-500' : 'text-red-500'}`}>
                  {rewardAvailable ? 'Yes' : 'No'}
                </span>
              </p>
              {loyaltySettings.enabled && !rewardAvailable && (
                <div className="mt-2">
                  <p className="text-sm">Progress to next reward:</p>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5 my-1">
                    <div className="bg-primary h-2.5 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Spend {formatCurrency(amountToNextReward, currency)} more to get a {loyaltySettings.rewardPercentage}% discount.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Order History */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Order History</h3>
            <div className="border rounded-lg overflow-hidden dark:border-gray-700">
              <div className="max-h-64 overflow-y-auto">
                {orders.length > 0 ? (
                  <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sticky top-0">
                      <tr>
                        <th scope="col" className="px-6 py-3">Date</th>
                        <th scope="col" className="px-6 py-3">Items</th>
                        <th scope="col" className="px-6 py-3">Payment</th>
                        <th scope="col" className="px-6 py-3 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
                      {orders.map((order, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap">{new Date(order.date).toLocaleDateString()}</td>
                          <td className="px-6 py-4">{order.cartItems.reduce((acc, item) => acc + item.quantity, 0)}</td>
                          <td className="px-6 py-4">{order.paymentMethod}</td>
                          <td className="px-6 py-4 font-medium text-right whitespace-nowrap">{formatCurrency(order.total, currency)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="p-6 text-center text-gray-500 dark:text-gray-400">No past orders found.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-b-lg flex justify-end">
          <button onClick={onClose} className="px-6 py-2 rounded-lg bg-primary text-white font-bold hover:bg-primary-dark">Close</button>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfileModal;
