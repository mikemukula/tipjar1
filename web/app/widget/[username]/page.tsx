'use client';

import { useState, useEffect } from 'react';
import TipPageView from '@/components/TipPageView';
import type { Creator, Tip } from '@/providers/CreatorProvider';

export default function WidgetPage({ params }: { params: { username: string } }) {
  const [creatorInfo, setCreatorInfo] = useState<Creator | null>(null);

  useEffect(() => {
    fetch(`/api/profile?username=${params.username}`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => { if (data) setCreatorInfo(data); });
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
