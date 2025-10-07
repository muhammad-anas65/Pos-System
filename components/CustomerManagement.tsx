import React, { useState } from 'react';
import { Customer } from '../types';
import CustomerFormModal from './CustomerFormModal';
import { PencilIcon, TrashIcon } from './icons';

interface CustomerManagementProps {
  customers: Customer[];
  onAddCustomer: (newCustomer: Omit<Customer, 'id'>) => void;
  onUpdateCustomer: (updatedCustomer: Customer) => void;
  onDeleteCustomer: (customerId: number) => void;
}

const CustomerManagement: React.FC<CustomerManagementProps> = ({
  customers,
  onAddCustomer,
  onUpdateCustomer,
  onDeleteCustomer,
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

  return (
    <main className="p-6" style={{ height: 'calc(100vh - 64px)' }}>
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Customer Management</h1>
            <button
                onClick={handleOpenModalForNew}
                className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors duration-200"
            >
                Add New Customer
            </button>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">Customer Name</th>
                        <th scope="col" className="px-6 py-3">Email</th>
                        <th scope="col" className="px-6 py-3"><span className="sr-only">Actions</span></th>
                    </tr>
                </thead>
                <tbody>
                    {customers.map((customer) => (
                        <tr key={customer.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                {customer.name}
                            </th>
                            <td className="px-6 py-4">{customer.email || 'N/A'}</td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end space-x-4">
                                    <button 
                                        onClick={() => handleOpenModalForEdit(customer)} 
                                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                                        disabled={customer.id === 1} // Disable editing for walk-in
                                    >
                                        <PencilIcon className={`w-5 h-5 ${customer.id === 1 ? 'text-gray-400' : ''}`}/>
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(customer)} 
                                        className="font-medium text-red-600 dark:text-red-500 hover:underline"
                                        disabled={customer.id === 1} // Disable deleting for walk-in
                                    >
                                        <TrashIcon className={`w-5 h-5 ${customer.id === 1 ? 'text-gray-400' : ''}`}/>
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