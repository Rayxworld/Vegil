'use client';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function WalletConnectButton() {
  return (
    <div className="flex items-center gap-6">
      <ConnectButton />
    </div>
  );
}