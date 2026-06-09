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
      <div className="loading-screen">
        <div className="spinner" />
        <style>{`
          .loading-screen { min-height:100vh; display:flex; align-items:center; justify-content:center; }
          .spinner { width:32px; height:32px; border:2px solid rgba(10,10,10,0.1); border-top-color:#0a0a0a; border-radius:50%; animation:spin 0.8s linear infinite; }
          @keyframes spin { to { transform:rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  if (!authenticated) return null;

  return <>{children}</>;
}

function ProtectedShell({ children }: { children: React.ReactNode }) {
  const { creator, walletAddress } = useCreator();

  return (
    <div className="app-container">
      <Sidebar creatorInfo={creator} walletAddress={walletAddress} />
      <Navbar username={creator.username} walletAddress={walletAddress || undefined} />
      <main className="main-content">
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
