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

export default function WidgetPage({ params }: { params: { username: string } }) {
  const [creatorInfo, setCreatorInfo] = useState<Creator | null>(null);

  useEffect(() => {
    fetch('/api/profile').then((r) => r.json()).then(setCreatorInfo);
  }, [params.username]);

  const handleAddTip = async (tip: Tip) => {
    await fetch('/api/tips', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tip),
    });
  };

  if (!creatorInfo) return null;

  return (
    <div style={{ background: '#050505', minHeight: '100vh', width: '100%' }}>
      <TipPageView creatorInfo={creatorInfo} onAddTip={handleAddTip} isWidget={true} />
    </div>
  );
}
