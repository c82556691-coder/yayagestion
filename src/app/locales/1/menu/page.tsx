'use client';
import { useState } from 'react';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { MenuItemCard } from '@/components/menu/menu-item-card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { MenuItemForm } from '@/components/menu/menu-item-form';
import type { MenuItem } from '@/lib/definitions';
import { useFirestore, useMemoFirebase } from '@/firebase';
import {
  addDocumentNonBlocking,
  setDocumentNonBlocking,
} from '@/firebase/non-blocking-updates';
import { collection, doc } from 'firebase/firestore';
import { localMenuItems } from '@/lib/menu-data';

export default function MenuPage() {
  const firestore = useFirestore();
  const menuItemsCollection = useMemoFirebase(
    () => (firestore ? collection(firestore, 'menuItems') : null),
    [firestore]
  );

  // Use local data instead of useCollection
  const [menuItems, setMenuItems] = useState<MenuItem[]>(localMenuItems);
  const isLoading = false; // Data is loaded locally

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
    // This part still interacts with Firestore for saving, which is fine.
    // The issue was with reading the collection on load.
    if (!menuItemsCollection) return;

    if (item.id) {
      const itemRef = doc(menuItemsCollection, item.id);
      const { id, ...itemData } = item;
      setDocumentNonBlocking(itemRef, itemData, { merge: true });
       // Optimistically update local state
      setMenuItems(prevItems => prevItems.map(i => i.id === item.id ? { ...i, ...itemData } as MenuItem : i));
    } else {
      const newId = doc(collection(firestore!, 'temp')).id;
      const newItem = {
        ...item,
        id: newId,
        isAvailable: true,
        imageUrl: `https://picsum.photos/seed/${item.name || 'new'}/600/400`,
      } as MenuItem;
      
      const { id, ...newItemData } = newItem;
      addDocumentNonBlocking(doc(menuItemsCollection, id), newItemData);
      // Optimistically update local state
      setMenuItems(prevItems => [...prevItems, newItem]);
    }

    setIsFormOpen(false);
    setEditingItem(null);
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold tracking-tight">Gestión de Menú</h2>
        <Button onClick={handleAddNew}>
          <PlusCircle className="mr-2 h-4 w-4" /> Añadir Nuevo Plato
        </Button>
      </div>

      {isLoading ? (
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
           {/* Skeleton remains for consistency, though isLoading is false now */}
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
              {editingItem ? 'Editar Plato' : 'Añadir Nuevo Plato'}
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
