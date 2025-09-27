import type { Metadata } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import { CartProvider } from '@/contexts/CartProvider';
import { TelegramProvider } from '@/components/TelegramProvider';

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
            {children}
            <Toaster />
          </CartProvider>
        </TelegramProvider>
      </body>
    </html>
  );
}
