'use client';

import { useState, useEffect } from 'react';
import TipPageView from '@/components/TipPageView';

interface Creator {
  name: string;
  username: string;
  bio: string;
  youtube: string;
  twitter: string;
  walletAddress?: string;
}

interface Tip {
  sender: string;
  address: string;
  amount: number;
  message: string;
  date: string;
}

export default function TipPageClient({ username }: { username: string }) {
  const [creatorInfo, setCreatorInfo] = useState<Creator | null>(null);

  useEffect(() => {
    fetch('/api/profile').then((r) => r.json()).then(setCreatorInfo);
  }, [username]);

  const handleAddTip = async (tip: Tip) => {
    await fetch('/api/tips', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tip),
    });
  };

  if (!creatorInfo) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 32, height: 32, border: '2px solid rgba(10,10,10,0.1)', borderTopColor: '#0a0a0a', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <TipPageView creatorInfo={creatorInfo} onAddTip={handleAddTip} />
    </div>
  );
}
