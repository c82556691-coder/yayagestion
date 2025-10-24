'use client';
import type { MenuItem } from '@/lib/definitions';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Edit } from 'lucide-react';

interface MenuItemCardProps {
  item: MenuItem;
  onEdit: (item: MenuItem) => void;
}

export function MenuItemCard({ item, onEdit }: MenuItemCardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="p-0 relative">
        <Badge
          className="absolute top-2 right-2"
          variant={item.isAvailable ? 'default' : 'destructive'}
        >
          {item.isAvailable ? 'Available' : 'Unavailable'}
        </Badge>
        <Image
          src={item.imageUrl}
          alt={item.name}
          width={400}
          height={250}
          className="object-cover rounded-t-lg aspect-[16/10]"
        />
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-lg font-semibold mb-1">{item.name}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground line-clamp-2">
          {item.description}
        </CardDescription>
      </CardContent>
      <CardFooter className="p-4 flex justify-between items-center">
        <p className="text-xl font-bold text-primary">${item.price.toFixed(2)}</p>
        <Button variant="outline" size="icon" onClick={() => onEdit(item)}>
          <Edit className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
