'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { usePrivy } from '@privy-io/react-auth';

export interface Creator {
  id?: string;
  username: string;
  wallet_address: string;
  name: string;
  bio: string;
  youtube: string;
  twitter: string;
  avatar_url?: string;
}

export interface Tip {
  id?: string;
  creator_username: string;
  sender_name: string;
  sender_address: string;
  amount: number;
  message: string;
  tx_hash?: string | null;
  created_at?: string;
}

interface CreatorContextValue {
  creator: Creator;
  tips: Tip[];
  isLoading: boolean;
  walletAddress: `0x${string}` | '';
  setCreator: (c: Creator) => void;
  setTips: (t: Tip[]) => void;
  refreshTips: () => Promise<void>;
  saveProfile: (
    updated: Creator,
    opts?: {
      isOnChain: boolean;
      registerCreator: (u: string) => Promise<boolean>;
      updateUsername: (u: string) => Promise<boolean>;
    }
  ) => Promise<void>;
  addTip: (tip: Tip) => Promise<void>;
}

const CreatorContext = createContext<CreatorContextValue | null>(null);

export function CreatorProvider({ children }: { children: ReactNode }) {
  const { user } = usePrivy();

  const walletAccount = user?.linkedAccounts?.find((a) => a.type === 'wallet');
  const walletAddress = ((walletAccount as { address?: string })?.address ?? '') as `0x${string}` | '';

  const [creator, setCreator] = useState<Creator>({
    username: '', wallet_address: '', name: '', bio: '', youtube: '', twitter: '',
  });
  const [tips, setTips] = useState<Tip[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load profile once wallet is known
  useEffect(() => {
    if (!walletAddress) { setIsLoading(false); return; }
    (async () => {
      try {
        const res = await fetch(`/api/profile?wallet=${walletAddress}`);
        if (res.ok) {
          const profile = await res.json();
          setCreator(profile);
          const tipsRes = await fetch(`/api/tips?username=${profile.username}`);
          if (tipsRes.ok) setTips(await tipsRes.json());
        } else {
          setCreator((prev) => ({ ...prev, wallet_address: walletAddress }));
        }
      } finally {
        setIsLoading(false);
      }
    })();
  }, [walletAddress]);

  const refreshTips = async () => {
    if (!creator.username) return;
    const res = await fetch(`/api/tips?username=${creator.username}`);
    if (res.ok) setTips(await res.json());
  };

  const saveProfile = async (
    updated: Creator,
    opts?: {
      isOnChain: boolean;
      registerCreator: (u: string) => Promise<boolean>;
      updateUsername: (u: string) => Promise<boolean>;
    }
  ) => {
    const address = walletAddress || updated.wallet_address || '';

    if (updated.username && opts) {
      if (!opts.isOnChain) {
        const ok = await opts.registerCreator(updated.username);
        if (!ok) return;
      } else if (updated.username !== creator.username && creator.username) {
        const ok = await opts.updateUsername(updated.username);
        if (!ok) return;
      }
    }

    const res = await fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...updated, wallet_address: address }),
    });
    const data = await res.json();
    if (data.success) {
      setCreator(data.profile);
      const tipsRes = await fetch(`/api/tips?username=${data.profile.username}`);
      if (tipsRes.ok) setTips(await tipsRes.json());
    }
  };

  const addTip = async (newTip: Tip) => {
    const res = await fetch('/api/tips', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTip),
    });
    const data = await res.json();
    if (data.success) setTips((prev) => [data.tip, ...prev]);
    else setTips((prev) => [newTip, ...prev]);
  };

  return (
    <CreatorContext.Provider value={{
      creator, tips, isLoading, walletAddress,
      setCreator, setTips, refreshTips,
      saveProfile, addTip,
    }}>
      {children}
    </CreatorContext.Provider>
  );
}

export function useCreator() {
  const ctx = useContext(CreatorContext);
  if (!ctx) throw new Error('useCreator must be used inside CreatorProvider');
  return ctx;
}
