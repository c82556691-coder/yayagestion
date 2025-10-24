'use client';
import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit } from 'lucide-react';
import { MenuItemCard } from '@/components/menu/menu-item-card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { MenuItemForm } from '@/components/menu/menu-item-form';
import type { MenuItem } from '@/lib/definitions';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import {
  addDocumentNonBlocking,
  setDocumentNonBlocking,
} from '@/firebase/non-blocking-updates';
import { collection, doc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

export default function MenuPage() {
  const firestore = useFirestore();
  const menuItemsCollection = useMemoFirebase(
    () => (firestore ? collection(firestore, 'menuItems') : null),
    [firestore]
  );

  const { data: menuItemsData, isLoading } = useCollection<MenuItem>(menuItemsCollection);
  const menuItems = menuItemsData || [];

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const handleAddNew = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleSave = (item: Partial<MenuItem>) => {
    if (!menuItemsCollection) return;

    if (item.id) {
      const itemRef = doc(menuItemsCollection, item.id);
      const { id, ...itemData } = item;
      setDocumentNonBlocking(itemRef, itemData, { merge: true });
    } else {
      addDocumentNonBlocking(menuItemsCollection, {
        ...item,
        isAvailable: true, 
        imageUrl: `https://picsum.photos/seed/${item.name || 'new'}/600/400`,
      });
    }

    setIsFormOpen(false);
    setEditingItem(null);
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold tracking-tight">Menu Management</h2>
        <Button onClick={handleAddNew}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Item
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
             <Card key={i}><CardContent className="p-4 space-y-2">
                <Skeleton className="h-[150px] w-full" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <div className="flex justify-between items-center pt-2">
                    <Skeleton className="h-6 w-1/4" />
                    <Skeleton className="h-8 w-8" />
                </div>
              </CardContent></Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {menuItems.map((item) => (
            <MenuItemCard key={item.id} item={item} onEdit={() => handleEdit(item)} />
          ))}
        </div>
      )}

       <Dialog
        open={isFormOpen}
        onOpenChange={(isOpen) => {
          if (!isOpen) setEditingItem(null);
          setIsFormOpen(isOpen);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
            </DialogTitle>
          </DialogHeader>
          <MenuItemForm
            item={editingItem}
            onSave={handleSave}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
