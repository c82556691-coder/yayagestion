import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { products, PlaceHolderImages } from '@/lib/data';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export default function ProductsPage() {
  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold tracking-tight">Products</h2>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </div>
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
                    className="object-cover rounded-t-lg"
                    data-ai-hint={image.imageHint}
                  />
                )}
              </CardHeader>
              <CardContent className="p-4 flex-grow">
                <CardTitle className="text-lg font-semibold mb-1">{product.name}</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">{product.description}</CardDescription>
              </CardContent>
              <CardFooter className="p-4 flex justify-between items-center">
                <p className="text-xl font-bold text-primary">${product.price.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">Stock: {product.stock}</p>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
