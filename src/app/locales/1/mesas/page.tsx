'use client';
import { useState } from 'react';
import { OrderForm } from '@/components/orders/order-form';
import type { Order } from '@/lib/definitions';
import { Timestamp } from 'firebase/firestore';
import { InventoryChart } from '@/components/inventory/inventory-chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { localMenuItems } from '@/lib/menu-data';

const tables = [
  { id: 1, name: 'Mesa 1' },
  { id: 2, name: 'Mesa 2' },
  { id: 3, name: 'Mesa 3' },
  { id: 4, name: 'Mesa 4' },
];

export default function MesasPage() {
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);

  const handleOrderAdded = (newOrder: Omit<Order, 'id' | 'createdAt'>) => {
    const fullOrder: Order = {
      ...newOrder,
      id: `local-${Date.now()}`, // Create a temporary local ID
      createdAt: Timestamp.now(),
    };
    // This logic can be expanded later to update inventory, etc.
    setActiveOrders((prevOrders) => [fullOrder, ...prevOrders]);
  };
  
  const inventoryData = localMenuItems.map(item => ({
    name: item.name,
    stock: item.stock,
  }));


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
        <Card>
            <CardHeader>
                <CardTitle>Inventario del Local</CardTitle>
            </CardHeader>
            <CardContent>
                <InventoryChart data={inventoryData} />
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
