'use client';
import { OrderForm } from '@/components/orders/order-form';
import { OrderList } from '@/components/orders/order-list';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import type { Order } from '@/lib/definitions';
import { collection, query, where } from 'firebase/firestore';

export default function OrdersPage() {
  const firestore = useFirestore();
  const ordersCollection = useMemoFirebase(
    () => (firestore ? collection(firestore, 'orders') : null),
    [firestore]
  );
  
  const activeOrdersQuery = useMemoFirebase(() => (
    ordersCollection ? query(ordersCollection, where('status', '!=', 'Paid')) : null
  ), [ordersCollection]);

  const { data: activeOrders, isLoading } = useCollection<Order>(activeOrdersQuery);

  return (
    <div className="p-4 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-1">
        <OrderForm />
      </div>
      <div className="md:col-span-2">
        <OrderList title="Pedidos Activos" orders={activeOrders || []} isLoading={isLoading} />
      </div>
    </div>
  );
}
