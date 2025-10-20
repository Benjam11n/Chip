'use client';

import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';

interface ProvidersProps {
  children: React.ReactNode;
}

export const Providers = ({ children }: Readonly<ProvidersProps>) => {
  return (
    <ThemeProvider>
      {children}
      <Toaster closeButton position="bottom-left" />
    </ThemeProvider>
  );
}
