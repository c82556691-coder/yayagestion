'use client';

import { OrderForm } from '@/components/orders/order-form';
import { OrderList } from '@/components/orders/order-list';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import type { Order } from '@/lib/definitions';

export default function OrdersPage() {
  const firestore = useFirestore();

  const activeOrdersQuery = useMemoFirebase(
    () =>
      firestore
        ? query(
            collection(firestore, 'orders'),
            where('status', '!=', 'Paid')
          )
        : null,
    [firestore]
  );
  
  const { data: activeOrders, isLoading: isLoadingActive } = useCollection<Order>(activeOrdersQuery);

  return (
    <div className="p-4 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <OrderForm />
      </div>
      <div className="lg:col-span-2">
        <OrderList
          title="Active Orders"
          orders={activeOrders || []}
          isLoading={isLoadingActive}
        />
      </div>
    </div>
  );
}
