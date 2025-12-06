import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import AppShell from '@/components/layout/app-shell';
import { Inter } from 'next/font/google';
import { FirebaseClientProvider } from '@/firebase';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'CRM Centro Control Locales',
  description: 'Sistema de gestión avanzado para locales gastronómicos.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-body antialiased`}>
        <FirebaseClientProvider>
          <AppShell>{children}</AppShell>
        </FirebaseClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
