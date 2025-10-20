'use client';

import { useState, useEffect } from 'react';
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
import { customers as initialCustomers, PlaceHolderImages } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Customer } from '@/lib/definitions';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type CustomerWithStats = Customer & {
  totalOrders: number;
  totalSpent: string;
};

export default function CustomersPage() {
  const [customers, setCustomers] = useState<CustomerWithStats[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: '', email: '' });

  useEffect(() => {
    // This runs only on the client, avoiding hydration mismatches.
    const customersWithStats = initialCustomers.map((customer) => ({
      ...customer,
      totalOrders: Math.floor(Math.random() * 25) + 1,
      totalSpent: (Math.random() * 5000 + 100).toFixed(2),
    }));
    setCustomers(customersWithStats);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCustomer((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    const newCustomerData: CustomerWithStats = {
      id: `cust${customers.length + 1}`,
      name: newCustomer.name,
      email: newCustomer.email,
      imageId: `customer${(customers.length % 5) + 1}`,
      totalOrders: 0,
      totalSpent: '0.00',
    };
    setCustomers((prev) => [...prev, newCustomerData]);
    setNewCustomer({ name: '', email: '' });
    setIsDialogOpen(false);
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Customer</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddCustomer}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={newCustomer.name}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={newCustomer.email}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="secondary">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit">Add Customer</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Customer List</CardTitle>
          <CardDescription>A list of all customers.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Total Orders</TableHead>
                <TableHead className="text-right">Total Spent</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => {
                const image = PlaceHolderImages.find(p => p.id === customer.imageId);
                return (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={image?.imageUrl} alt={customer.name} data-ai-hint={image?.imageHint} />
                          <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{customer.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.totalOrders}</TableCell>
                    <TableCell className="text-right">${customer.totalSpent}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
