import { arbitrum, base, bsc, mainnet, sepolia, bscTestnet } from 'wagmi/chains';

export const supportedChains = [mainnet, bsc, base, arbitrum, sepolia, bscTestnet] as const;

export const chainNames: Record<number, string> = {
  [mainnet.id]: 'Ethereum',
  [bsc.id]: 'BSC',
  [base.id]: 'Base',
  [arbitrum.id]: 'Arbitrum',
  [sepolia.id]: 'Sepolia (Testnet)',
  [bscTestnet.id]: 'BSC Testnet',
};
