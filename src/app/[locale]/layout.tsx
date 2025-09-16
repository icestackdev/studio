
import type { Metadata } from 'next';
import '../globals.css';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import { CartProvider } from '@/contexts/CartProvider';
import { TelegramProvider } from '@/components/TelegramProvider';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { NextIntlClientProvider, useMessages } from 'next-intl';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'ThreadLine',
  description: 'Exclusive clothing pre-orders on Telegram.',
};

export default function LocaleLayout({
  children,
  params: { locale }
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const messages = useMessages();
  
  return (
    <html lang={locale}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no, user-scalable=no, viewport-fit=cover" />
      </head>
      <body className={`${inter.variable} font-body antialiased`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <TelegramProvider>
            <CartProvider>
                <div className="relative max-w-lg mx-auto bg-background min-h-screen flex flex-col">
                  <Header />
                  <main className="flex-1 pt-20 pb-20 px-4">
                      {children}
                  </main>
                  <BottomNav />
                </div>
                <Toaster />
            </CartProvider>
          </TelegramProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
