import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Product, CartItem, Category, View, Customer, HeldOrder, PaymentMethod, CompletedOrder, Currency, User, LoyaltySettings, FbrSettings } from './types';
import { INITIAL_PRODUCTS, CATEGORIES, INITIAL_TAX_RATE, INITIAL_CUSTOMERS, DEFAULT_CURRENCY, CURRENCIES, INITIAL_USERS } from './constants';
import Header from './components/Header';
import ProductGrid from './components/ProductGrid';
import Cart from './components/Cart';
import PaymentModal from './components/PaymentModal';
import ProductManagement from './components/ProductManagement';
import CustomerManagement from './components/CustomerManagement';
import UserManagement from './components/UserManagement';
import ReceiptModal from './components/ReceiptModal';
import Login from './components/Login';
import CustomerProfileModal from './components/CustomerProfileModal';
import FBRSettings from './components/FBRSettings';
import { sendInvoiceToFBR } from './utils/fbrApi';

const App: React.FC = () => {
  // Authentication State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);

  // App State
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState<View>('sales');
  
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(customers[0]);
  const [heldOrders, setHeldOrders] = useState<HeldOrder[]>([]);
  const [isReceiptModalOpen, setReceiptModalOpen] = useState(false);
  const [currentCompletedOrder, setCurrentCompletedOrder] = useState<CompletedOrder | null>(null);
  const [allCompletedOrders, setAllCompletedOrders] = useState<CompletedOrder[]>([]);
  const [currentCurrency, setCurrentCurrency] = useState<Currency>(DEFAULT_CURRENCY);
  const [taxRate, setTaxRate] = useState(INITIAL_TAX_RATE);
  const [discount, setDiscount] = useState<{ type: 'percentage' | 'fixed'; value: number } | null>(null);
  const [loyaltySettings, setLoyaltySettings] = useState<LoyaltySettings>({
    enabled: true,
    spendThreshold: 50000,
    rewardPercentage: 10,
  });
  const [loyaltyDiscountApplied, setLoyaltyDiscountApplied] = useState(false);
  const [viewingCustomer, setViewingCustomer] = useState<Customer | null>(null);
  const [fbrSettings, setFbrSettings] = useState<FbrSettings>({
    enabled: false,
    apiKey: '',
    ntn: '',
    posId: '',
    manualTaxRate: INITIAL_TAX_RATE,
  });
  const [fbrApiStatus, setFbrApiStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  // --- FBR Tax Rate Simulation ---
  useEffect(() => {
    if (fbrSettings.enabled) {
        setFbrApiStatus('loading');
        // Simulate API call to fetch tax rate from FBR
        const timeout = setTimeout(() => {
            // In a real app, you'd fetch this. We'll use a hardcoded 17% for the demo.
            const fbrRate = 0.17; 
            setTaxRate(fbrRate);
            setFbrApiStatus('success');
            console.log('Successfully fetched FBR tax rate:', fbrRate);
        }, 1000);

        return () => clearTimeout(timeout);
    } else {
        // If FBR integration is disabled, use the manual rate from FBR settings
        setTaxRate(fbrSettings.manualTaxRate);
        setFbrApiStatus('idle');
    }
  }, [fbrSettings]);


  // --- Handlers ---
  
  const handleLogin = (email: string, password: string): boolean => {
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (user) {
        setCurrentUser(user);
        setCurrentView('sales'); // Default to sales view on login
        return true;
    }
    return false;
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const navigate = (view: View) => {
    // Role-based access control
    if (currentUser?.role !== 'Admin' && (view === 'products' || view === 'customers' || view === 'users' || view === 'fbr')) {
      return; // Block navigation for non-admins
    }
    setCurrentView(view);
  };

  const addToCart = useCallback((product: Product) => {
    setCart((prevCart) => {
      if (product.stock <= 0) return prevCart;
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        if (existingItem.quantity >= product.stock) return prevCart;
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  }, []);

  const updateQuantity = useCallback((productId: number, newQuantity: number) => {
    setCart((prevCart) => {
      const product = products.find(p => p.id === productId);
      if (newQuantity <= 0) {
        return prevCart.filter((item) => item.id !== productId);
      }
      if (product && newQuantity > product.stock) {
        return prevCart.map((item) => 
            item.id === productId ? { ...item, quantity: product.stock } : item
        );
      }
      return prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      );
    });
  }, [products]);

  const handleApplyDiscount = useCallback((type: 'percentage' | 'fixed', value: number) => {
    if (value > 0) {
        setDiscount({ type, value });
    } else {
        setDiscount(null);
    }
  }, []);

  const handleRemoveDiscount = useCallback(() => {
    setDiscount(null);
    setLoyaltyDiscountApplied(false);
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    setSelectedCustomer(customers[0]);
    handleRemoveDiscount();
  }, [customers, handleRemoveDiscount]);

  const subtotal = useMemo(() => cart.reduce((acc, item) => acc + item.price * item.quantity, 0), [cart]);
  
  const discountAmount = useMemo(() => {
    if (!discount || subtotal === 0) return 0;
    if (discount.type === 'percentage') {
        const calculatedDiscount = subtotal * (discount.value / 100);
        return Math.min(calculatedDiscount, subtotal);
    }
    if (discount.type === 'fixed') {
        return Math.min(discount.value, subtotal);
    }
    return 0;
  }, [subtotal, discount]);
  
  const tax = useMemo(() => (subtotal - discountAmount) * taxRate, [subtotal, discountAmount, taxRate]);
  const total = useMemo(() => subtotal - discountAmount + tax, [subtotal, discountAmount, tax]);
  
  const handleApplyLoyaltyDiscount = useCallback(() => {
    if (selectedCustomer?.rewardAvailable && discountAmount === 0) {
      handleApplyDiscount('percentage', loyaltySettings.rewardPercentage);
      setLoyaltyDiscountApplied(true);
    }
  }, [selectedCustomer, discountAmount, loyaltySettings.rewardPercentage, handleApplyDiscount]);

  const filteredProducts = useMemo(() => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    return products.filter(
      (product) =>
        (activeCategory === 'All' || product.category === activeCategory) &&
        (product.name.toLowerCase().includes(lowercasedSearchTerm) ||
         product.category.toLowerCase().includes(lowercasedSearchTerm))
    );
  }, [activeCategory, searchTerm, products]);
  
  const handleCheckout = () => {
      if(cart.length > 0) {
        setPaymentModalOpen(true);
      }
  };

  const handleProcessPayment = (paymentMethod: PaymentMethod, amountTendered?: number) => {
    const newProducts = [...products];
    cart.forEach(cartItem => {
        const productIndex = newProducts.findIndex(p => p.id === cartItem.id);
        if (productIndex !== -1) {
            newProducts[productIndex].stock -= cartItem.quantity;
        }
    });
    setProducts(newProducts);

    const isFbr = fbrSettings.enabled && fbrApiStatus === 'success';
    
    const orderData: CompletedOrder = {
        cartItems: cart,
        customer: selectedCustomer,
        subtotal,
        discountAmount,
        discount: discount || undefined,
        loyaltyDiscountApplied,
        tax,
        total,
        paymentMethod,
        date: new Date(),
        currency: currentCurrency,
        taxRate: taxRate,
        isFbrInvoice: isFbr,
        fbrInvoiceNumber: isFbr ? `FBR-${Date.now()}` : undefined,
    };

    if (paymentMethod === 'Cash' && amountTendered) {
        orderData.amountTendered = amountTendered;
        orderData.change = amountTendered - total;
    }
    
    if (selectedCustomer && selectedCustomer.id !== 1) { // Not for walk-in
      const customerIndex = customers.findIndex(c => c.id === selectedCustomer.id);
      if (customerIndex !== -1) {
          const updatedCustomers = [...customers];
          const customerToUpdate = { ...updatedCustomers[customerIndex] };
          
          const currentSpent = customerToUpdate.totalSpent || 0;

          if (loyaltyDiscountApplied) {
              customerToUpdate.rewardAvailable = false;
              // Reset spending progress after using a reward to require earning it again
              customerToUpdate.totalSpent = 0; 
          } else {
              customerToUpdate.totalSpent = currentSpent + total;
              // Check if they earned a new reward for the future
              if (loyaltySettings.enabled && !customerToUpdate.rewardAvailable && customerToUpdate.totalSpent >= loyaltySettings.spendThreshold) {
                  customerToUpdate.rewardAvailable = true;
              }
          }
          
          updatedCustomers[customerIndex] = customerToUpdate;
          setCustomers(updatedCustomers);
      }
    }

    if (orderData.isFbrInvoice) {
      sendInvoiceToFBR(orderData, fbrSettings);
    }

    setCurrentCompletedOrder(orderData);
    setAllCompletedOrders(prev => [...prev, orderData]);
    setPaymentModalOpen(false);
    setReceiptModalOpen(true);
    setLoyaltyDiscountApplied(false);
  };
  
  const handleCloseReceipt = () => {
    setReceiptModalOpen(false);
    setCurrentCompletedOrder(null);
    clearCart();
  };

  const handleHoldOrder = () => {
    if (cart.length === 0) return;
    const newHeldOrder: HeldOrder = {
        id: Date.now(),
        cart,
        customer: selectedCustomer,
        date: new Date(),
    };
    setHeldOrders(prev => [...prev, newHeldOrder]);
    clearCart();
  };
  
  const handleRecallOrder = (orderId: number) => {
    const orderToRecall = heldOrders.find(o => o.id === orderId);
    if (orderToRecall) {
        if (cart.length > 0) {
            handleHoldOrder();
        }
        setCart(orderToRecall.cart);
        setSelectedCustomer(orderToRecall.customer);
        setHeldOrders(prev => prev.filter(o => o.id !== orderId));
    }
  };

  const handleDeleteHeldOrder = (orderId: number) => {
    setHeldOrders(prev => prev.filter(o => o.id !== orderId));
  };

  const handleAddProduct = (newProduct: Omit<Product, 'id'>) => {
    setProducts(prevProducts => {
        const newId = prevProducts.length > 0 ? Math.max(...prevProducts.map(p => p.id)) + 1 : 1;
        return [...prevProducts, { ...newProduct, id: newId }];
    });
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts(prevProducts => 
        prevProducts.map(p => p.id === updatedProduct.id ? updatedProduct : p)
    );
  };

  const handleDeleteProduct = (productId: number) => {
    setProducts(prevProducts => prevProducts.filter(p => p.id !== productId));
  };

  const handleAddCustomer = (newCustomerData: Omit<Customer, 'id'>) => {
    setCustomers(prev => {
        const newId = prev.length > 0 ? Math.max(...prev.map(c => c.id)) + 1 : 1;
        const newCustomer = { ...newCustomerData, id: newId, totalSpent: 0, rewardAvailable: false };
        return [...prev, newCustomer];
    });
  };

  const handleUpdateCustomer = (updatedCustomer: Customer) => {
     setCustomers(prev => prev.map(c => c.id === updatedCustomer.id ? updatedCustomer : c));
  };

  const handleDeleteCustomer = (customerId: number) => {
    if (customerId === 1) {
        alert("Cannot delete the default 'Walk-in Customer'.");
        return;
    }
    setCustomers(prev => prev.filter(c => c.id !== customerId));
    if (selectedCustomer?.id === customerId) {
        setSelectedCustomer(customers[0]);
    }
  };

  const handleCurrencyChange = (code: string) => {
    const newCurrency = CURRENCIES.find(c => c.code === code) || DEFAULT_CURRENCY;
    setCurrentCurrency(newCurrency);
  }

  // User Management Handlers (Admin only)
  const handleAddUser = (newUserData: Omit<User, 'id'>) => {
    setUsers(prev => {
      const newId = prev.length > 0 ? Math.max(...prev.map(u => u.id)) + 1 : 1;
      return [...prev, { ...newUserData, id: newId }];
    });
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  const handleDeleteUser = (userId: number) => {
    if (userId === currentUser?.id) {
        alert("You cannot delete your own account.");
        return;
    }
    setUsers(prev => prev.filter(u => u.id !== userId));
  };

  const handleViewCustomerProfile = (customer: Customer) => {
    setViewingCustomer(customer);
  };

  const handleCloseCustomerProfile = () => {
    setViewingCustomer(null);
  };


  // --- Render Logic ---

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  const mainContent = () => {
    switch(currentView) {
        case 'sales':
            return (
                <main className="flex" style={{ height: 'calc(100vh - 64px)' }}>
                  <div className="flex-1 p-6 overflow-y-auto">
                    <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                       <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Sales Register</h1>
                       <input
                          type="text"
                          placeholder="Search by name or category..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full sm:w-64 px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary"
                       />
                    </div>
                    <div className="mb-6">
                      <div className="flex space-x-2 border-b border-gray-200 dark:border-gray-700">
                        {CATEGORIES.map((category) => (
                          <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`px-4 py-2 text-sm font-medium transition-colors duration-200 focus:outline-none ${
                              activeCategory === category
                                ? 'border-b-2 border-primary text-primary'
                                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white'
                            }`}
                          >
                            {category}
                          </button>
                        ))}
                      </div>
                    </div>
                    <ProductGrid products={filteredProducts} onAddToCart={addToCart} currency={currentCurrency} />
                  </div>
        
                  <aside className="w-96 bg-white dark:bg-gray-800 shadow-lg p-6 flex flex-col">
                    <Cart
                      cartItems={cart}
                      onUpdateQuantity={updateQuantity}
                      onClearCart={clearCart}
                      subtotal={subtotal}
                      discountAmount={discountAmount}
                      discount={discount}
                      onApplyDiscount={handleApplyDiscount}
                      onRemoveDiscount={handleRemoveDiscount}
                      tax={tax}
                      total={total}
                      onCheckout={handleCheckout}
                      customers={customers}
                      selectedCustomer={selectedCustomer}
                      onSelectCustomer={setSelectedCustomer}
                      heldOrders={heldOrders}
                      onHoldOrder={handleHoldOrder}
                      onRecallOrder={handleRecallOrder}
                      onDeleteHeldOrder={handleDeleteHeldOrder}
                      currency={currentCurrency}
                      taxRate={taxRate}
                      loyaltySettings={loyaltySettings}
                      onApplyLoyaltyDiscount={handleApplyLoyaltyDiscount}
                      loyaltyDiscountApplied={loyaltyDiscountApplied}
                    />
                  </aside>
                </main>
            );
        case 'products':
            return (
                <ProductManagement 
                    products={products}
                    onAddProduct={handleAddProduct}
                    onUpdateProduct={handleUpdateProduct}
                    onDeleteProduct={handleDeleteProduct}
                    currency={currentCurrency}
                />
            );
        case 'customers':
            return (
                <CustomerManagement
                    customers={customers}
                    onAddCustomer={handleAddCustomer}
                    onUpdateCustomer={handleUpdateCustomer}
                    onDeleteCustomer={handleDeleteCustomer}
                    onViewCustomerProfile={handleViewCustomerProfile}
                    loyaltySettings={loyaltySettings}
                    onLoyaltySettingsChange={setLoyaltySettings}
                    currency={currentCurrency}
                />
            );
        case 'users':
            return (
                <UserManagement 
                    users={users}
                    onAddUser={handleAddUser}
                    onUpdateUser={handleUpdateUser}
                    onDeleteUser={handleDeleteUser}
                />
            );
        case 'fbr':
            return (
                <FBRSettings
                    settings={fbrSettings}
                    onSettingsChange={setFbrSettings}
                    apiStatus={fbrApiStatus}
                />
            );
        default:
            return null;
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans">
      <Header 
        onNavigate={navigate} 
        currentView={currentView} 
        onCurrencyChange={handleCurrencyChange}
        currentCurrency={currentCurrency}
        currentUser={currentUser}
        onLogout={handleLogout}
      />
      {mainContent()}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        totalAmount={total}
        onConfirmPayment={handleProcessPayment}
        currency={currentCurrency}
      />
      {currentCompletedOrder && (
         <ReceiptModal
            isOpen={isReceiptModalOpen}
            onClose={handleCloseReceipt}
            order={currentCompletedOrder}
         />
      )}
      {viewingCustomer && (
        <CustomerProfileModal
            isOpen={!!viewingCustomer}
            onClose={handleCloseCustomerProfile}
            customer={viewingCustomer}
            orders={allCompletedOrders.filter(o => o.customer?.id === viewingCustomer.id)}
            loyaltySettings={loyaltySettings}
            currency={currentCurrency}
        />
      )}
    </div>
  );
};

export default App;