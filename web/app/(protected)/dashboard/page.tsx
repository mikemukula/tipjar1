'use client';

import dynamic from 'next/dynamic';

const DashboardHome = dynamic(() => import('@/components/DashboardHome'), { ssr: false });

export default function DashboardPage() {
  return <DashboardHome />;
}
