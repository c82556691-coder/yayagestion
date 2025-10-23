
'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { PlaceHolderImages } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Edit, PlusCircle, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Product } from '@/lib/definitions';
import { ProductForm } from '@/components/product-form';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import {
  addDocumentNonBlocking,
  deleteDocumentNonBlocking,
  setDocumentNonBlocking,
} from '@/firebase/non-blocking-updates';
import { collection, doc } from 'firebase/firestore';

export default function DatabasePage() {
  const firestore = useFirestore();
  const productsCollection = useMemoFirebase(
    () => (firestore ? collection(firestore, 'products') : null),
    [firestore]
  );

  const { data: productsData, isLoading: productsLoading } =
    useCollection<Product>(productsCollection);
  const products = productsData || [];

  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);

  const handleSaveProduct = (product: Partial<Product>) => {
    if (!productsCollection) return;

    if (product.id) {
      const productRef = doc(productsCollection, product.id);
      const { id, ...productData } = product;
      setDocumentNonBlocking(productRef, productData, { merge: true });
    } else {
      addDocumentNonBlocking(productsCollection, {
        ...product,
        imageId: `prod${(products.length % 8) + 1}`,
      });
    }
    setIsProductDialogOpen(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (productId: string) => {
    if (!productsCollection) return;
    const productRef = doc(productsCollection, productId);
    deleteDocumentNonBlocking(productRef);
  };


  return (
    <div className="p-4 md:p-8">
      <h2 className="text-3xl font-bold tracking-tight mb-6">
        Gestión de Base de Datos
      </h2>
      <Tabs defaultValue="products">
        <TabsList className="grid w-full grid-cols-1">
          <TabsTrigger value="products">Productos</TabsTrigger>
        </TabsList>
        <TabsContent value="products">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Productos</CardTitle>
                  <CardDescription>
                    Una lista de todos los productos en tu inventario.
                  </CardDescription>
                </div>
                <Button
                  onClick={() => {
                    setEditingProduct(null);
                    setIsProductDialogOpen(true);
                  }}
                >
                  <PlusCircle className="mr-2 h-4 w-4" /> Añadir Producto
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Producto</TableHead>
                    <TableHead className="text-right">Precio</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productsLoading ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center">
                        Cargando productos...
                      </TableCell>
                    </TableRow>
                  ) : (
                    products.map((product) => {
                      const image = PlaceHolderImages.find(
                        (p) => p.id === product.imageId
                      );
                      return (
                        <TableRow key={product.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              {image && (
                                <Image
                                  src={image.imageUrl}
                                  alt={product.name}
                                  width={40}
                                  height={40}
                                  className="rounded-md object-cover"
                                  data-ai-hint={image.imageHint}
                                />
                              )}
                              <div>
                                <span className="font-medium">
                                  {product.name}
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            ${product.price.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setEditingProduct(product);
                                setIsProductDialogOpen(true);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteProduct(product.id!)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog
        open={isProductDialogOpen}
        onOpenChange={(isOpen) => {
          if (!isOpen) setEditingProduct(null);
          setIsProductDialogOpen(isOpen);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingProduct?.id ? 'Editar Producto' : 'Añadir Nuevo Producto'}
            </DialogTitle>
          </DialogHeader>
          <ProductForm
            product={editingProduct}
            onSave={handleSaveProduct}
            onCancel={() => {
              setIsProductDialogOpen(false);
              setEditingProduct(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
