'use client';
import { useState } from 'react';
import { OrderForm } from '@/components/orders/order-form';
import { OrderList } from '@/components/orders/order-list';
import type { Order } from '@/lib/definitions';
import { Timestamp } from 'firebase/firestore';

const tables = [
  { id: 1, name: 'Mesa 1' },
  { id: 2, name: 'Mesa 2' },
  { id: 3, name: 'Mesa 3' },
  { id: 4, name: 'Mesa 4' },
];

export default function MesasPage() {
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
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight mb-6">
          Gestión de Mesas y Consumos
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {tables.map((table) => (
            <OrderForm
              key={table.id}
              tableNumber={table.id}
              onOrderAdded={handleOrderAdded}
            />
          ))}
        </div>
      </div>

      <div>
        <OrderList
          title="Pedidos Activos"
          orders={activeOrders}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
