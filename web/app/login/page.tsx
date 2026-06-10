'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';

export default function LoginPage() {
  const { ready, authenticated, login } = usePrivy();
  const router = useRouter();

  useEffect(() => {
    if (ready && authenticated) router.replace('/dashboard');
  }, [ready, authenticated, router]);

  if (!ready) return null;

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-sm animate-fade-up rounded-2xl border border-line bg-card p-8 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-accent font-mono text-lg font-bold text-accent-foreground">
          G$
        </div>
        <h1 className="mt-5 font-display text-2xl font-bold tracking-tight">Tip Jar</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Sign in to manage your creator profile and receive G$ tips on Celo.
        </p>
        <button
          onClick={login}
          className="mt-6 h-11 w-full rounded-xl bg-primary text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
        >
          Connect & sign in
        </button>
        <p className="mt-5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground/60">
          Powered by GoodDollar on Celo
        </p>
      </div>
    </div>
  );
}
