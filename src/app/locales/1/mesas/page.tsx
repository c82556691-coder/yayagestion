'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';

const tables = [
  { id: 1, name: 'Mesa 1' },
  { id: 2, name: 'Mesa 2' },
  { id: 3, name: 'Mesa 3' },
  { id: 4, name: 'Mesa 4' },
];

export default function MesasPage() {
  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold tracking-tight">Gestión de Mesas</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {tables.map((table) => (
          <Card key={table.id}>
            <CardHeader>
              <CardTitle>{table.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <p className="text-muted-foreground text-sm">
                Actualmente libre.
              </p>
              <Button asChild>
                <Link href={`/locales/1/pedidos?table=${table.id}`}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Añadir Pedido
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
