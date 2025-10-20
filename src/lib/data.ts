import type { Product, Customer, Order, RecentSale } from '@/lib/definitions';
import placeholderData from './placeholder-images.json';

export const PlaceHolderImages = placeholderData.placeholderImages;

export const products: Product[] = [
  { id: 'prod1', name: 'Smart Watch', description: 'Stay connected and track your fitness with this stylish smart watch.', price: 249.99, stock: 150, imageId: 'prod1' },
  { id: 'prod2', name: 'Wireless Earbuds', description: 'Immerse yourself in high-quality audio with these noise-cancelling wireless earbuds.', price: 129.99, stock: 300, imageId: 'prod2' },
  { id: 'prod3', name: 'Laptop Pro', description: 'A powerful and lightweight laptop for professionals and creatives.', price: 1299.99, stock: 75, imageId: 'prod3' },
  { id: 'prod4', name: '4K Monitor', description: 'Experience stunning visuals with this ultra-high-definition 27-inch monitor.', price: 499.99, stock: 120, imageId: 'prod4' },
  { id: 'prod5', name: 'Mechanical Keyboard', description: 'RGB backlit mechanical keyboard for the ultimate typing experience.', price: 89.99, stock: 250, imageId: 'prod5' },
  { id: 'prod6', name: 'Ergonomic Mouse', description: 'Designed for comfort and precision, this mouse reduces wrist strain.', price: 49.99, stock: 400, imageId: 'prod6' },
  { id: 'prod7', name: 'USB-C Hub', description: 'Expand your connectivity with this 8-in-1 USB-C hub.', price: 39.99, stock: 500, imageId: 'prod7' },
  { id: 'prod8', name: 'Portable SSD', description: '1TB of fast, reliable, and portable storage for your files.', price: 119.99, stock: 180, imageId: 'prod8' },
];

export const customers: Customer[] = [
  { id: 'cust1', name: 'Alice Johnson', email: 'alice.j@example.com', imageId: 'customer1' },
  { id: 'cust2', name: 'Bob Williams', email: 'bob.w@example.com', imageId: 'customer2' },
  { id: 'cust3', name: 'Charlie Brown', email: 'charlie.b@example.com', imageId: 'customer3' },
  { id: 'cust4', name: 'Diana Miller', email: 'diana.m@example.com', imageId: 'customer4' },
  { id: 'cust5', name: 'Ethan Davis', email: 'ethan.d@example.com', imageId: 'customer5' },
];

export const orders: Order[] = [
  {
    id: 'ORD001',
    customer: customers[0],
    orderDate: '2023-10-20',
    status: 'Delivered',
    items: [{ productId: 'prod1', quantity: 1, price: 249.99 }],
    total: 249.99,
  },
  {
    id: 'ORD002',
    customer: customers[1],
    orderDate: '2023-10-22',
    status: 'Shipped',
    items: [
      { productId: 'prod3', quantity: 1, price: 1299.99 },
      { productId: 'prod6', quantity: 1, price: 49.99 },
    ],
    total: 1349.98,
  },
  {
    id: 'ORD003',
    customer: customers[2],
    orderDate: '2023-10-25',
    status: 'Pending',
    items: [{ productId: 'prod2', quantity: 2, price: 129.99 }],
    total: 259.98,
  },
  {
    id: 'ORD004',
    customer: customers[3],
    orderDate: '2023-11-01',
    status: 'Delivered',
    items: [{ productId: 'prod4', quantity: 1, price: 499.99 }],
    total: 499.99,
  },
  {
    id: 'ORD005',
    customer: customers[4],
    orderDate: '2023-11-05',
    status: 'Cancelled',
    items: [{ productId: 'prod5', quantity: 1, price: 89.99 }],
    total: 89.99,
  },
];

export const salesMetrics = {
  totalRevenue: 125430.50,
  totalSales: 830,
  newCustomers: 45,
  pendingOrders: 12,
};

export const salesByProduct = [
  { name: 'Smart Watch', sales: 120 },
  { name: 'Wireless Earbuds', sales: 95 },
  { name: 'Laptop Pro', sales: 50 },
  { name: '4K Monitor', sales: 70 },
  { name: 'Mechanical Keyboard', sales: 150 },
];

export const salesTrend = [
  { date: 'Jan', revenue: 15000 },
  { date: 'Feb', revenue: 18000 },
  { date: 'Mar', revenue: 22000 },
  { date: 'Apr', revenue: 20000 },
  { date: 'May', revenue: 25000 },
  { date: 'Jun', revenue: 28000 },
];

export const recentSales: RecentSale[] = [
  { id: '1', customer: customers[0], amount: 999.99 },
  { id: '2', customer: customers[1], amount: 349.50 },
  { id: '3', customer: customers[2], amount: 150.00 },
  { id: '4', customer: customers[3], amount: 499.00 },
  { id: '5', customer: customers[4], amount: 249.99 },
];
