import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { ThemeToggle } from '@/components/theme-toggle';

import { Providers } from './providers';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Poker Chip Tracker',
  description: 'Track poker chips and manage games in real-time',
  icons: {
    icon: '/logo.png',
  },
};

export default function RootLayout({ children }: { children: Readonly<React.ReactNode> }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className}>
        <div className="flex min-h-screen flex-col">
          <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center justify-between">
              <div className="flex items-center space-x-2"></div>
              <ThemeToggle />
            </div>
          </header>

          <main className="w-full flex-1">
            <div className="container mx-auto py-3 sm:px-6 lg:px-8">
              <Providers>{children}</Providers>
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
