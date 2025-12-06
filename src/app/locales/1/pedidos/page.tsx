'use client';
import { useState } from 'react';
import { OrderForm } from '@/components/orders/order-form';
import { OrderList } from '@/components/orders/order-list';
import type { Order } from '@/lib/definitions';
import { Timestamp } from 'firebase/firestore';

export default function OrdersPage() {
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleOrderAdded = (newOrder: Omit<Order, 'id' | 'createdAt'>) => {
    const fullOrder: Order = {
      ...newOrder,
      id: `local-${Date.now()}`, // Create a temporary local ID
      createdAt: Timestamp.now(),
    };
    setActiveOrders((prevOrders) => [fullOrder, ...prevOrders]);
  };

  return (
    <div className="p-4 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-1">
        <OrderForm onOrderAdded={handleOrderAdded} />
      </div>
      <div className="md:col-span-2">
        <OrderList
          title="Pedidos Activos"
          orders={activeOrders}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
