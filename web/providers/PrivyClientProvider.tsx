'use client';

import { useState, useEffect } from 'react';
import { PrivyProvider } from '@privy-io/react-auth';
import { WagmiProvider, createConfig } from '@privy-io/wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http } from 'viem';
import { defineChain } from 'viem';

const celo = defineChain({
  id: 42220,
  name: 'Celo',
  nativeCurrency: { decimals: 18, name: 'CELO', symbol: 'CELO' },
  rpcUrls: { default: { http: ['https://forno.celo.org'] } },
  blockExplorers: { default: { name: 'Celoscan', url: 'https://celoscan.io' } },
});

const wagmiConfig = createConfig({
  chains: [celo],
  transports: { [celo.id]: http() },
});

const queryClient = new QueryClient();

export default function PrivyClientProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;

  if (!mounted || !appId || appId === 'your-privy-app-id-here') {
    return <>{children}</>;
  }

  return (
    <PrivyProvider
      appId={appId}
      config={{
        appearance: { theme: 'light', accentColor: '#0a0a0a' },
        loginMethods: ['wallet', 'email'],
        defaultChain: celo,
        supportedChains: [celo],
        embeddedWallets: {
          ethereum: { createOnLogin: 'users-without-wallets' },
        },
      }}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={wagmiConfig} reconnectOnMount={false}>
          {children}
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
}
