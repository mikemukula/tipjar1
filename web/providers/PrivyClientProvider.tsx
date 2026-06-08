'use client';

import { useState, useEffect } from 'react';
import { PrivyProvider } from '@privy-io/react-auth';

const celo = {
  id: 42220,
  name: 'Celo',
  nativeCurrency: { decimals: 18, name: 'CELO', symbol: 'CELO' },
  rpcUrls: { default: { http: ['https://forno.celo.org'] } },
  blockExplorers: { default: { name: 'Celoscan', url: 'https://celoscan.io' } },
} as const;

export default function PrivyClientProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;

  // Render children without Privy if no valid app ID is set yet
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
      {children}
    </PrivyProvider>
  );
}
