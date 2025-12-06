import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Beer } from 'lucide-react';

export default function CantinaPage() {
  return (
    <div className="p-4 md:p-8">
      <h2 className="text-3xl font-bold tracking-tight mb-6">Gestión de Cantina</h2>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Beer className="h-6 w-6" />
            <span>Inventario de Cantina</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-12">
            <p>Funcionalidad de gestión de cantina próximamente.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
