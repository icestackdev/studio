'use client';

import { useEffect } from 'react';

export function TelegramProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const scriptId = 'telegram-web-app-script';
    if (document.getElementById(scriptId)) {
        return;
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = 'https://telegram.org/js/telegram-web-app.js';
    script.async = true;

    document.body.appendChild(script);

    return () => {
      const el = document.getElementById(scriptId);
      if (el) {
        document.body.removeChild(el);
      }
    };
  }, []);

  return <>{children}</>;
};
