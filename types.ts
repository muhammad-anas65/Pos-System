export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  imageUrl: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
}

export interface HeldOrder {
  id: number;
  cart: CartItem[];
  customer: Customer | null;
  date: Date;
}

export interface Currency {
    code: string;
    name: string;
    symbol: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  password: string; // In a real app, this should be a hash
  role: UserRole;
}

export type Category = 'All' | 'Coffee' | 'Tea' | 'Pastries' | 'Sandwiches';
export type View = 'sales' | 'products' | 'customers' | 'users';
export type PaymentMethod = 'Card' | 'Cash';
export type UserRole = 'Admin' | 'Cashier' | 'Salesman';

export interface CompletedOrder {
  cartItems: CartItem[];
  customer: Customer | null;
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: PaymentMethod;
  amountTendered?: number;
  change?: number;
  date: Date;
  currency: Currency;
  taxRate: number;
}
