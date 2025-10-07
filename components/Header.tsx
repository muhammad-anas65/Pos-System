import React from 'react';
import { LogoIcon, ShoppingCartIcon, BoxIcon, UsersIcon, Cog8ToothIcon, ArrowRightOnRectangleIcon, DocumentTextIcon } from './icons';
import { View, Currency, User } from '../types';
import { CURRENCIES } from '../constants';

interface HeaderProps {
    onNavigate: (view: View) => void;
    currentView: View;
    onCurrencyChange: (code: string) => void;
    currentCurrency: Currency;
    currentUser: User;
    onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, currentView, onCurrencyChange, currentCurrency, currentUser, onLogout }) => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md h-16 flex justify-between items-center px-6">
      <div className="flex items-center space-x-3">
        <LogoIcon className="h-8 w-8 text-primary" />
        <span className="text-xl font-bold text-gray-800 dark:text-white">POSify</span>
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-300 hidden sm:block">Welcome, {currentUser.name}</span>
        <div className="border-l border-gray-200 dark:border-gray-600 h-8 mx-2"></div>
        <div>
            <select
                value={currentCurrency.code}
                onChange={(e) => onCurrencyChange(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label="Select Currency"
            >
                {CURRENCIES.map(c => (
                    <option key={c.code} value={c.code}>{c.code}</option>
                ))}
            </select>
        </div>
        <div className="border-l border-gray-200 dark:border-gray-600 h-8 mx-2"></div>
         <button 
            onClick={() => onNavigate('sales')}
            className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${currentView === 'sales' ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
            aria-label="Sales View"
        >
            <ShoppingCartIcon className="h-6 w-6 text-gray-600 dark:text-gray-300"/>
        </button>

        {currentUser.role === 'Admin' && (
          <>
            <button 
                onClick={() => onNavigate('products')}
                className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${currentView === 'products' ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
                aria-label="Product Management"
            >
                <BoxIcon className="h-6 w-6 text-gray-600 dark:text-gray-300"/>
            </button>
             <button 
                onClick={() => onNavigate('customers')}
                className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${currentView === 'customers' ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
                aria-label="Customer Management"
            >
                <UsersIcon className="h-6 w-6 text-gray-600 dark:text-gray-300"/>
            </button>
            <button 
                onClick={() => onNavigate('users')}
                className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${currentView === 'users' ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
                aria-label="User Management"
            >
                <Cog8ToothIcon className="h-6 w-6 text-gray-600 dark:text-gray-300"/>
            </button>
            <button 
                onClick={() => onNavigate('fbr')}
                className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${currentView === 'fbr' ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
                aria-label="FBR Settings"
            >
                <DocumentTextIcon className="h-6 w-6 text-gray-600 dark:text-gray-300"/>
            </button>
          </>
        )}

        <div className="border-l border-gray-200 dark:border-gray-600 h-8 mx-2"></div>
        <button 
            onClick={onLogout}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            aria-label="Logout"
        >
            <ArrowRightOnRectangleIcon className="h-6 w-6 text-gray-600 dark:text-gray-300"/>
        </button>
      </div>
    </header>
  );
};

export default Header;