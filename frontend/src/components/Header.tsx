'use client';

import { useState } from 'react';
import WalletConnectButton from './WalletConnectButton';
import Link from 'next/link';
import { Shield, Menu, X } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/dashboard', label: 'Scanner' },
  { href: '/#pricing', label: 'Pricing' },
  { href: '/about', label: 'About' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 border-b border-white/5 bg-slate-950/70 backdrop-blur">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center space-x-2">
          <div className="rounded-xl border border-white/10 bg-slate-900 p-2">
            <Shield className="h-6 w-6 text-amber-200" />
          </div>
          <span className="text-xl font-bold tracking-tight text-amber-100">SheildGuard</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-gray-400 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <WalletConnectButton />
          </div>
          <button
            type="button"
            aria-label="Toggle navigation"
            className="md:hidden rounded-full border border-white/10 bg-slate-900/60 p-2 text-gray-200 transition hover:border-white/40 hover:text-white"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {menuOpen && (
          <div className="absolute inset-x-4 top-full mt-2 rounded-3xl border border-white/10 bg-slate-950/95 p-6 shadow-2xl md:hidden">
            <div className="space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-base font-semibold text-white"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-white/10">
                <WalletConnectButton />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
