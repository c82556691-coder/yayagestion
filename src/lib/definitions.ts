export type Product = {
  id?: string;
  name: string;
  description?: string;
  price: number;
  stock?: number;
  imageId: string;
};

export type Customer = {
  id?: string;
  name: string;
  email: string;
  imageId: string;
};

export type OrderItem = {
  productId: string;
  quantity: number;
  price: number;
};

export type Order = {
  id: string;
  customer: Customer;
  orderDate: string;
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
  items: OrderItem[];
  total: number;
};

export type RecentSale = {
  id: string;
  customer: Customer;
  amount: number;
};
