'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Check, Share2, ChevronRight } from 'lucide-react';

interface NavbarProps {
  username: string;
  walletAddress?: string;
}

const PAGE_LABELS: Record<string, { label: string; sub: string }> = {
  '/dashboard':    { label: 'Dashboard',    sub: 'Creator overview & settings' },
  '/preview':      { label: 'Tip Page',     sub: 'Live preview & sharing' },
  '/how-it-works': { label: 'How it Works', sub: 'Platform guide' },
};

function shortAddr(addr: string) {
  return addr.slice(0, 6) + '…' + addr.slice(-4);
}

export default function Navbar({ username, walletAddress }: NavbarProps) {
  const [copied, setCopied] = useState(false);
  const pathname = usePathname();

  const tipUrl = typeof window !== 'undefined' && username
    ? `${window.location.origin}/tip/${username}`
    : '';

  const copyLink = () => {
    if (!tipUrl) return;
    navigator.clipboard.writeText(tipUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const page = PAGE_LABELS[pathname] ?? PAGE_LABELS['/dashboard'];

  return (
    <header className="topnav">
      {/* Left — breadcrumb */}
      <div className="topnav-left">
        <div className="breadcrumb">
          <span className="breadcrumb-root">G$ Tip Jar</span>
          <ChevronRight size={13} className="breadcrumb-sep" />
          <span className="breadcrumb-current">{page.label}</span>
        </div>
        <p className="topnav-sub">{page.sub}</p>
      </div>

      {/* Right — actions */}
      <div className="topnav-right">
        {/* Network badge */}
        <div className="network-badge">
          <span className="network-dot" />
          <span>Celo Mainnet</span>
        </div>

        {/* Wallet */}
        {walletAddress && (
          <div className="wallet-chip">
            <span className="wallet-chip-addr">{shortAddr(walletAddress)}</span>
          </div>
        )}

        {/* Share tip link */}
        {username && (
          <button onClick={copyLink} className={`share-btn ${copied ? 'share-btn-done' : ''}`}>
            {copied
              ? <><Check size={14} /><span>Copied!</span></>
              : <><Share2 size={14} /><span>Share tip link</span></>}
          </button>
        )}
      </div>

      <style>{`
        .topnav {
          position: fixed;
          top: 0;
          left: var(--sidebar-width);
          right: 0;
          height: 60px;
          background: rgba(250, 250, 247, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border-glass);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 32px;
          z-index: 90;
          gap: 16px;
        }
        .topnav-left {
          display: flex;
          flex-direction: column;
          gap: 1px;
          min-width: 0;
        }
        .breadcrumb {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-mono);
          font-size: 0.75rem;
          font-weight: 500;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        .breadcrumb-root { opacity: 0.6; }
        .breadcrumb-sep { opacity: 0.4; flex-shrink: 0; }
        .breadcrumb-current { color: var(--text-primary); opacity: 1; }
        .topnav-sub {
          font-size: 0.72rem;
          color: var(--text-muted);
          line-height: 1;
          margin: 0;
        }
        .topnav-right {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }
        .network-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(52, 199, 89, 0.08);
          border: 1px solid rgba(52, 199, 89, 0.2);
          border-radius: 999px;
          padding: 5px 12px;
          font-family: var(--font-mono);
          font-size: 0.7rem;
          font-weight: 600;
          color: #1a7a38;
          letter-spacing: 0.04em;
          white-space: nowrap;
        }
        .network-dot {
          width: 6px;
          height: 6px;
          background: #34c759;
          border-radius: 50%;
          flex-shrink: 0;
          animation: statusPulse 2.5s ease-in-out infinite;
          color: #34c759;
        }
        .wallet-chip {
          background: rgba(255,255,255,0.7);
          border: 1px solid var(--border-glass);
          border-radius: 999px;
          padding: 5px 12px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .wallet-chip-addr {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          color: var(--text-secondary);
          letter-spacing: 0.02em;
        }
        .share-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: var(--text-primary);
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 7px 14px;
          font-family: var(--font-sans);
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s var(--ease-out-expo);
          white-space: nowrap;
        }
        .share-btn:hover { background: #222; transform: translateY(-1px); }
        .share-btn-done { background: #1a7a38 !important; transform: none !important; }

        @media (max-width: 768px) {
          .topnav {
            left: 0;
            top: 56px;
            padding: 0 16px;
            height: 52px;
          }
          .topnav-sub, .wallet-chip { display: none; }
          .network-badge span { display: none; }
          .network-badge { padding: 5px 8px; }
          .share-btn span { display: none; }
          .share-btn { padding: 7px 10px; }
        }
      `}</style>
    </header>
  );
}
