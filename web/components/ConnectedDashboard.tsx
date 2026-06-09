'use client';

import { useRegisterCreator, useIsRegistered } from '@/hooks/useRegisterCreator';
import DashboardView from './DashboardView';
import TipPageView from './TipPageView';

interface Creator {
  name: string;
  username: string;
  bio: string;
  youtube: string;
  twitter: string;
  wallet_address?: string;
}

interface Tip {
  id?: string;
  creator_username: string;
  sender_name: string;
  sender_address: string;
  amount: number;
  message: string;
  tx_hash?: string | null;
  created_at?: string;
}

interface Props {
  creatorInfo: Creator;
  setCreatorInfo: (info: Creator) => void;
  tips: Tip[];
  currentView: string;
  walletAddress: `0x${string}` | '';
  onAddTip: (tip: Tip) => Promise<void>;
  onSaveProfile: (
    profile: Creator,
    opts: {
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

  if (currentView === 'dashboard') {
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

  if (currentView === 'preview') {
    return (
      <div className="preview-container">
        <div className="preview-banner">
          <span className="tag-mono">Preview Mode</span>
          <h2>Tipping Page Live Preview</h2>
          <p>This is what your fans see. Try the tipping flow to see updates in your dashboard ledger!</p>
        </div>
        <TipPageView creatorInfo={creatorInfo} onAddTip={onAddTip} />
        <style>{`
          .preview-container { display: flex; flex-direction: column; align-items: center; gap: 24px; }
          .preview-banner { text-align: center; max-width: 600px; margin-bottom: 8px; }
          .preview-banner h2 { font-family: var(--font-mono); font-size: 1.75rem; margin-top: 4px; }
          .preview-banner p { font-size: 0.9rem; color: var(--text-secondary); margin-top: 8px; }
        `}</style>
      </div>
    );
  }

  return null;
}
