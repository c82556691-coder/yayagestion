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
  // Show local nav if we are in a local's path, but not on the global warehouse page.
  const isLocalRoute = pathname.startsWith('/locales/1') && pathname !== '/locales/1/almacen';

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
