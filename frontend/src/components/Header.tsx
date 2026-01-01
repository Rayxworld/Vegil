'use client';
import WalletConnectButton from './WalletConnectButton';
import Link from 'next/link';
import { Shield } from 'lucide-react';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 border-b border-white/5 bg-slate-950/50 backdrop-blur-xl">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="p-2 bg-cyan-500/10 rounded-xl group-hover:bg-cyan-500/20 transition-colors">
            <Shield className="w-6 h-6 text-cyan-400" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Vigil
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center space-x-8 mr-8">
            <Link href="/" className="text-sm font-medium text-gray-400 hover:text-white transition">Home</Link>
            <Link href="/dashboard" className="text-sm font-medium text-gray-400 hover:text-white transition">Scanner</Link>
            <Link href="/#pricing" className="text-sm font-medium text-gray-400 hover:text-white transition">Pricing</Link>
          </nav>
          <WalletConnectButton />
        </div>
      </div>
    </header>
  );
}