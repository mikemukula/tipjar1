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
    <div className="login-screen">
      <div className="login-card glass-card">
        <div className="login-brand">
          <span className="brand-symbol">G$</span>
          <span className="brand-text">TIP JAR</span>
        </div>
        <h1 className="login-title">Creator Dashboard</h1>
        <p className="login-desc">
          Sign in with your wallet or email to manage your tipping profile and receive G$ on Celo.
        </p>
        <button onClick={login} className="btn-primary login-btn">
          Connect & Sign In
        </button>
        <p className="login-footer">Powered by GoodDollar on Celo</p>
      </div>

      <style>{`
        .login-screen { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px; }
        .login-card { max-width: 420px; width: 100%; text-align: center; padding: 48px 40px; display: flex; flex-direction: column; align-items: center; gap: 16px; }
        .login-brand { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
        .brand-symbol { font-family: var(--font-mono); font-weight: 700; font-size: 1.4rem; background: var(--text-primary); color: #fff; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border-radius: 8px; }
        .brand-text { font-family: var(--font-mono); font-weight: 600; letter-spacing: 0.14em; font-size: 1.2rem; text-transform: uppercase; }
        .login-title { font-family: var(--font-mono); font-size: 1.75rem; font-weight: 700; margin-bottom: 4px; }
        .login-desc { font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6; max-width: 320px; margin: 0; }
        .login-btn { width: 100%; padding: 14px; font-size: 1rem; margin-top: 8px; }
        .login-footer { font-family: var(--font-mono); font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.12em; color: var(--text-muted); opacity: 0.5; margin-top: 4px; }
      `}</style>
    </div>
  );
}
