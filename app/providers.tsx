"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

type ProvidersProps = {
  children: React.ReactNode;
};

export const Providers = ({ children }: Readonly<ProvidersProps>) => (
  <ThemeProvider>
    {children}
    <Toaster closeButton position="bottom-left" />
  </ThemeProvider>
);
