'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ClipboardList,
  CookingPot,
  BookMarked,
  Warehouse,
  Beer,
} from 'lucide-react';
import Link from 'next/link';

const sections = [
  {
    title: 'Mesas y Pedidos',
    href: '/locales/1/mesas',
    icon: ClipboardList,
    description: 'Crea nuevos pedidos y gestiona las mesas activas.',
  },
  {
    title: 'Cocina',
    href: '/locales/1/cocina',
    icon: CookingPot,
    description: 'Visualiza y gestiona los pedidos pendientes para la cocina.',
  },
  {
    title: 'Cantina',
    href: '/locales/1/cantina',
    icon: Beer,
    description: 'Gestiona el inventario de bebidas y pedidos de la barra.',
  },
  {
    title: 'Almacén',
    href: '/locales/1/almacen',
    icon: Warehouse,
    description: 'Controla el stock de ingredientes y otros suministros.',
  },
  {
    title: 'Menú',
    href: '/locales/1/menu',
    icon: BookMarked,
    description: 'Administra los platos, precios y disponibilidad del menú.',
  },
];

export default function LocalDashboardPage() {
  return (
    <div className="p-4 md:p-8">
      <h2 className="text-3xl font-bold tracking-tight mb-2">
        Cafetería Avellaneda
      </h2>
      <p className="text-muted-foreground mb-6">
        Panel de gestión del local.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section) => (
          <Link href={section.href} key={section.title}>
            <Card className="hover:bg-accent hover:text-accent-foreground transition-colors h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium">
                  {section.title}
                </CardTitle>
                <section.icon className="h-6 w-6 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {section.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
