import React, { useState } from 'react';
import { Customer, LoyaltySettings, Currency } from '../types';
import CustomerFormModal from './CustomerFormModal';
import { PencilIcon, TrashIcon, IdentificationIcon } from './icons';
import { formatCurrency } from '../utils/formatters';

interface CustomerManagementProps {
  customers: Customer[];
  onAddCustomer: (newCustomer: Omit<Customer, 'id'>) => void;
  onUpdateCustomer: (updatedCustomer: Customer) => void;
  onDeleteCustomer: (customerId: number) => void;
  onViewCustomerProfile: (customer: Customer) => void;
  loyaltySettings: LoyaltySettings;
  onLoyaltySettingsChange: (settings: LoyaltySettings) => void;
  currency: Currency;
}

const CustomerManagement: React.FC<CustomerManagementProps> = ({
  customers,
  onAddCustomer,
  onUpdateCustomer,
  onDeleteCustomer,
  onViewCustomerProfile,
  loyaltySettings,
  onLoyaltySettingsChange,
  currency,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  const handleOpenModalForNew = () => {
    setEditingCustomer(null);
    setIsModalOpen(true);
  };

  const handleOpenModalForEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCustomer(null);
  };

  const handleSaveCustomer = (customerData: Omit<Customer, 'id'> | Customer) => {
    if ('id' in customerData) {
      onUpdateCustomer(customerData);
    } else {
      onAddCustomer(customerData);
    }
    handleCloseModal();
  };
  
  const handleDelete = (customer: Customer) => {
    if (window.confirm(`Are you sure you want to delete ${customer.name}?`)) {
        onDeleteCustomer(customer.id);
    }
  }

  const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    onLoyaltySettingsChange({
        ...loyaltySettings,
        [name]: type === 'checkbox' ? checked : parseFloat(value) || 0,
    });
  }

  return (
    <main className="p-4 sm:p-6" style={{ height: 'calc(100vh - 64px)' }}>
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Customer Management</h1>
            <button
                onClick={handleOpenModalForNew}
                className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors duration-200"
            >
                Add New Customer
            </button>
        </div>

        <div className="mb-6 p-4 border rounded-lg dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Loyalty Program Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="enabled"
                        name="enabled"
                        checked={loyaltySettings.enabled}
                        onChange={handleSettingsChange}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <label htmlFor="enabled" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Enable Loyalty Program
                    </label>
                </div>
                <div>
                    <label htmlFor="spendThreshold" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Spend Threshold ({currency.symbol})</label>
                    <input
                        type="number"
                        id="spendThreshold"
                        name="spendThreshold"
                        value={loyaltySettings.spendThreshold}
                        onChange={handleSettingsChange}
                        disabled={!loyaltySettings.enabled}
                        className="mt-1 w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-200 dark:disabled:bg-gray-700/50"
                    />
                </div>
                <div>
                    <label htmlFor="rewardPercentage" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Reward Discount (%)</label>
                    <input
                        type="number"
                        id="rewardPercentage"
                        name="rewardPercentage"
                        value={loyaltySettings.rewardPercentage}
                        onChange={handleSettingsChange}
                        disabled={!loyaltySettings.enabled}
                        className="mt-1 w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-200 dark:disabled:bg-gray-700/50"
                    />
                </div>
            </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">Customer Name</th>
                        <th scope="col" className="px-6 py-3">Email</th>
                        <th scope="col" className="px-6 py-3">Total Spent</th>
                        <th scope="col" className="px-6 py-3">Reward Available</th>
                        <th scope="col" className="px-6 py-3 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {customers.map((customer) => (
                        <tr key={customer.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                {customer.name}
                            </th>
                            <td className="px-6 py-4">{customer.email || 'N/A'}</td>
                            <td className="px-6 py-4">{customer.id === 1 ? 'N/A' : formatCurrency(customer.totalSpent || 0, currency)}</td>
                            <td className="px-6 py-4">
                                {customer.id !== 1 && (
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                        customer.rewardAvailable ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
                                    }`}>
                                        {customer.rewardAvailable ? 'Yes' : 'No'}
                                    </span>
                                )}
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end space-x-4">
                                    <button
                                        onClick={() => onViewCustomerProfile(customer)}
                                        className="font-medium text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light"
                                        disabled={customer.id === 1}
                                        aria-label="View Profile"
                                    >
                                        <IdentificationIcon className={`w-5 h-5 ${customer.id === 1 ? 'text-gray-400 cursor-not-allowed' : ''}`} />
                                    </button>
                                    <button 
                                        onClick={() => handleOpenModalForEdit(customer)} 
                                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                                        disabled={customer.id === 1} // Disable editing for walk-in
                                    >
                                        <PencilIcon className={`w-5 h-5 ${customer.id === 1 ? 'text-gray-400 cursor-not-allowed' : ''}`}/>
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(customer)} 
                                        className="font-medium text-red-600 dark:text-red-500 hover:underline"
                                        disabled={customer.id === 1} // Disable deleting for walk-in
                                    >
                                        <TrashIcon className={`w-5 h-5 ${customer.id === 1 ? 'text-gray-400 cursor-not-allowed' : ''}`}/>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        
        <CustomerFormModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onSave={handleSaveCustomer}
            customer={editingCustomer}
        />
    </main>
  );
};

export default CustomerManagement;
