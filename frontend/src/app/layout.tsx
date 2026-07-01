'use client';
import './globals.css';
import { Providers } from './providers';
import Header from '@/components/Header';

export default function RootLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* ADD THESE TWO LINES BELOW */}
      <head>
        <meta name="ory-verify" content="orynth-4653f87d4dc34ca599e16523bccb4463" />
      </head>
      
      <body>
        <Providers>
          <Header />
          <main className="container mx-auto p-8">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
