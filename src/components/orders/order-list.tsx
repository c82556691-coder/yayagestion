'use client';
import type { Order } from '@/lib/definitions';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useFirestore } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { Skeleton } from '../ui/skeleton';

interface OrderListProps {
  title: string;
  orders: Order[];
  isLoading: boolean;
}

export function OrderList({ title, orders, isLoading }: OrderListProps) {
  const firestore = useFirestore();

  const handleUpdateStatus = async (orderId: string, status: Order['status']) => {
    const orderRef = doc(firestore, 'orders', orderId);
    await updateDoc(orderRef, { status });
  };
  
  const getStatusVariant = (status: Order['status']) => {
    switch (status) {
      case 'Pending':
        return 'destructive';
      case 'Preparing':
        return 'secondary';
      case 'Ready':
        return 'default';
      case 'Served':
        return 'outline';
      default:
        return 'default';
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>A list of current orders in the system.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
            <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
            </div>
        ) : orders.length > 0 ? (
          <Accordion type="multiple" className="w-full">
            {orders.map((order) => (
              <AccordionItem value={order.id!} key={order.id}>
                <AccordionTrigger>
                  <div className="flex justify-between w-full pr-4">
                    <span className="font-bold">Table {order.tableNumber}</span>
                    <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4">
                    <ul className="space-y-2">
                    {order.items.map((item, index) => (
                        <li key={index} className="flex justify-between text-sm">
                        <span>{item.quantity}x {item.name}</span>
                        <span>${(item.quantity * item.price).toFixed(2)}</span>
                        </li>
                    ))}
                    </ul>
                    <div className="font-bold text-right">
                        Total: ${order.items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
                    </div>
                    <div className="flex gap-2 justify-end">
                        {order.status === 'Ready' && (
                             <Button size="sm" onClick={() => handleUpdateStatus(order.id!, 'Served')}>
                                Mark as Served
                            </Button>
                        )}
                        {order.status === 'Served' && (
                             <Button size="sm" onClick={() => handleUpdateStatus(order.id!, 'Paid')}>
                                Mark as Paid
                            </Button>
                        )}
                    </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <p className="text-muted-foreground text-center">No active orders.</p>
        )}
      </CardContent>
    </Card>
  );
}
