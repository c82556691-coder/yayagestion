'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Building, ChevronRight } from 'lucide-react';

const locales = [
  { id: 1, name: 'Cafetería Avellaneda', href: '/locales/1', active: true },
  { id: 2, name: 'Local 2', href: '#', active: false },
  { id: 3, name: 'Local 3', href: '#', active: false },
  { id: 4, name: 'Local 4', href: '#', active: false },
];

export default function HomePage() {
  return (
    <div className="p-4 md:p-8 flex flex-col items-center justify-center min-h-full">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-2">
          CRM Centro Control Locales
        </h1>
        <p className="text-lg text-muted-foreground">
          Seleccione un local para comenzar a gestionar.
        </p>
      </div>

      <div className="w-full max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Mis Locales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {locales.map((local) => (
              <Card key={local.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Building className="h-6 w-6 text-primary" />
                    <div>
                      <h3 className="font-semibold">{local.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {local.active
                          ? 'Listo para gestionar'
                          : 'Próximamente'}
                      </p>
                    </div>
                  </div>
                  <Button
                    asChild
                    variant="ghost"
                    size="icon"
                    disabled={!local.active}
                  >
                    <Link href={local.href}>
                      <ChevronRight className="h-5 w-5" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
