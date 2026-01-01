'use client';

import { useAccount, useWriteContract } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Crown, Zap } from 'lucide-react';

// Pricing data
const PRICING = {
  PREMIUM_TIER: "12.00",
  NETWORK_FEE: "0.45",
  TOTAL: "12.45"
};

export default function SubscribeButton() {
  const { isConnected } = useAccount();

  const handleSubscribe = async () => {
    alert(`Initializing Web3 Stream... 
Transaction Hash: 0x${Math.random().toString(16).slice(2, 42)}
Subscribing for $${PRICING.TOTAL} / month. 
Please confirm in your wallet.`);
  };

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center gap-4">
        <ConnectButton label="Connect to Subscribe" />
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-3 w-full animate-in fade-in slide-in-from-bottom-2">
      <button
        onClick={handleSubscribe}
        className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-black py-5 rounded-2xl flex items-center justify-center gap-3 transition-transform active:scale-95 shadow-[0_0_30px_rgba(234,179,8,0.3)] group"
      >
        <Crown className="w-5 h-5 group-hover:rotate-12 transition-transform" />
        Upgrade to Sentinel (${PRICING.TOTAL}/mo)
      </button>
      <div className="flex items-center justify-center gap-4 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
        <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-yellow-500" /> Instant Activation</span>
        <span>Cancel Anytime</span>
      </div>
    </div>
  );
}