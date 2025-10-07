import React, { useState, useMemo, useCallback } from 'react';
import { Product, CartItem, Category, View, Customer, HeldOrder, PaymentMethod, CompletedOrder, Currency, User } from './types';
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
  const [completedOrder, setCompletedOrder] = useState<CompletedOrder | null>(null);
  const [currentCurrency, setCurrentCurrency] = useState<Currency>(DEFAULT_CURRENCY);
  const [taxRate, setTaxRate] = useState(INITIAL_TAX_RATE);

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
    if (currentUser?.role !== 'Admin' && (view === 'products' || view === 'customers' || view === 'users')) {
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

  const clearCart = useCallback(() => {
    setCart([]);
    setSelectedCustomer(customers[0]);
  }, [customers]);

  const subtotal = useMemo(() => cart.reduce((acc, item) => acc + item.price * item.quantity, 0), [cart]);
  const tax = useMemo(() => subtotal * taxRate, [subtotal, taxRate]);
  const total = useMemo(() => subtotal + tax, [subtotal, tax]);

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
    
    const orderData: CompletedOrder = {
        cartItems: cart,
        customer: selectedCustomer,
        subtotal,
        tax,
        total,
        paymentMethod,
        date: new Date(),
        currency: currentCurrency,
        taxRate: taxRate,
    };

    if (paymentMethod === 'Cash' && amountTendered) {
        orderData.amountTendered = amountTendered;
        orderData.change = amountTendered - total;
    }

    setCompletedOrder(orderData);
    setPaymentModalOpen(false);
    setReceiptModalOpen(true);
  };
  
  const handleCloseReceipt = () => {
    setReceiptModalOpen(false);
    setCompletedOrder(null);
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
        const newCustomer = { ...newCustomerData, id: newId };
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
                    taxRate={taxRate}
                    onTaxRateChange={setTaxRate}
                />
            );
        case 'customers':
            return (
                <CustomerManagement
                    customers={customers}
                    onAddCustomer={handleAddCustomer}
                    onUpdateCustomer={handleUpdateCustomer}
                    onDeleteCustomer={handleDeleteCustomer}
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
            )
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
      {completedOrder && (
         <ReceiptModal
            isOpen={isReceiptModalOpen}
            onClose={handleCloseReceipt}
            order={completedOrder}
         />
      )}
    </div>
  );
};

export default App;
