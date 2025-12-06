'use client';
import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { PlusCircle, MinusCircle, ShoppingCart } from 'lucide-react';
import type { MenuItem, CartItem, Order } from '@/lib/definitions';
import { useFirestore, useMemoFirebase } from '@/firebase';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { collection, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { localMenuItems } from '@/lib/menu-data';

interface OrderFormProps {
  tableNumber: number;
  onOrderAdded: (order: Omit<Order, 'id' | 'createdAt'>) => void;
}

export function OrderForm({ tableNumber, onOrderAdded }: OrderFormProps) {
  const firestore = useFirestore();
  const { toast } = useToast();

  const ordersCollection = useMemoFirebase(
    () => (firestore ? collection(firestore, 'orders') : null),
    [firestore]
  );

  const availableItems = localMenuItems.filter((item) => item.isAvailable);
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (item: MenuItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (cartItem) => cartItem.id === item.id
      );
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [
        ...prevCart,
        {
          id: item.id!,
          name: item.name,
          price: item.price,
          quantity: 1,
        },
      ];
    });
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
    } else {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmitOrder = async () => {
    if (cart.length === 0) {
      toast({
        title: 'Error',
        description: 'Añada productos al carrito para crear un pedido.',
        variant: 'destructive',
      });
      return;
    }

    const orderDataForFirestore = {
      tableNumber: tableNumber,
      items: cart.map(({ id, ...rest }) => ({ menuItemId: id, ...rest })),
      status: 'Pending' as const,
      createdAt: serverTimestamp(),
    };
    
    // Still send to Firestore for persistence
    if (ordersCollection) {
        addDocumentNonBlocking(ordersCollection, orderDataForFirestore);
    }

    // Also update the parent component's local state
    const orderDataForState: Omit<Order, 'id' | 'createdAt'> = {
        tableNumber: tableNumber,
        items: cart.map(({ id, ...rest }) => ({ menuItemId: id, ...rest })),
        status: 'Pending' as const,
    };
    onOrderAdded(orderDataForState);


    toast({
      title: 'Pedido Creado',
      description: `El pedido para la mesa ${tableNumber} ha sido enviado a la cocina.`,
    });

    setCart([]);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nuevo Pedido (Mesa {tableNumber})</CardTitle>
        <CardDescription>Añada productos al pedido de la mesa.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Menú</Label>
          <div className="grid grid-cols-2 gap-2">
            {availableItems.map((item) => (
              <Button
                key={item.id}
                variant="outline"
                size="sm"
                onClick={() => addToCart(item)}
              >
                {item.name}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium text-lg flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Carrito
          </h4>
          {cart.length > 0 ? (
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <MinusCircle className="h-4 w-4" />
                    </Button>
                    <span className="font-bold w-4 text-center">
                      {item.quantity}
                    </span>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <PlusCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              El carrito está vacío.
            </p>
          )}
        </div>
      </CardContent>
      {cart.length > 0 && (
        <CardFooter className="flex flex-col gap-4">
          <div className="flex justify-between font-bold text-xl w-full">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <Button
            className="w-full"
            onClick={handleSubmitOrder}
          >
            Crear Pedido
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
