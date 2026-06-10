'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { CreatorProvider, useCreator } from '@/providers/CreatorProvider';

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { ready, authenticated, login } = usePrivy();
  const router = useRouter();

  // Redirect to login page if not authenticated after Privy is ready
  useEffect(() => {
    if (ready && !authenticated) {
      router.replace('/login');
    }
  }, [ready, authenticated, router]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-foreground" />
      </div>
    );
  }

  if (!authenticated) return null;

  return <>{children}</>;
}

function ProtectedShell({ children }: { children: React.ReactNode }) {
  const { creator, walletAddress } = useCreator();

  return (
    <div className="min-h-screen">
      <Sidebar creatorInfo={creator} walletAddress={walletAddress} />
      <Navbar username={creator.username} walletAddress={walletAddress || undefined} />
      <main className="ml-60 min-h-screen px-8 pt-22 pb-10 max-md:ml-0 max-md:px-4 max-md:pt-20 max-md:pb-24">
        {children}
      </main>
    </div>
  );
}

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <CreatorProvider>
        <ProtectedShell>{children}</ProtectedShell>
      </CreatorProvider>
    </AuthGuard>
  );
}
