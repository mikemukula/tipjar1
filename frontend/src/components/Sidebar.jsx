import React from 'react';
import { LayoutDashboard, ExternalLink, Info, DollarSign, User, Zap, TrendingUp } from 'lucide-react';

export default function Sidebar({ currentView, setView, creatorInfo }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'preview', label: 'View Tip Page', icon: DollarSign },
    { id: 'spotlight', label: 'App Spotlight', icon: TrendingUp },
    { id: 'kyc-ubi', label: 'KYC & UBI', icon: Zap },
    { id: 'how-it-works', label: 'How it Works', icon: Info },
  ];

  return (
    <aside className="sidebar">
      {/* Top gradient glow — very subtle, almost invisible */}
      <div className="sidebar-glow" />

      {/* ─── Brand area ─── */}
      <div className="sidebar-brand">
        <span className="brand-symbol">G$</span>
        <span className="brand-text">TIP JAR</span>
      </div>
      <div className="brand-separator" />

      {/* ─── Navigation ─── */}
      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              <span className="nav-indicator" />
              <Icon size={18} className="nav-icon" />
              <span className="nav-label">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* ─── Footer profile card ─── */}
      <div className="sidebar-footer">
        <div className="creator-mini-profile">
          <div className="avatar-wrapper">
            <div className="avatar-placeholder">
              {creatorInfo.name ? creatorInfo.name.charAt(0).toUpperCase() : 'C'}
            </div>
            <span className="status-dot" />
          </div>
          <div className="profile-details">
            <h4 className="profile-name">{creatorInfo.name || 'Set your name'}</h4>
            <p className="profile-handle">@{creatorInfo.username || 'username'}</p>
          </div>
        </div>
      </div>

      {/* ─── Powered by tag ─── */}
      <div className="powered-tag">
        <Zap size={10} style={{ opacity: 0.45 }} />
        <span>Powered by GoodDollar</span>
      </div>

      <style>{`
        /* ── Entrance animation ── */
        @keyframes slideInFromLeft {
          0% {
            opacity: 0;
            transform: translateX(-24px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        /* ── Icon micro-rotation on hover ── */
        @keyframes iconPulse {
          0%   { transform: rotate(0deg); }
          50%  { transform: rotate(-8deg); }
          100% { transform: rotate(0deg); }
        }

        .sidebar {
          width: var(--sidebar-width);
          background: rgba(255, 255, 255, 0.5);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-right: 1px solid var(--border-glass);
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          display: flex;
          flex-direction: column;
          padding: 32px 20px 20px;
          z-index: 100;
          animation: slideInFromLeft 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
          overflow: hidden;
        }

        /* ── Top gradient glow ── */
        .sidebar-glow {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 120px;
          background: linear-gradient(
            180deg,
            rgba(0, 0, 0, 0.025) 0%,
            transparent 100%
          );
          pointer-events: none;
          z-index: 0;
        }

        /* ── Brand ── */
        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          padding-left: 8px;
          position: relative;
          z-index: 1;
        }

        .brand-symbol {
          font-family: var(--font-mono);
          font-weight: 700;
          font-size: 1.2rem;
          background: var(--text-primary);
          color: var(--bg-primary);
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
          letter-spacing: -0.02em;
        }

        .brand-text {
          font-family: var(--font-mono);
          font-weight: 600;
          letter-spacing: 0.14em;
          font-size: 1.05rem;
          text-transform: uppercase;
          color: var(--text-primary);
        }

        .brand-separator {
          height: 1px;
          background: linear-gradient(
            90deg,
            var(--border-glass) 0%,
            transparent 100%
          );
          margin: 24px 8px 28px;
          position: relative;
          z-index: 1;
        }

        /* ── Navigation ── */
        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 4px;
          flex: 1;
          position: relative;
          z-index: 1;
        }

        .nav-item {
          position: relative;
          display: flex;
          align-items: center;
          gap: 12px;
          background: transparent;
          border: none;
          color: var(--text-secondary);
          padding: 11px 16px;
          border-radius: 8px;
          font-family: var(--font-sans);
          font-size: 0.92rem;
          font-weight: 500;
          cursor: pointer;
          text-align: left;
          transition:
            color 0.3s cubic-bezier(0.16, 1, 0.3, 1),
            transform 0.3s cubic-bezier(0.16, 1, 0.3, 1),
            background 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* ── Left-border active indicator ── */
        .nav-indicator {
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%) scaleY(0);
          width: 2px;
          height: 20px;
          background: var(--text-primary);
          border-radius: 2px;
          transition:
            transform 0.35s cubic-bezier(0.16, 1, 0.3, 1),
            opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          opacity: 0;
        }

        .nav-item.active .nav-indicator {
          transform: translateY(-50%) scaleY(1);
          opacity: 1;
        }

        /* ── Hover state ── */
        .nav-item:hover {
          color: var(--text-primary);
          background: rgba(0, 0, 0, 0.02);
          transform: translateX(3px);
        }

        .nav-item:hover .nav-icon {
          animation: iconPulse 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* ── Active state ── */
        .nav-item.active {
          color: var(--text-primary);
          background: transparent;
          font-weight: 600;
        }

        .nav-item.active:hover {
          transform: translateX(0);
          background: transparent;
        }

        .nav-icon {
          flex-shrink: 0;
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .nav-label {
          white-space: nowrap;
        }

        /* ── Footer ── */
        .sidebar-footer {
          border-top: 1px solid var(--border-glass);
          padding-top: 20px;
          margin-top: auto;
          position: relative;
          z-index: 1;
        }

        .creator-mini-profile {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          background: rgba(255, 255, 255, 0.35);
          border-radius: 12px;
          position: relative;
          isolation: isolate;
          /* Gradient border via pseudo-element */
          border: 1px solid transparent;
          background-clip: padding-box;
        }

        .creator-mini-profile::before {
          content: '';
          position: absolute;
          inset: -1px;
          border-radius: 13px;
          padding: 1px;
          background: linear-gradient(
            135deg,
            rgba(0, 0, 0, 0.06) 0%,
            rgba(0, 0, 0, 0.02) 40%,
            rgba(0, 0, 0, 0.08) 100%
          );
          -webkit-mask:
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
          z-index: -1;
        }

        .avatar-wrapper {
          position: relative;
          flex-shrink: 0;
        }

        .avatar-placeholder {
          width: 36px;
          height: 36px;
          background: rgba(0, 0, 0, 0.04);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-mono);
          font-weight: 700;
          font-size: 0.9rem;
          color: var(--text-primary);
          border: 1px solid var(--border-glass);
        }

        .status-dot {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 9px;
          height: 9px;
          background: #34c759;
          border-radius: 50%;
          border: 2px solid rgba(255, 255, 255, 0.9);
          box-shadow: 0 0 0 1px rgba(52, 199, 89, 0.2);
        }

        .profile-details {
          overflow: hidden;
          min-width: 0;
          flex: 1;
        }

        .profile-name {
          font-size: 0.84rem;
          font-weight: 600;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          line-height: 1.3;
          margin: 0;
        }

        .profile-handle {
          font-size: 0.72rem;
          color: var(--text-secondary);
          font-family: var(--font-mono);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          line-height: 1.3;
          margin: 0;
          opacity: 0.7;
        }

        /* ── Powered by tag ── */
        .powered-tag {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          padding-top: 16px;
          font-family: var(--font-mono);
          font-size: 0.62rem;
          color: var(--text-secondary);
          opacity: 0.4;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          position: relative;
          z-index: 1;
          transition: opacity 0.3s ease;
        }

        .powered-tag:hover {
          opacity: 0.65;
        }

        /* ══════════════════════════
           Mobile — frosted glass top-bar
           ══════════════════════════ */
        @media (max-width: 768px) {
          .sidebar {
            width: 100%;
            height: 56px;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            padding: 0 16px;
            bottom: auto;
            border-right: none;
            border-bottom: 1px solid rgba(0, 0, 0, 0.06);
            background: rgba(255, 255, 255, 0.72);
            backdrop-filter: blur(28px) saturate(180%);
            -webkit-backdrop-filter: blur(28px) saturate(180%);
            animation: none;
          }

          .sidebar-glow {
            display: none;
          }

          .sidebar-brand {
            margin-bottom: 0;
            padding-left: 0;
            gap: 8px;
          }

          .brand-symbol {
            width: 28px;
            height: 28px;
            font-size: 1rem;
          }

          .brand-text {
            font-size: 0.9rem;
            letter-spacing: 0.12em;
          }

          .brand-separator {
            display: none;
          }

          .sidebar-nav {
            flex-direction: row;
            gap: 2px;
            flex: 0;
          }

          .nav-item {
            padding: 8px 10px;
            font-size: 0.82rem;
            border-radius: 8px;
          }

          .nav-item:hover {
            transform: none;
          }

          .nav-indicator {
            display: none;
          }

          .nav-item.active {
            background: rgba(0, 0, 0, 0.05);
          }

          .nav-label {
            display: none;
          }

          .nav-icon {
            width: 18px;
            height: 18px;
          }

          .sidebar-footer {
            display: none;
          }

          .powered-tag {
            display: none;
          }
        }
      `}</style>
    </aside>
  );
}
