'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import {
  ClipboardList,
  CookingPot,
  BookMarked,
} from 'lucide-react';

const navItems = [
  { href: '/', label: 'Pedidos', icon: ClipboardList },
  { href: '/kitchen', label: 'Cocina', icon: CookingPot },
  { href: '/menu', label: 'Menú', icon: BookMarked },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {navItems.map((item) => (
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
    </SidebarMenu>
  );
}
