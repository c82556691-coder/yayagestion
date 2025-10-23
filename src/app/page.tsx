'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Product } from '@/lib/definitions';
import { PlusCircle, Trash2, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import Link from 'next/link';

interface CalculationItem {
  productId: string;
  name: string;
  initialStock: number;
  finalStock: number;
  price: number;
}

export default function CalculatorPage() {
  const { toast } = useToast();
  const firestore = useFirestore();

  const productsCollection = useMemoFirebase(
    () => (firestore ? collection(firestore, 'products') : null),
    [firestore]
  );

  const { data: productsData } = useCollection<Product>(productsCollection);
  const products = productsData || [];

  const [calculationItems, setCalculationItems] = useState<CalculationItem[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  
  const handleAddProduct = () => {
    const product = products.find(p => p.id === selectedProductId);
    if (product && !calculationItems.find(item => item.productId === product.id)) {
      setCalculationItems([...calculationItems, {
        productId: product.id!,
        name: product.name,
        initialStock: 0,
        finalStock: 0,
        price: product.price,
      }]);
      setSelectedProductId('');
    } else if (!product) {
        toast({
            title: "Producto no seleccionado",
            description: "Por favor, selecciona un producto para añadir.",
            variant: "destructive",
        })
    }
  };

  const handleItemChange = (productId: string, field: keyof CalculationItem, value: number) => {
    setCalculationItems(calculationItems.map(item => 
      item.productId === productId ? { ...item, [field]: value } : item
    ));
  };

  const handleRemoveItem = (productId: string) => {
    setCalculationItems(calculationItems.filter(item => item.productId !== productId));
  };

  const handleClearAll = () => {
    setCalculationItems([]);
    toast({
        title: 'Calculadora Limpiada',
        description: `Se han eliminado todos los productos de la lista.`,
    });
  }
  
  const total = calculationItems.reduce((sum, item) => {
    const sold = item.finalStock - item.initialStock;
    const amount = sold > 0 ? sold * item.price : 0;
    return sum + amount;
  }, 0);

  return (
    <div className="p-4 md:p-8">
      <h2 className="text-3xl font-bold tracking-tight mb-6">Calculadora de Venta</h2>
      <div className="grid gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Añadir Producto a la Calculadora</CardTitle>
            <CardDescription>Selecciona un producto para añadirlo a la tabla de cálculo de ventas.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 items-end">
              <div className="flex-grow space-y-2">
                <Label htmlFor="product">Producto</Label>
                <Select onValueChange={setSelectedProductId} value={selectedProductId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un producto" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map(p => (
                       <SelectItem key={p.id} value={p.id!} disabled={calculationItems.some(item => item.productId === p.id)}>
                         {p.name}
                       </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAddProduct} disabled={!selectedProductId}>
                <PlusCircle className="mr-2 h-4 w-4" /> Añadir
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Cálculo de Venta</CardTitle>
            {calculationItems.length > 0 && (
               <Button variant="ghost" size="icon" onClick={handleClearAll} title="Limpiar todo">
                  <XCircle className="h-5 w-5 text-destructive" />
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {calculationItems.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead className="min-w-[200px]">Producto</TableHead>
                            <TableHead>Inicio</TableHead>
                            <TableHead>Final</TableHead>
                            <TableHead>Precio</TableHead>
                            <TableHead className="text-right">Importe</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {calculationItems.map(item => {
                            const sold = item.finalStock - item.initialStock;
                            const amount = sold > 0 ? sold * item.price : 0;
                            return (
                            <TableRow key={item.productId}>
                                <TableCell className="font-medium">{item.name}</TableCell>
                                <TableCell>
                                    <Input 
                                        type="number" 
                                        value={item.initialStock} 
                                        onChange={(e) => handleItemChange(item.productId, 'initialStock', Number(e.target.value))}
                                        className="w-24"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Input 
                                        type="number" 
                                        value={item.finalStock} 
                                        onChange={(e) => handleItemChange(item.productId, 'finalStock', Number(e.target.value))}
                                        className="w-24"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Input 
                                        type="number" 
                                        value={item.price} 
                                        onChange={(e) => handleItemChange(item.productId, 'price', Number(e.target.value))}
                                        step="0.01"
                                        className="w-28"
                                    />
                                </TableCell>
                                <TableCell className="text-right font-medium">${amount.toFixed(2)}</TableCell>
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
                </div>
                <div className="mt-6 pt-4 border-t">
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
              <p className="text-muted-foreground text-center">No hay productos en la calculadora.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
