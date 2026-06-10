'use client';

import dynamic from 'next/dynamic';

const PreviewClient = dynamic(() => import('@/components/PreviewClient'), { ssr: false });

export default function PreviewPage() {
  return <PreviewClient />;
}
