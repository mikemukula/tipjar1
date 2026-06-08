'use client';

import { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import Sidebar from '@/components/Sidebar';
import DashboardView from '@/components/DashboardView';
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

export default function Home() {
  const { ready, authenticated, login, user } = usePrivy();

  const [creatorInfo, setCreatorInfo] = useState<Creator>({
    name: '', username: '', bio: '', youtube: '', twitter: '', walletAddress: '',
  });
  const [mockTips, setMockTips] = useState<Tip[]>([]);
  const [currentView, setCurrentView] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch profile + tips on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, tipsRes] = await Promise.all([
          fetch('/api/profile'),
          fetch('/api/tips'),
        ]);
        const profile = await profileRes.json();
        const tips = await tipsRes.json();
        setCreatorInfo(profile);
        setMockTips(tips);
      } catch (err) {
        console.error('Failed to fetch data', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Sync Privy wallet address into profile when logged in
  useEffect(() => {
    if (!user) return;
    const wallet = user.linkedAccounts?.find((a) => a.type === 'wallet');
    const address = (wallet as { address?: string })?.address || '';
    if (address && address !== creatorInfo.walletAddress) {
      setCreatorInfo((prev) => ({ ...prev, walletAddress: address }));
    }
  }, [user]);

  const handleSaveProfile = async (updatedProfile: Creator) => {
    const res = await fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedProfile),
    });
    const data = await res.json();
    if (data.success) setCreatorInfo(data.profile);
  };

  const handleAddTip = async (newTip: Tip) => {
    try {
      const res = await fetch('/api/tips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTip),
      });
      const data = await res.json();
      if (data.success) setMockTips((prev) => [data.tip, ...prev]);
    } catch {
      setMockTips((prev) => [newTip, ...prev]);
    }
  };

  // Privy not ready yet
  if (!ready || isLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <p style={{ marginTop: '16px', fontFamily: 'var(--font-mono)' }}>Loading Tipping Studio…</p>
        <style>{`
          .loading-screen { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; color: var(--text-primary); }
          .spinner { width: 32px; height: 32px; border: 2px solid rgba(10,10,10,0.1); border-top-color: var(--text-primary); border-radius: 50%; animation: spin 0.8s linear infinite; }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  // Not logged in — show login screen
  if (!authenticated) {
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
          .login-desc { font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6; max-width: 320px; }
          .login-btn { width: 100%; padding: 14px; font-size: 1rem; margin-top: 8px; }
          .login-footer { font-family: var(--font-mono); font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.12em; color: var(--text-muted); opacity: 0.5; margin-top: 4px; }
        `}</style>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Sidebar currentView={currentView} setView={setCurrentView} creatorInfo={creatorInfo} />
      <main className="main-content">
        {currentView === 'dashboard' && (
          <DashboardView
            creatorInfo={creatorInfo}
            setCreatorInfo={setCreatorInfo}
            mockTips={mockTips}
            onSaveProfile={handleSaveProfile}
          />
        )}
        {currentView === 'preview' && (
          <div className="preview-container">
            <div className="preview-banner">
              <span className="tag-mono">Preview Mode</span>
              <h2>Tipping Page Live Preview</h2>
              <p>This is what your fans see. Try the tipping flow to see updates in your dashboard ledger!</p>
            </div>
            <TipPageView creatorInfo={creatorInfo} onAddTip={handleAddTip} />
          </div>
        )}
        {currentView === 'how-it-works' && (
          <div className="how-it-works-wrap">
            <span className="tag-mono">Information Hub</span>
            <h1 className="page-title">How it Works</h1>
            <div className="glass-card info-card">
              <h3>The Creator Ecosystem</h3>
              <p>The GoodDollar Tip Jar lets Web3 users support creators directly using G$ Universal Basic Income on Celo.</p>
              <div className="steps-flow">
                {[
                  { n: '01', title: 'Sign In & Register', desc: 'Connect your wallet via Privy. Your Celo address becomes your tipping address.' },
                  { n: '02', title: 'Share Your Page', desc: 'Display your QR code or tipping link on streams and bios. Embed the widget on your site.' },
                  { n: '03', title: 'Earn Peer-to-Peer', desc: 'Fans tip you in G$ directly from their GoodWallet. Wallet-to-wallet on Celo, fee-free.' },
                ].map((s) => (
                  <div key={s.n} className="flow-step">
                    <div className="step-num">{s.n}</div>
                    <h4>{s.title}</h4>
                    <p>{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <style>{`
        .preview-container { display: flex; flex-direction: column; align-items: center; gap: 24px; }
        .preview-banner { text-align: center; max-width: 600px; margin-bottom: 8px; }
        .preview-banner h2 { font-family: var(--font-mono); font-size: 1.75rem; margin-top: 4px; }
        .preview-banner p { font-size: 0.9rem; color: var(--text-secondary); margin-top: 8px; }
        .how-it-works-wrap { max-width: 800px; margin: 0 auto; }
        .page-title { font-family: var(--font-mono); font-size: 2.25rem; margin-bottom: 24px; margin-top: 4px; }
        .info-card { margin-bottom: 24px; }
        .info-card h3 { font-family: var(--font-mono); margin-bottom: 12px; text-transform: uppercase; }
        .info-card p { color: var(--text-secondary); line-height: 1.6; margin-bottom: 32px; }
        .steps-flow { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .flow-step { position: relative; background: rgba(255,255,255,0.01); border: 1px solid var(--border-glass); border-radius: 12px; padding: 20px; }
        .step-num { font-family: var(--font-mono); font-size: 2.5rem; font-weight: 700; color: rgba(255,255,255,0.04); position: absolute; top: 10px; right: 16px; }
        .flow-step h4 { font-size: 1rem; font-weight: 600; margin-bottom: 8px; }
        .flow-step p { font-size: 0.8rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 0; }
        @media (max-width: 768px) { .steps-flow { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}
