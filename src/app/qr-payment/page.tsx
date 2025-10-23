
'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

function QRCodeComponent() {
  const searchParams = useSearchParams();
  const amount = searchParams.get('amount') || '0.00';
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);

  useEffect(() => {
    const qrData = JSON.stringify({
      amount: parseFloat(amount),
      currency: 'USD',
      timestamp: new Date().toISOString(),
    });

    const url = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
      qrData
    )}`;
    setQrCodeUrl(url);
  }, [amount]);


  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Pago con QR</CardTitle>
        <CardDescription className="text-center">
          Escanea el código QR para completar el pago.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center gap-4">
        <div className="p-4 bg-white rounded-lg">
          {qrCodeUrl ? (
            <Image
              src={qrCodeUrl}
              alt="Código QR de pago"
              width={300}
              height={300}
              priority
            />
          ) : (
            <Skeleton className="h-[300px] w-[300px] rounded-lg" />
          )}
        </div>
        <p className="text-4xl font-bold">${amount}</p>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <p className="text-sm text-muted-foreground text-center">
          Abre la aplicación de tu banco o billetera digital y escanea el código.
        </p>
        <Button asChild variant="outline" className="w-full">
          <Link href="/">Volver a la Calculadora</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

function QRCodeSkeleton() {
    return (
        <Card className="max-w-md mx-auto">
            <CardHeader>
                <Skeleton className="h-8 w-48 mx-auto" />
                <Skeleton className="h-4 w-64 mx-auto mt-2" />
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center gap-4">
                <Skeleton className="h-[300px] w-[300px] rounded-lg" />
                <Skeleton className="h-12 w-40" />
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-10 w-full" />
            </CardFooter>
        </Card>
    )
}

export default function QrPaymentPage() {
  return (
    <div className="p-4 md:p-8">
      <Suspense fallback={<QRCodeSkeleton />}>
        <QRCodeComponent />
      </Suspense>
    </div>
  );
}
