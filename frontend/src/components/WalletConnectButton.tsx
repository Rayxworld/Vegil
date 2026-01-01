'use client';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import ChainSelector from './ChainSelector';

export default function WalletConnectButton() {
  return (
    <div className="flex items-center gap-6">
      <ChainSelector />
      <ConnectButton />
    </div>
  );
}