import type { Timestamp } from 'firebase/firestore';

export type Product = {
  id?: string;
  name: string;
  description: string;
  unit: 'kg' | 'liters' | 'units';
};

export type CentralStockItem = {
  productId: string;
  quantity: number;
};

export type LocalStockItem = {
  productId: string;
  name: string;
  quantity: number;
  unit: string;
};

export type MenuItem = {
  id?: string;
  name: string;
  description: string;
  price: number;
  category: 'Appetizer' | 'Main Course' | 'Dessert' | 'Beverage';
  imageUrl: string;
  isAvailable: boolean;
  stock: number;
};

export type OrderItem = {
  menuItemId: string;
  name: string;
  quantity: number;
  price: number;
};

export type Order = {
  id?: string;
  tableNumber: number;
  items: OrderItem[];
  status: 'Pending' | 'Preparing' | 'Ready' | 'Served' | 'Paid';
  createdAt: Timestamp;
};

// Represents a simplified version of an order item for the form
export type CartItem = {
  id: string; // This will be the menuItemId
  name: string;
  price: number;
  quantity: number;
};
