'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Product, OrderItem } from '@/lib/definitions';
import { PlusCircle, Trash2, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import Link from 'next/link';

export default function CalculatorPage() {
  const { toast } = useToast();
  const firestore = useFirestore();

  const productsCollection = useMemoFirebase(
    () => (firestore ? collection(firestore, 'products') : null),
    [firestore]
  );

  const { data: productsData } = useCollection<Product>(productsCollection);
  const products = productsData || [];

  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();
  const [quantity, setQuantity] = useState(1);

  const handleAddProduct = () => {
    if (selectedProduct && quantity > 0) {
      const existingItem = orderItems.find(item => item.productId === selectedProduct.id);
      const currentQuantityInCart = existingItem ? existingItem.quantity : 0;
      
      if (quantity + currentQuantityInCart > selectedProduct.stock) {
        toast({
            title: "Inventario Insuficiente",
            description: `Solo hay ${selectedProduct.stock} unidades de ${selectedProduct.name} disponibles. Ya tienes ${currentQuantityInCart} en tu carrito.`,
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

  const handleClearAll = () => {
    setOrderItems([]);
    toast({
        title: 'Calculadora Limpiada',
        description: `Se han eliminado todos los productos de la lista.`,
    });
  }
  
  const total = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="p-4 md:p-8">
      <h2 className="text-3xl font-bold tracking-tight mb-6">Calculadora de Venta</h2>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Productos</CardTitle>
              <CardDescription>Añade productos a la venta actual.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 items-end mb-4">
                <div className="flex-grow space-y-2">
                  <Label htmlFor="product">Producto</Label>
                  <Select onValueChange={(value) => setSelectedProduct(products.find(p => p.id === value))} value={selectedProduct?.id || ''}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un producto" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map(p => (
                        <SelectItem key={p.id} value={p.id!}>
                          {p.name} (Stock: {p.stock})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">Cantidad</Label>
                  <Input id="quantity" type="number" value={quantity} onChange={e => setQuantity(Number(e.target.value))} min="1" className="w-24" />
                </div>
                <Button onClick={handleAddProduct} disabled={!selectedProduct}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Añadir
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Resumen de Venta</CardTitle>
              {orderItems.length > 0 && (
                 <Button variant="ghost" size="icon" onClick={handleClearAll} title="Limpiar todo">
                    <XCircle className="h-5 w-5 text-destructive" />
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {orderItems.length > 0 ? (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Producto</TableHead>
                        <TableHead>Cant.</TableHead>
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
                  <Button asChild className="w-full mt-6" disabled={total <= 0}>
                    <Link href={`/qr-payment?amount=${total.toFixed(2)}`}>
                        Proceder al Pago
                    </Link>
                  </Button>
                </>
              ) : (
                <p className="text-muted-foreground text-center">No hay productos añadidos.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
