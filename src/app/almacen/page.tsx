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
import { Truck, Warehouse, PlusCircle } from 'lucide-react';
import type { CentralStockItem, LocalStockItem, Product } from '@/lib/definitions';
import Link from 'next/link';

// Mock data mapping product IDs to names and units
const mockProducts: Record<string, Omit<Product, 'id' | 'description'>> = {
  prod1: { name: 'Granos de Café', unit: 'kg' },
  prod2: { name: 'Leche Entera', unit: 'litros' },
  prod3: { name: 'Harina de Trigo', unit: 'kg' },
  prod4: { name: 'Azúcar', unit: 'kg' },
  prod5: { name: 'Chocolate en Polvo', unit: 'kg' },
};


// Mock data for the central warehouse
const mockCentralStock: (CentralStockItem & { name: string; unit: string })[] = [
  { productId: 'prod1', quantity: 200, name: 'Granos de Café', unit: 'kg' },
  { productId: 'prod2', quantity: 500, name: 'Leche Entera', unit: 'litros' },
  { productId: 'prod3', quantity: 300, name: 'Harina de Trigo', unit: 'kg' },
  { productId: 'prod4', quantity: 450, name: 'Azúcar', unit: 'kg' },
  { productId: 'prod5', quantity: 150, name: 'Chocolate en Polvo', unit: 'kg' },
];

// Mock data for local inventories
const mockLocalInventories = [
    {
        locationId: '1',
        locationName: 'Cafetería Avellaneda',
        active: true,
        stock: [
            { productId: 'prod1', name: 'Granos de Café', quantity: 25, unit: 'kg' },
            { productId: 'prod2', name: 'Leche Entera', quantity: 50, unit: 'litros' },
            { productId: 'prod3', name: 'Harina de Trigo', quantity: 30, unit: 'kg' },
        ]
    },
    { locationId: '2', locationName: 'Local 2', active: false, stock: [] },
    { locationId: '3', locationName: 'Local 3', active: false, stock: [] },
    { locationId: '4', locationName: 'Local 4', active: false, stock: [] },
]

export default function AlmacenPrincipalPage() {
  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold tracking-tight">
          Gestión de Inventario Central
        </h2>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Añadir Nuevo Producto
        </Button>
      </div>

      {/* Central Stock Card */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Warehouse className="h-6 w-6" />
            <span>Almacén Principal</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead className="text-right">Cantidad Total</TableHead>
                <TableHead>Unidad</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockCentralStock.map((item) => (
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

       {/* Local Inventories Section */}
      <div>
        <h3 className="text-2xl font-bold tracking-tight mb-4">Inventarios de Locales</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockLocalInventories.map(local => (
                 <Card key={local.locationId}>
                    <CardHeader>
                        <CardTitle className='flex justify-between items-center'>
                            <span>{local.locationName}</span>
                             <Button asChild variant="outline" size="sm" disabled={!local.active}>
                                <Link href={local.active ? `/locales/${local.locationId}/almacen` : '#'}>
                                    Ver Detalle
                                </Link>
                            </Button>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {local.active ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Producto</TableHead>
                                        <TableHead className='text-right'>Cantidad</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {local.stock.slice(0, 3).map(item => (
                                        <TableRow key={item.productId}>
                                            <TableCell>{item.name}</TableCell>
                                            <TableCell className='text-right'>{item.quantity} {item.unit}</TableCell>
                                        </TableRow>
                                    ))}
                                    {local.stock.length > 3 && (
                                        <TableRow>
                                            <TableCell colSpan={2} className="text-center text-muted-foreground">
                                                ...y {local.stock.length - 3} más productos.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        ) : (
                            <p className="text-sm text-muted-foreground text-center py-8">Inventario no disponible.</p>
                        )}
                    </CardContent>
                 </Card>
            ))}
        </div>
      </div>

    </div>
  );
}
