import { mainnet } from 'wagmi/chains';

// We are transitioning to Solana. EVM chains are being decommissioned.
export const supportedChains = [] as const;

export const chainNames: Record<number, string> = {
  // Solana transition in progress
};
