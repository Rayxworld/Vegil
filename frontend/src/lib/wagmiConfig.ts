import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { arbitrum, base, bsc, mainnet, sepolia, bscTestnet } from 'wagmi/chains';

export const wagmiConfig = getDefaultConfig({
  appName: 'AI Security Agent',
  projectId: '407616f49284ce2289920a6544579ff7', // Replace after getting from walletconnect.com
  chains: [mainnet, bsc, base, arbitrum, sepolia, bscTestnet],
  ssr: true,
});
