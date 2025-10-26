"use client";

import { useEffect } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { logger } from "@/lib/logger";

type ProvidersProps = {
  children: React.ReactNode;
};

export const Providers = ({ children }: Readonly<ProvidersProps>) => {
  useEffect(() => {
    const onError = (event: ErrorEvent) => {
      logger.error(
        {
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          error: event.error?.stack ?? String(event.error),
        },
        "Global error"
      );
    };

    const onRejection = (event: PromiseRejectionEvent) => {
      logger.error(
        { reason: String(event.reason) },
        "Unhandled promise rejection"
      );
    };

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);

    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);

  return (
    <ThemeProvider>
      <TooltipProvider delayDuration={200}>
        {children}
        <Toaster closeButton position="bottom-left" />
      </TooltipProvider>
    </ThemeProvider>
  );
};
