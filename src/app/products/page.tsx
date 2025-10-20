'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/data';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { Product } from '@/lib/definitions';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductsPage() {
  const firestore = useFirestore();
  const productsCollection = useMemoFirebase(
    () => (firestore ? collection(firestore, 'products') : null),
    [firestore]
  );
  const { data: products = [], isLoading } = useCollection<Product>(productsCollection);

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold tracking-tight">Products</h2>
        {/* The add product functionality is on the database page */}
        {/* <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Product
        </Button> */}
      </div>
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="flex flex-col">
              <CardHeader className="p-0">
                <Skeleton className="h-[225px] w-full rounded-t-lg" />
              </CardHeader>
              <CardContent className="p-4 flex-grow space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
              <CardFooter className="p-4 flex justify-between items-center">
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-4 w-1/3" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => {
            const image = PlaceHolderImages.find((p) => p.id === product.imageId);
            return (
              <Card key={product.id} className="flex flex-col">
                <CardHeader className="p-0">
                  {image && (
                    <Image
                      src={image.imageUrl}
                      alt={product.name}
                      width={400}
                      height={300}
                      className="object-cover rounded-t-lg aspect-[4/3]"
                      data-ai-hint={image.imageHint}
                    />
                  )}
                </CardHeader>
                <CardContent className="p-4 flex-grow">
                  <CardTitle className="text-lg font-semibold mb-1">{product.name}</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground line-clamp-2">{product.description}</CardDescription>
                </CardContent>
                <CardFooter className="p-4 flex justify-between items-center">
                  <p className="text-xl font-bold text-primary">${product.price.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">Stock: {product.stock}</p>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
