'use client';

import { useState } from 'react';
import { useWalletClient, usePublicClient, useReadContract } from 'wagmi';
import { TIPJAR_REGISTRY_ADDRESS, TIPJAR_REGISTRY_ABI } from '@/lib/contracts';

export type RegistrationStatus = 'idle' | 'pending' | 'success' | 'error';

interface UseRegisterCreatorResult {
  registerCreator: (username: string) => Promise<boolean>;
  updateUsername: (newUsername: string) => Promise<boolean>;
  status: RegistrationStatus;
  error: string | null;
  reset: () => void;
}

export function useRegisterCreator(walletAddress?: `0x${string}`): UseRegisterCreatorResult {
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

  const [status, setStatus] = useState<RegistrationStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const reset = () => { setStatus('idle'); setError(null); };

  const register = async (
    functionName: 'registerCreator' | 'updateUsername',
    username: string,
  ): Promise<boolean> => {
    if (!walletClient || !publicClient) {
      setError('Wallet not connected');
      setStatus('error');
      return false;
    }
    try {
      setStatus('pending');
      const tx = await walletClient.writeContract({
        address: TIPJAR_REGISTRY_ADDRESS,
        abi: TIPJAR_REGISTRY_ABI,
        functionName,
        args: [username],
      });
      await publicClient.waitForTransactionReceipt({ hash: tx });
      setStatus('success');
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Transaction failed';
      const friendly = msg.includes('User rejected')
        ? 'Transaction rejected'
        : msg.includes('UsernameAlreadyTaken')
        ? 'That username is already taken'
        : msg.includes('WalletAlreadyRegistered')
        ? 'Your wallet is already registered'
        : 'Registration failed — please try again';
      setError(friendly);
      setStatus('error');
      return false;
    }
  };

  return {
    registerCreator: (u) => register('registerCreator', u),
    updateUsername:  (u) => register('updateUsername', u),
    status,
    error,
    reset,
  };
}

// Read-only hook — check if a wallet is already registered on-chain
export function useIsRegistered(walletAddress?: `0x${string}`) {
  return useReadContract({
    address: TIPJAR_REGISTRY_ADDRESS,
    abi: TIPJAR_REGISTRY_ABI,
    functionName: 'isRegistered',
    args: walletAddress ? [walletAddress] : undefined,
    query: { enabled: !!walletAddress },
  });
}

// Read-only hook — get on-chain username for a wallet
export function useOnChainUsername(walletAddress?: `0x${string}`) {
  return useReadContract({
    address: TIPJAR_REGISTRY_ADDRESS,
    abi: TIPJAR_REGISTRY_ABI,
    functionName: 'getUsernameByWallet',
    args: walletAddress ? [walletAddress] : undefined,
    query: { enabled: !!walletAddress },
  });
}
