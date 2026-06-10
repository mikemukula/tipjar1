'use client';

import { useRegisterCreator, useIsRegistered } from '@/hooks/useRegisterCreator';
import { useGDollarBalance } from '@/hooks/useGDollarBalance';
import DashboardView from './DashboardView';
import TipPageView from './TipPageView';
import type { Creator, Tip } from '@/providers/CreatorProvider';

interface Props {
  creatorInfo: Creator;
  setCreatorInfo: (info: Creator) => void;
  tips: Tip[];
  currentView: 'dashboard' | 'preview';
  walletAddress: `0x${string}` | '';
  onAddTip: (tip: Tip) => Promise<void>;
  onSaveProfile: (
    profile: Creator,
    opts?: {
      isOnChain: boolean;
      registerCreator: (u: string) => Promise<boolean>;
      updateUsername: (u: string) => Promise<boolean>;
    }
  ) => Promise<void>;
}

export default function ConnectedDashboard({
  creatorInfo,
  setCreatorInfo,
  tips,
  currentView,
  walletAddress,
  onAddTip,
  onSaveProfile,
}: Props) {
  const { registerCreator, updateUsername, status: regStatus, error: regError } =
    useRegisterCreator(walletAddress || undefined);
  const { data: isOnChain } = useIsRegistered(walletAddress || undefined);
  const { balance: gBalance, isLoading: balanceLoading } = useGDollarBalance(walletAddress || undefined);

  const handleSave = (profile: Creator) =>
    onSaveProfile(profile, {
      isOnChain: !!isOnChain,
      registerCreator,
      updateUsername,
    });

  if (currentView === 'preview') {
    return (
      <div className="flex animate-fade-up flex-col items-center gap-6">
        <div className="max-w-md text-center">
          <span className="rounded-full border border-line bg-card px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Preview
          </span>
          <h2 className="mt-3 font-display text-2xl font-bold tracking-tight">Your public tip page</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            This is exactly what fans see when they visit your link.
          </p>
        </div>
        <TipPageView creatorInfo={creatorInfo} onAddTip={onAddTip} />
      </div>
    );
  }

  return (
    <DashboardView
      creatorInfo={creatorInfo}
      setCreatorInfo={setCreatorInfo}
      tips={tips}
      onSaveProfile={handleSave}
      isOnChain={!!isOnChain}
      regStatus={regStatus}
      regError={regError}
      gBalance={gBalance}
      balanceLoading={balanceLoading}
    />
  );
}
