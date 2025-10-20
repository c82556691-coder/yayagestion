'use client';

import { useState, useMemo } from 'react';
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
import { orders as initialOrders, PlaceHolderImages } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Edit, PlusCircle, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Product, Customer } from '@/lib/definitions';
import { ProductForm } from '@/components/product-form';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import {
  addDocumentNonBlocking,
  deleteDocumentNonBlocking,
  setDocumentNonBlocking,
} from '@/firebase/non-blocking-updates';
import { collection, doc } from 'firebase/firestore';

const statusVariant: {
  [key: string]: 'default' | 'secondary' | 'destructive' | 'outline';
} = {
  Pending: 'outline',
  Shipped: 'secondary',
  Delivered: 'default',
  Cancelled: 'destructive',
};

export default function DatabasePage() {
  const firestore = useFirestore();
  const productsCollection = useMemoFirebase(
    () => (firestore ? collection(firestore, 'products') : null),
    [firestore]
  );
  const customersCollection = useMemoFirebase(
    () => (firestore ? collection(firestore, 'customers') : null),
    [firestore]
  );

  const { data: products = [], isLoading: productsLoading } =
    useCollection<Product>(productsCollection);
  const { data: customers = [], isLoading: customersLoading } =
    useCollection<Customer>(customersCollection);

  const [orders, setOrders] = useState(initialOrders);

  const [isCustomerDialogOpen, setIsCustomerDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Partial<Customer> | null>(null);

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

  const handleSaveCustomer = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingCustomer || !customersCollection) return;

    if (editingCustomer.id) {
      const customerRef = doc(customersCollection, editingCustomer.id);
      const { id, ...customerData } = editingCustomer;
      setDocumentNonBlocking(customerRef, customerData, { merge: true });
    } else {
      addDocumentNonBlocking(customersCollection, {
        ...editingCustomer,
        imageId: `customer${(customers.length % 5) + 1}`,
      });
    }
    setIsCustomerDialogOpen(false);
    setEditingCustomer(null);
  };

  const handleDeleteCustomer = (customerId: string) => {
    if (!customersCollection) return;
    const customerRef = doc(customersCollection, customerId);
    deleteDocumentNonBlocking(customerRef);
  };

  return (
    <div className="p-4 md:p-8">
      <h2 className="text-3xl font-bold tracking-tight mb-6">
        Gestión de Base de Datos
      </h2>
      <Tabs defaultValue="products">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="products">Productos</TabsTrigger>
          <TabsTrigger value="customers">Clientes</TabsTrigger>
          <TabsTrigger value="orders">Pedidos</TabsTrigger>
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
                    <TableHead>Stock</TableHead>
                    <TableHead className="text-right">Precio</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productsLoading ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">
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
                                <p className="text-sm text-muted-foreground">
                                  {product.description}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{product.stock}</TableCell>
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
        <TabsContent value="customers">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Clientes</CardTitle>
                  <CardDescription>
                    Una lista de todos los clientes.
                  </CardDescription>
                </div>
                <Button
                  onClick={() => {
                    setEditingCustomer({ name: '', email: '', imageId: '' });
                    setIsCustomerDialogOpen(true);
                  }}
                >
                  <PlusCircle className="mr-2 h-4 w-4" /> Añadir Cliente
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customersLoading ? (
                     <TableRow>
                        <TableCell colSpan={3} className="text-center">
                            Cargando clientes...
                        </TableCell>
                    </TableRow>
                  ) : (
                    customers.map((customer) => {
                        const image = PlaceHolderImages.find(
                        (p) => p.id === customer.imageId
                        );
                        return (
                        <TableRow key={customer.id}>
                            <TableCell>
                            <div className="flex items-center gap-3">
                                <Avatar>
                                <AvatarImage
                                    src={image?.imageUrl}
                                    alt={customer.name}
                                    data-ai-hint={image?.imageHint}
                                />
                                <AvatarFallback>
                                    {customer.name.charAt(0)}
                                </AvatarFallback>
                                </Avatar>
                                <span className="font-medium">{customer.name}</span>
                            </div>
                            </TableCell>
                            <TableCell>{customer.email}</TableCell>
                            <TableCell className="text-right">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                setEditingCustomer(customer);
                                setIsCustomerDialogOpen(true);
                                }}
                            >
                                <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteCustomer(customer.id!)}
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
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Pedidos</CardTitle>
              <CardDescription>
                Una lista de todos los pedidos de ventas.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID Pedido</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.customer.name}</TableCell>
                      <TableCell>{order.orderDate}</TableCell>
                      <TableCell>
                        <Badge variant={statusVariant[order.status]}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        ${order.total.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
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

      <Dialog
        open={isCustomerDialogOpen}
        onOpenChange={(isOpen) => {
          if (!isOpen) setEditingCustomer(null);
          setIsCustomerDialogOpen(isOpen);
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingCustomer?.id ? 'Editar Cliente' : 'Añadir Nuevo Cliente'}
            </DialogTitle>
          </DialogHeader>
          {editingCustomer && (
            <form onSubmit={handleSaveCustomer}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Nombre
                  </Label>
                  <Input
                    id="name"
                    value={editingCustomer.name}
                    onChange={(e) =>
                      setEditingCustomer({
                        ...editingCustomer,
                        name: e.target.value,
                      })
                    }
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={editingCustomer.email}
                    onChange={(e) =>
                      setEditingCustomer({
                        ...editingCustomer,
                        email: e.target.value,
                      })
                    }
                    className="col-span-3"
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="secondary">
                    Cancelar
                  </Button>
                </DialogClose>
                <Button type="submit">Guardar Cambios</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
