'use client';
import './globals.css';
import { Providers } from './providers';
import Header from '@/components/Header';

export default function RootLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* 1. This handles the domain verification in the background */}
        <meta name="ory-verify" content="orynth-4653f87d4dc34ca599e16523bccb4463" />
      </head>
      
      <body>
        <Providers>
          <Header />
          <main className="container mx-auto p-8">
            {children}
            
            {/* 2. This displays the badge layout at the bottom of your pages */}
            <div className="mt-8 flex justify-center">
              <a href="https://orynth.dev/projects/shieldguard-ai" target="_blank" rel="noopener">
                <img src="https://orynth.dev/api/badge/shieldguard-ai?theme=light&style=default" alt="Featured on Orynth" width="260" height="80" />
              </a>
            </div>
          </main>
        </Providers>
      </body>
    </html>
  );
}
