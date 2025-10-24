import { SidebarTrigger } from '@/components/ui/sidebar';
import { Utensils } from 'lucide-react';

export default function Header() {
  return (
    <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-card px-6">
      <SidebarTrigger className="shrink-0 md:hidden" />
      <div className="w-full flex-1">
        <h1 className="text-lg font-semibold flex items-center gap-2">
          <Utensils className="h-5 w-5 text-primary" />
          GastroGo
        </h1>
      </div>
    </header>
  );
}
