'use client';

import { ThemeProvider } from '@/components/theme-provider';

import { Toaster } from '@/components/ui/sonner';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: Readonly<ProvidersProps>) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      {children}
      <Toaster closeButton position="bottom-left" />
    </ThemeProvider>
  );
}
