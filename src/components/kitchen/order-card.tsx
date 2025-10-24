'use client';
import type { Order } from '@/lib/definitions';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { doc, updateDoc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';

interface OrderCardProps {
  order: Order;
}

export function OrderCard({ order }: OrderCardProps) {
  const firestore = useFirestore();

  const handleUpdateStatus = async (newStatus: 'Preparing' | 'Ready') => {
    if (!order.id) return;
    const orderRef = doc(firestore, 'orders', order.id);
    await updateDoc(orderRef, { status: newStatus });
  };

  const timeSince = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
  };


  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Table {order.tableNumber}</span>
           <Badge variant={order.status === 'Pending' ? 'destructive' : 'default'}>
            {order.status}
          </Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {timeSince(order.createdAt.toDate())}
        </p>
      </CardHeader>
      <CardContent>
        <Separator className="mb-4" />
        <ul className="space-y-2">
          {order.items.map((item, index) => (
            <li key={index} className="flex justify-between">
              <span>{item.quantity}x {item.name}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="flex gap-2">
        {order.status === 'Pending' && (
          <Button
            className="w-full"
            onClick={() => handleUpdateStatus('Preparing')}
          >
            Start Preparing
          </Button>
        )}
        {order.status === 'Preparing' && (
          <Button
            className="w-full"
            variant="outline"
            onClick={() => handleUpdateStatus('Ready')}
          >
            Mark as Ready
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
