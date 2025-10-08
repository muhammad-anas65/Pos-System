import React, { useState } from 'react';
import { LogoIcon, ShoppingCartIcon, BoxIcon, UsersIcon, Cog8ToothIcon, ArrowRightOnRectangleIcon, DocumentTextIcon, BrainIcon, ChartBarIcon, Bars3Icon } from './icons';
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNav = (view: View) => {
    onNavigate(view);
    setIsMenuOpen(false);
  }

  const handleLogoutAndClose = () => {
    onLogout();
    setIsMenuOpen(false);
  }

  const navButtons = (
     <>
        {currentUser.role === 'Admin' && (
          <button 
                onClick={() => handleNav('dashboard')}
                className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${currentView === 'dashboard' ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
                aria-label="Admin Dashboard"
            >
                <ChartBarIcon className="h-6 w-6 text-gray-600 dark:text-gray-300"/>
            </button>
        )}

         <button 
            onClick={() => handleNav('sales')}
            className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${currentView === 'sales' ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
            aria-label="Sales View"
        >
            <ShoppingCartIcon className="h-6 w-6 text-gray-600 dark:text-gray-300"/>
        </button>

        {currentUser.role === 'Admin' && (
          <>
            <button 
                onClick={() => handleNav('products')}
                className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${currentView === 'products' ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
                aria-label="Product Management"
            >
                <BoxIcon className="h-6 w-6 text-gray-600 dark:text-gray-300"/>
            </button>
             <button 
                onClick={() => handleNav('customers')}
                className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${currentView === 'customers' ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
                aria-label="Customer Management"
            >
                <UsersIcon className="h-6 w-6 text-gray-600 dark:text-gray-300"/>
            </button>
            <button 
                onClick={() => handleNav('users')}
                className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${currentView === 'users' ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
                aria-label="User Management"
            >
                <Cog8ToothIcon className="h-6 w-6 text-gray-600 dark:text-gray-300"/>
            </button>
            <button 
                onClick={() => handleNav('fbr')}
                className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${currentView === 'fbr' ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
                aria-label="FBR Settings"
            >
                <DocumentTextIcon className="h-6 w-6 text-gray-600 dark:text-gray-300"/>
            </button>
            <button 
                onClick={() => handleNav('ai')}
                className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${currentView === 'ai' ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
                aria-label="AI Insights"
            >
                <BrainIcon className="h-6 w-6 text-gray-600 dark:text-gray-300"/>
            </button>
          </>
        )}
     </>
  );

  const MobileNavLink: React.FC<{view: View, label: string, children: React.ReactNode}> = ({ view, label, children }) => (
    <button onClick={() => handleNav(view)} className="w-full flex items-center gap-3 px-4 py-2 text-left text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
        {children}
        <span>{label}</span>
    </button>
  );

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md h-16 flex justify-between items-center px-4 lg:px-6 relative">
      <div className="flex items-center space-x-3">
        <LogoIcon className="h-8 w-8 text-primary" />
        <span className="text-xl font-bold text-gray-800 dark:text-white">POSify</span>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden lg:flex items-center space-x-2">
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
        {navButtons}
        <div className="border-l border-gray-200 dark:border-gray-600 h-8 mx-2"></div>
        <button 
            onClick={onLogout}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            aria-label="Logout"
        >
            <ArrowRightOnRectangleIcon className="h-6 w-6 text-gray-600 dark:text-gray-300"/>
        </button>
      </div>

      {/* Mobile Menu Button */}
      <div className="lg:hidden">
         <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <Bars3Icon className="h-6 w-6 text-gray-600 dark:text-gray-300"/>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-full right-0 mt-1 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-xl border dark:border-gray-700 z-50">
           <div className="p-4 space-y-4 border-b dark:border-gray-700">
            <div>
              <p className="font-semibold text-gray-800 dark:text-white">{currentUser.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{currentUser.email}</p>
            </div>
            <div>
                <label htmlFor="mobile-currency" className="sr-only">Currency</label>
                 <select
                    id="mobile-currency"
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
          </div>
          <nav className="flex flex-col p-2">
            {currentUser.role === 'Admin' && <MobileNavLink view="dashboard" label="Dashboard"><ChartBarIcon className="h-6 w-6 text-gray-600 dark:text-gray-300"/></MobileNavLink>}
            <MobileNavLink view="sales" label="Sales Register"><ShoppingCartIcon className="h-6 w-6 text-gray-600 dark:text-gray-300"/></MobileNavLink>
            {currentUser.role === 'Admin' && (
              <>
                 <MobileNavLink view="products" label="Products"><BoxIcon className="h-6 w-6 text-gray-600 dark:text-gray-300"/></MobileNavLink>
                 <MobileNavLink view="customers" label="Customers"><UsersIcon className="h-6 w-6 text-gray-600 dark:text-gray-300"/></MobileNavLink>
                 <MobileNavLink view="users" label="Users"><Cog8ToothIcon className="h-6 w-6 text-gray-600 dark:text-gray-300"/></MobileNavLink>
                 <MobileNavLink view="fbr" label="FBR Settings"><DocumentTextIcon className="h-6 w-6 text-gray-600 dark:text-gray-300"/></MobileNavLink>
                 <MobileNavLink view="ai" label="AI Insights"><BrainIcon className="h-6 w-6 text-gray-600 dark:text-gray-300"/></MobileNavLink>
              </>
            )}
          </nav>
          <div className="p-2 border-t dark:border-gray-700">
             <button onClick={handleLogoutAndClose} className="w-full flex items-center gap-3 px-4 py-2 text-left text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
              <ArrowRightOnRectangleIcon className="h-6 w-6 text-gray-600 dark:text-gray-300"/>
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
