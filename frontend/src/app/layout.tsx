'use client';
import './globals.css';
import { Providers } from './providers';
import Header from '@/components/Header';

export default function RootLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <Header />
          <main className="container mx-auto p-8">{children}</main>
        </Providers>
      </body>
    </html>
  );
}