'use client';

import TipPageView from './TipPageView';
import { useCreator } from '@/providers/CreatorProvider';

export default function PreviewClient() {
  const { creator, addTip } = useCreator();

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
      <TipPageView creatorInfo={creator} onAddTip={addTip} />
    </div>
  );
}
