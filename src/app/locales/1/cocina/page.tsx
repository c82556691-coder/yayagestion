'use client';

import { OrderCard } from '@/components/kitchen/order-card';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import type { Order } from '@/lib/definitions';
import { collection, query, where, orderBy } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

export default function CocinaPage() {
  const firestore = useFirestore();

  const kitchenOrdersQuery = useMemoFirebase(
    () =>
      firestore
        ? query(
            collection(firestore, 'orders'),
            where('status', 'in', ['Pending', 'Preparing']),
            orderBy('createdAt', 'asc')
          )
        : null,
    [firestore]
  );

  const { data: orders, isLoading } = useCollection<Order>(kitchenOrdersQuery);

  return (
    <div className="p-4 md:p-8">
      <h2 className="text-3xl font-bold tracking-tight mb-6">
        Pantalla de Cocina
      </h2>
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-4 border rounded-lg space-y-4">
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-4 w-3/4" />
              <div className="space-y-2 pt-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {orders && orders.length > 0 ? (
            orders.map((order) => <OrderCard key={order.id} order={order} />)
          ) : (
            <p className="text-muted-foreground col-span-full text-center">
              No hay pedidos pendientes para la cocina.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
