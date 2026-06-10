'use client';

import dynamic from 'next/dynamic';
import { useCreator } from '@/providers/CreatorProvider';

const ConnectedDashboard = dynamic(() => import('@/components/ConnectedDashboard'), { ssr: false });

export default function PreviewPage() {
  const { creator, setCreator, tips, walletAddress, saveProfile, addTip } = useCreator();

  return (
    <ConnectedDashboard
      creatorInfo={creator}
      setCreatorInfo={setCreator}
      tips={tips}
      currentView="preview"
      walletAddress={walletAddress}
      onAddTip={addTip}
      onSaveProfile={saveProfile}
    />
  );
}
