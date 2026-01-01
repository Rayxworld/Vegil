'use client';
import { useSwitchChain } from 'wagmi';
import { supportedChains, chainNames } from '../lib/chains';

export default function ChainSelector() {
  const { switchChain } = useSwitchChain();

  return (
    <select
      onChange={(e) => switchChain?.({ chainId: Number(e.target.value) })}
      className="px-4 py-2 rounded bg-gray-800 text-white"
    >
      <option value="">Switch Chain</option>
      {supportedChains.map((chain) => (
        <option key={chain.id} value={chain.id}>
          {chainNames[chain.id]}
        </option>
      ))}
    </select>
  );
}