import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { orders } from '@/lib/data';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';

const statusVariant: { [key: string]: 'default' | 'secondary' | 'destructive' | 'outline' } = {
  Pending: 'outline',
  Shipped: 'secondary',
  Delivered: 'default',
  Cancelled: 'destructive',
};

export default function OrdersPage() {
  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
        <Button asChild>
          <Link href="/orders/new">
            <PlusCircle className="mr-2 h-4 w-4" /> New Order
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Sales Orders</CardTitle>
          <CardDescription>A list of all sales orders.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customer.name}</TableCell>
                  <TableCell>{order.orderDate}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[order.status]}>{order.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
