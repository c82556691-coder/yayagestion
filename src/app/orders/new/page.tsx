'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Product, OrderItem, Customer } from '@/lib/definitions';
import { PlusCircle, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';

export default function NewOrderPage() {
  const { toast } = useToast();
  const firestore = useFirestore();

  const productsCollection = useMemoFirebase(
    () => (firestore ? collection(firestore, 'products') : null),
    [firestore]
  );
  const customersCollection = useMemoFirebase(
    () => (firestore ? collection(firestore, 'customers') : null),
    [firestore]
  );

  const { data: productsData } = useCollection<Product>(productsCollection);
  const products = productsData || [];
  const { data: customersData } = useCollection<Customer>(customersCollection);
  const customers = customersData || [];

  const [customer, setCustomer] = useState<Customer | undefined>();
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();
  const [quantity, setQuantity] = useState(1);

  const handleAddProduct = () => {
    if (selectedProduct && quantity > 0) {
      const existingItem = orderItems.find(item => item.productId === selectedProduct.id);
      const currentQuantityInCart = existingItem ? existingItem.quantity : 0;
      
      if (quantity + currentQuantityInCart > selectedProduct.stock) {
        toast({
            title: "Insufficient Stock",
            description: `Only ${selectedProduct.stock} units of ${selectedProduct.name} available. You have ${currentQuantityInCart} in your cart.`,
            variant: "destructive",
        });
        return;
      }

      if (existingItem) {
        setOrderItems(orderItems.map(item =>
          item.productId === selectedProduct.id ? { ...item, quantity: item.quantity + quantity } : item
        ));
      } else {
        setOrderItems([...orderItems, { productId: selectedProduct.id!, quantity, price: selectedProduct.price }]);
      }
      setSelectedProduct(undefined);
      setQuantity(1);
    }
  };

  const handleRemoveItem = (productId: string) => {
    setOrderItems(orderItems.filter(item => item.productId !== productId));
  };
  
  const total = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmitOrder = () => {
    if (!customer) {
        toast({
            title: 'Error',
            description: 'Please select a customer.',
            variant: 'destructive',
        });
        return;
    }
    if (orderItems.length === 0) {
        toast({
            title: 'Error',
            description: 'Please add at least one product to the order.',
            variant: 'destructive',
        });
        return;
    }
    // TODO: Save order to Firestore
    console.log({
      customer,
      items: orderItems,
      total,
    });
    toast({
        title: 'Order Created',
        description: `A new order for ${customer.name} has been successfully created.`,
    });
    setCustomer(undefined);
    setOrderItems([]);
  };

  return (
    <div className="p-4 md:p-8">
      <h2 className="text-3xl font-bold tracking-tight mb-6">Create New Order</h2>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="customer">Customer</Label>
                  <Select onValueChange={(value) => setCustomer(customers.find(c => c.id === value))} value={customer?.id}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map(c => (
                        <SelectItem key={c.id} value={c.id!}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Products</CardTitle>
              <CardDescription>Add products to the order.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 items-end mb-4">
                <div className="flex-grow space-y-2">
                  <Label htmlFor="product">Product</Label>
                  <Select onValueChange={(value) => setSelectedProduct(products.find(p => p.id === value))} value={selectedProduct?.id}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map(p => (
                        <SelectItem key={p.id} value={p.id!}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input id="quantity" type="number" value={quantity} onChange={e => setQuantity(Number(e.target.value))} min="1" className="w-24" />
                </div>
                <Button onClick={handleAddProduct} disabled={!selectedProduct}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              {orderItems.length > 0 ? (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Qty</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orderItems.map(item => {
                        const product = products.find(p => p.id === item.productId);
                        return (
                          <TableRow key={item.productId}>
                            <TableCell className="font-medium">{product?.name}</TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell className="text-right">${(item.price * item.quantity).toFixed(2)}</TableCell>
                            <TableCell>
                              <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item.productId)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                  <Button onClick={handleSubmitOrder} className="w-full mt-6">Submit Order</Button>
                </>
              ) : (
                <p className="text-muted-foreground text-center">No products added yet.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
