import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Poker Chip Tracker',
  description: 'Track poker chips and manage games in real-time',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className}>
        <div className="flex min-h-screen flex-col">
          <main className="w-full flex-1 bg-background/85">
            <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
              <Providers>{children}</Providers>
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
