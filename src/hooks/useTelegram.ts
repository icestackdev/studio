"use client";

import { useState, useEffect } from 'react';

// Define the types for the Telegram WebApp object
// This is not exhaustive but covers what we need.
interface TelegramWebApp {
  initData: string;
  initDataUnsafe: {
    query_id: string;
    user?: {
      id: number;
      first_name: string;
      last_name?: string;
      username?: string;
      language_code: string;
    };
    // ... and other fields
  };
  isExpanded: boolean;
  viewportHeight: number;
  // ... and other methods/properties
}

interface WindowWithTelegram extends Window {
  Telegram?: {
    WebApp: TelegramWebApp;
  };
}

export function useTelegram() {
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null);

  useEffect(() => {
    // This code runs only on the client side
    const tgWindow = window as WindowWithTelegram;
    if (tgWindow.Telegram && tgWindow.Telegram.WebApp) {
      setWebApp(tgWindow.Telegram.WebApp);
    }
  }, []);

  return webApp;
}
