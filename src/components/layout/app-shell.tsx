import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar';
import { Nav } from './nav';
import Header from './header';
import Link from 'next/link';

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="p-4">
          <Link href="/">
            <span className="text-xl font-semibold cursor-pointer">CRM Centro Control Locales</span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <Nav />
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <Header />
        <main className="flex-1 bg-background">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
