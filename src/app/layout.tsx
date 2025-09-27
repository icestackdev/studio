import type { Metadata } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import { CartProvider } from '@/contexts/CartProvider';
import { TelegramProvider } from '@/components/TelegramProvider';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'ThreadLine',
  description: 'Exclusive clothing pre-orders on Telegram.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no, user-scalable=no, viewport-fit=cover" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <TelegramProvider>
          <CartProvider>
            <div className="relative max-w-lg mx-auto bg-background min-h-screen flex flex-col">
              <Header />
              <main className="flex-1 pt-24 pb-24 px-4">
                {children}
              </main>
              <BottomNav />
            </div>
            <Toaster />
          </CartProvider>
        </TelegramProvider>
      </body>
    </html>
  );
}
