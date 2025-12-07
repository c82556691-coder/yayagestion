'use client';

import {
  Card,
  CardContent,
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
import { Button } from '@/components/ui/button';
import { Warehouse, PlusCircle } from 'lucide-react';
import type { LocalStockItem } from '@/lib/definitions';

// Mock data representing the local inventory for "Cafetería Avellaneda"
const mockLocalStock: LocalStockItem[] = [
  { productId: 'prod1', name: 'Granos de Café', quantity: 25, unit: 'kg' },
  { productId: 'prod2', name: 'Leche Entera', quantity: 50, unit: 'litros' },
  { productId: 'prod3', name: 'Harina de Trigo', quantity: 30, unit: 'kg' },
  { productId: 'prod4', name: 'Azúcar', quantity: 40, unit: 'kg' },
  { productId: 'prod5', name: 'Chocolate en Polvo', quantity: 15, unit: 'kg' },
];

export default function AlmacenPage() {
  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold tracking-tight">
          Gestión de Almacén del Local
        </h2>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Solicitar Suministros
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Warehouse className="h-6 w-6" />
            <span>Inventario de Cafetería Avellaneda</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead className="text-right">Cantidad</TableHead>
                <TableHead>Unidad</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockLocalStock.map((item) => (
                <TableRow key={item.productId}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell>{item.unit}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
