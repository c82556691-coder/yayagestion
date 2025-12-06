'use client';
import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { OrderForm } from '@/components/orders/order-form';
import { OrderList } from '@/components/orders/order-list';
import type { Order } from '@/lib/definitions';
import { Timestamp } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function OrdersPageContent() {
  const searchParams = useSearchParams();
  const tableNumberFromQuery = searchParams.get('table');

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
        {tableNumberFromQuery ? (
          <OrderForm
            tableNumber={Number(tableNumberFromQuery)}
            onOrderAdded={handleOrderAdded}
          />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Crear Pedido</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-12">
                Seleccione una mesa desde la página de{' '}
                <a href="/locales/1/mesas" className="underline text-primary">
                  Gestión de Mesas
                </a>{' '}
                para crear un nuevo pedido.
              </p>
            </CardContent>
          </Card>
        )}
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

export default function OrdersPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrdersPageContent />
    </Suspense>
  );
}
