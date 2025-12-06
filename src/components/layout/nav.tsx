'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import {
  Home,
  ClipboardList,
  CookingPot,
  BookMarked,
  Warehouse,
  Beer,
  LayoutGrid,
} from 'lucide-react';

const globalNavItems = [
  { href: '/', label: 'Inicio', icon: Home },
  { href: '/locales/1/almacen', label: 'Almacén', icon: Warehouse },
];

const localNavItems = [
  { href: '/locales/1', label: 'Dashboard', icon: LayoutGrid, exact: true },
  { href: '/locales/1/mesas', label: 'Mesas', icon: ClipboardList },
  { href: '/locales/1/cocina', label: 'Cocina', icon: CookingPot },
  { href: '/locales/1/cantina', label: 'Cantina', icon: Beer },
  { href: '/locales/1/almacen', label: 'Almacén', icon: Warehouse },
  { href: '/locales/1/menu', label: 'Menú', icon: BookMarked },
];

export function Nav() {
  const pathname = usePathname();
  const isLocalRoute = pathname.startsWith('/locales/1');

  // Filter out Almacén from localNavItems if we are showing it globally
  const filteredLocalNavItems = localNavItems.filter(item => {
      if (item.label === 'Almacén') {
          // If any global nav item already links to Almacén, don't show it in local nav.
          return !globalNavItems.some(gItem => gItem.label === 'Almacén' && pathname.startsWith('/locales/1'));
      }
      return true;
  });


  return (
    <SidebarMenu>
      {globalNavItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <SidebarMenuButton
            asChild
            isActive={pathname === item.href}
            tooltip={item.label}
          >
            <Link href={item.href}>
              <item.icon />
              <span>{item.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}

      {isLocalRoute && (
        <>
          <SidebarMenuItem>
            <span className="p-2 text-xs font-semibold text-muted-foreground">
              Cafetería Avellaneda
            </span>
          </SidebarMenuItem>
          {localNavItems.map((item) => {
            // Hide Almacen from local nav if global Almacen link exists and is active
            if (item.label === 'Almacén' && globalNavItems.some(i => i.label === 'Almacén')) {
              return null;
            }
            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={
                    item.exact
                      ? pathname === item.href
                      : pathname.startsWith(item.href)
                  }
                  tooltip={item.label}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </>
      )}
    </SidebarMenu>
  );
}
