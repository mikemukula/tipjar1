'use client';

import { useRegisterCreator, useIsRegistered } from '@/hooks/useRegisterCreator';
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

  const handleSave = (profile: Creator) =>
    onSaveProfile(profile, {
      isOnChain: !!isOnChain,
      registerCreator,
      updateUsername,
    });

  if (currentView === 'preview') {
    return (
      <div className="preview-container">
        <div className="preview-banner">
          <span className="tag-mono">Preview Mode</span>
          <h2>Your Public Tip Page</h2>
          <p>This is exactly what fans see when they visit your tipping link.</p>
        </div>
        <TipPageView creatorInfo={creatorInfo} onAddTip={onAddTip} />
        <style>{`
          .preview-container { display: flex; flex-direction: column; align-items: center; gap: 20px; }
          .preview-banner { text-align: center; max-width: 560px; }
          .preview-banner h2 { font-family: var(--font-mono); font-size: 1.6rem; margin-top: 6px; }
          .preview-banner p { font-size: 0.875rem; color: var(--text-secondary); margin-top: 6px; }
        `}</style>
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
    />
  );
}
