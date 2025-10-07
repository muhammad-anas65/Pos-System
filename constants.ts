import { Product, Category, Customer, Currency, User, UserRole } from './types';

export const CATEGORIES: Category[] = ['All', 'Coffee', 'Tea', 'Pastries', 'Sandwiches'];

export const CURRENCIES: Currency[] = [
    { code: 'PKR', name: 'Pakistani Rupee', symbol: 'Rs' },
    { code: 'USD', name: 'United States Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
];

export const DEFAULT_CURRENCY: Currency = CURRENCIES[0]; // PKR

export const INITIAL_PRODUCTS: Product[] = [
  { id: 1, name: 'Espresso', category: 'Coffee', price: 700, stock: 100, imageUrl: 'https://picsum.photos/id/225/200/200' },
  { id: 2, name: 'Latte', category: 'Coffee', price: 950, stock: 100, imageUrl: 'https://picsum.photos/id/305/200/200' },
  { id: 3, name: 'Cappuccino', category: 'Coffee', price: 950, stock: 100, imageUrl: 'https://picsum.photos/id/365/200/200' },
  { id: 4, name: 'Americano', category: 'Coffee', price: 850, stock: 100, imageUrl: 'https://picsum.photos/id/431/200/200' },
  { id: 5, name: 'Mocha', category: 'Coffee', price: 1100, stock: 50, imageUrl: 'https://picsum.photos/id/488/200/200' },
  { id: 6, name: 'Green Tea', category: 'Tea', price: 600, stock: 80, imageUrl: 'https://picsum.photos/id/42/200/200' },
  { id: 7, name: 'Black Tea', category: 'Tea', price: 600, stock: 80, imageUrl: 'https://picsum.photos/id/75/200/200' },
  { id: 8, name: 'Herbal Tea', category: 'Tea', price: 650, stock: 70, imageUrl: 'https://picsum.photos/id/111/200/200' },
  { id: 9, name: 'Croissant', category: 'Pastries', price: 750, stock: 40, imageUrl: 'https://picsum.photos/id/211/200/200' },
  { id: 10, name: 'Muffin', category: 'Pastries', price: 700, stock: 45, imageUrl: 'https://picsum.photos/id/177/200/200' },
  { id: 11, name: 'Scone', category: 'Pastries', price: 850, stock: 30, imageUrl: 'https://picsum.photos/id/326/200/200' },
  { id: 12, name: 'Danish', category: 'Pastries', price: 900, stock: 35, imageUrl: 'https://picsum.photos/id/368/200/200' },
  { id: 13, name: 'Turkey Club', category: 'Sandwiches', price: 2300, stock: 20, imageUrl: 'https://picsum.photos/id/1080/200/200' },
  { id: 14, name: 'Ham & Cheese', category: 'Sandwiches', price: 2000, stock: 25, imageUrl: 'https://picsum.photos/id/1078/200/200' },
  { id: 15, name: 'Veggie Wrap', category: 'Sandwiches', price: 1900, stock: 30, imageUrl: 'https://picsum.photos/id/1060/200/200' },
  { id: 16, name: 'Iced Coffee', category: 'Coffee', price: 1000, stock: 60, imageUrl: 'https://picsum.photos/id/569/200/200' },
];

export const INITIAL_TAX_RATE = 0.08; // 8% sales tax

export const INITIAL_CUSTOMERS: Customer[] = [
  { id: 1, name: 'Walk-in Customer', email: '', totalSpent: 0, rewardAvailable: false },
  { id: 2, name: 'John Doe', email: 'john.d@example.com', totalSpent: 15000, rewardAvailable: false },
  { id: 3, name: 'Jane Smith', email: 'jane.s@example.com', totalSpent: 52000, rewardAvailable: true },
];

export const USER_ROLES: UserRole[] = ['Admin', 'Cashier', 'Salesman'];

export const INITIAL_USERS: User[] = [
  { id: 1, name: 'Admin User', email: 'admin@pos.com', password: 'password', role: 'Admin' },
  { id: 2, name: 'Cashier User', email: 'cashier@pos.com', password: 'password', role: 'Cashier' },
  { id: 3, name: 'Salesman User', email: 'salesman@pos.com', password: 'password', role: 'Salesman' },
];
