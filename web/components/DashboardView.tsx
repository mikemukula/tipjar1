'use client';

import { useState, useEffect } from 'react';
import { Copy, Check, QrCode, Code, User, MessageSquare, Download, Loader2, Sparkles, Heart, Coffee } from 'lucide-react';
import type { Creator, Tip } from '@/providers/CreatorProvider';

const YoutubeIcon = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </svg>
);

const TwitterIcon = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

interface DashboardViewProps {
  creatorInfo: Creator;
  setCreatorInfo: (info: Creator) => void;
  tips: Tip[];
  onSaveProfile: (profile: Creator) => Promise<void>;
  isOnChain?: boolean;
  regStatus?: 'idle' | 'pending' | 'success' | 'error';
  regError?: string | null;
}

export default function DashboardView({ creatorInfo, setCreatorInfo, tips, onSaveProfile, isOnChain, regStatus, regError }: DashboardViewProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedWidget, setCopiedWidget] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  const BIO_MAX = 280;

  useEffect(() => { setMounted(true); }, []);

  const tipLink = typeof window !== 'undefined'
    ? `${window.location.origin}/tip/${creatorInfo.username || 'username'}`
    : `/tip/${creatorInfo.username || 'username'}`;

  const widgetCode = `<iframe \n  src="${typeof window !== 'undefined' ? window.location.origin : ''}/widget/${creatorInfo.username || 'username'}" \n  width="350" \n  height="500" \n  style="border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; background: #050505;"\n></iframe>`;

  const copyToClipboard = (text: string, isWidget = false) => {
    navigator.clipboard.writeText(text);
    if (isWidget) { setCopiedWidget(true); setTimeout(() => setCopiedWidget(false), 2000); }
    else { setCopiedLink(true); setTimeout(() => setCopiedLink(false), 2000); }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCreatorInfo({ ...creatorInfo, [name]: value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSaveProfile(creatorInfo);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2200);
    } catch { /* silent */ }
    finally { setSaving(false); }
  };

  const handleDownloadQR = () => {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(tipLink)}&color=000000&bgcolor=ffffff&format=png`;
    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = `tip-qr-${creatorInfo.username || 'code'}.png`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalTips = tips.reduce((sum, tip) => sum + Number(tip.amount), 0);
  const avgTip = tips.length > 0 ? Math.round(totalTips / tips.length) : 0;
  const bioLength = (creatorInfo.bio || '').length;

  const statCards = [
    { label: 'Total Tips Received', value: totalTips.toLocaleString(), suffix: 'G$', desc: 'All-time earnings', accent: '#111111', progress: 0.78 },
    { label: 'Tips Volume', value: tips.length, suffix: null, desc: 'Individual payments', accent: '#999999', progress: 0.54 },
    { label: 'Average Tip', value: avgTip, suffix: 'G$', desc: 'Per fan interaction', accent: '#cccccc', progress: 0.35 },
  ];

  return (
    <div className="dashboard-grid">
      {/* Header */}
      <div className="dashboard-header span-2" style={{ animation: mounted ? 'fadeUp 0.5s ease both' : 'none', animationDelay: '0.1s' }}>
        <div className="dashboard-hero">
          <div className="dashboard-hero-text">
            <div className="hero-greeting">
              {creatorInfo.name ? `Hello, ${creatorInfo.name.split(' ')[0]} 👋` : 'Welcome to your studio'}
            </div>
            <h1 className="dashboard-title">Creator Dashboard</h1>
            <p className="dashboard-subtitle">
              Track your G$ earnings, manage your profile, and share your tipping link.
            </p>
          </div>
          <div className="dashboard-hero-actions">
            <div className="tip-link-container glass-card">
              <div className="tip-link-header">
                <span className="tip-link-label">Your tipping link</span>
                {creatorInfo.username
                  ? <span className="tip-link-status active-dot">Active</span>
                  : <span className="tip-link-status inactive-dot">Set a username first</span>
                }
              </div>
              <div className="tip-link-input-group">
                <span className="tip-link-display">{tipLink}</span>
                <button onClick={() => copyToClipboard(tipLink)} className="btn-copy-link" disabled={!creatorInfo.username}>
                  {copiedLink ? <><Check size={14} /><span>Copied!</span></> : <><Copy size={14} /><span>Copy</span></>}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics */}
      <div className="analytics-row span-2">
        {statCards.map((card, i) => (
          <div className="glass-card stat-card" key={i} style={{ animation: mounted ? 'fadeUp 0.5s ease both' : 'none', animationDelay: `${0.4 + i * 0.1}s` }}>
            <div className="stat-card-top">
              <span className="stat-accent-dot" style={{ background: card.accent }} />
              <span className="stat-label">{card.label}</span>
            </div>
            <h2 className="stat-value">{card.value}{card.suffix && <span className="stat-currency"> {card.suffix}</span>}</h2>
            <span className="stat-desc">{card.desc}</span>
            <div className="stat-progress-track">
              <div className="stat-progress-bar" style={{ width: `${card.progress * 100}%`, background: card.accent }} />
            </div>
          </div>
        ))}
      </div>

      {/* Profile Settings */}
      <div className="glass-card section-card" style={{ animation: mounted ? 'fadeUp 0.5s ease both' : 'none', animationDelay: '0.7s' }}>
        <div className="section-header"><User size={20} /><h3>Profile Settings</h3></div>
        <p className="section-helper-text">Preview changes will reflect on your public tipping page.</p>
        <form className="settings-form" onSubmit={handleSave}>
          <div className="form-group">
            <label htmlFor="name">Display Name</label>
            <input type="text" id="name" name="name" value={creatorInfo.name || ''} onChange={handleInputChange} placeholder="e.g. Nuwayama" />
          </div>
          <div className="form-divider" />
          <div className="form-group">
            <label htmlFor="username">Tipping Handle</label>
            <div className="username-prefix-container">
              <span className="prefix">tip.gd/</span>
              <input type="text" id="username" name="username" value={creatorInfo.username || ''} onChange={handleInputChange} placeholder="username" />
            </div>
          </div>
          <div className="form-divider" />
          <div className="form-group">
            <div className="label-row">
              <label htmlFor="bio">Bio</label>
              <span className={`char-count ${bioLength > BIO_MAX ? 'over' : ''}`}>{bioLength}/{BIO_MAX}</span>
            </div>
            <textarea id="bio" name="bio" value={creatorInfo.bio || ''} onChange={handleInputChange} placeholder="Tell your fans what their support helps you achieve..." maxLength={BIO_MAX + 20} />
          </div>
          <div className="form-divider" />
          <div className="form-group">
            <label>Social Links</label>
            <div className="social-input-group">
              <div className="social-input-wrapper">
                <YoutubeIcon size={16} className="social-icon" />
                <input type="text" name="youtube" value={creatorInfo.youtube || ''} onChange={handleInputChange} placeholder="YouTube channel URL" />
              </div>
              <div className="social-input-wrapper">
                <TwitterIcon size={16} className="social-icon" />
                <input type="text" name="twitter" value={creatorInfo.twitter || ''} onChange={handleInputChange} placeholder="Twitter profile URL" />
              </div>
            </div>
          </div>
          {creatorInfo.wallet_address && (
            <>
              <div className="form-divider" />
              <div className="form-group">
                <label>Celo Wallet Address</label>
                <input type="text" readOnly value={creatorInfo.wallet_address} className="wallet-input" />
              </div>
            </>
          )}
          {regError && (
            <div style={{ fontSize: '0.8rem', color: '#c53030', background: 'rgba(229,62,62,0.06)', border: '1px solid rgba(229,62,62,0.2)', borderRadius: 8, padding: '8px 12px' }}>
              {regError}
            </div>
          )}
          <button type="submit" className={`btn-primary btn-save ${saveSuccess ? 'btn-save-success' : ''}`} disabled={saving || regStatus === 'pending'} style={{ marginTop: '8px', alignSelf: 'flex-start' }}>
            {regStatus === 'pending' ? <><Loader2 size={16} className="spin" />Confirm in wallet…</>
              : saving ? <><Loader2 size={16} className="spin" />Saving…</>
              : saveSuccess ? <><Check size={16} />Saved!</>
              : isOnChain ? 'Save Changes'
              : 'Register & Save'}
          </button>
        </form>
      </div>

      {/* Promo column */}
      <div className="promotion-column">
        <div className="glass-card section-card" style={{ animation: mounted ? 'fadeUp 0.5s ease both' : 'none', animationDelay: '0.8s' }}>
          <div className="section-header"><QrCode size={20} /><h3>QR Code Asset</h3></div>
          <p className="section-desc">Download or overlay this QR code on your live streams.</p>
          <div className="qr-display-container">
            <div className="qr-badge">
              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(tipLink)}&color=000000&bgcolor=ffffff`} alt="Tipping QR Code" className="qr-image" />
            </div>
            <div className="qr-info">
              <span className="tag-mono">Scan to Tip</span>
              <h4>@{creatorInfo.username || 'username'}</h4>
              <p className="qr-subtext">Direct Celo G$ Transfer</p>
              <button onClick={handleDownloadQR} className="btn-download-qr"><Download size={14} />Download QR</button>
            </div>
          </div>
        </div>

        <div className="glass-card section-card" style={{ animation: mounted ? 'fadeUp 0.5s ease both' : 'none', animationDelay: '0.9s' }}>
          <div className="section-header"><Code size={20} /><h3>Website Widget</h3></div>
          <p className="section-desc">Embed this tipping widget on your blog or website.</p>
          <div className="widget-preview-box">
            <div className="widget-code-header">
              <span className="widget-code-dot" style={{ background: '#ff5f57' }} />
              <span className="widget-code-dot" style={{ background: '#febc2e' }} />
              <span className="widget-code-dot" style={{ background: '#28c840' }} />
              <span className="widget-code-lang">HTML</span>
            </div>
            <code className="widget-code-preview">{widgetCode}</code>
          </div>
          <button onClick={() => copyToClipboard(widgetCode, true)} className="btn-secondary full-width">
            {copiedWidget ? <><Check size={16} />Copied!</> : <><Copy size={16} />Copy HTML Code</>}
          </button>
        </div>
      </div>

      {/* Tip Ledger */}
      <div className="glass-card section-card span-2 ledger-card" style={{ animation: mounted ? 'fadeUp 0.5s ease both' : 'none', animationDelay: '1s' }}>
        <div className="section-header"><MessageSquare size={20} /><h3>Recent Tips & Messages</h3></div>
        {tips.length === 0 ? (
          <div className="empty-ledger">
            <div className="empty-ledger-icons">
              <Coffee size={28} style={{ opacity: 0.18 }} />
              <Heart size={36} style={{ opacity: 0.25 }} />
              <Sparkles size={28} style={{ opacity: 0.18 }} />
            </div>
            <h4 className="empty-ledger-title">No tips yet</h4>
            <p>Share your tipping link to start receiving support!</p>
          </div>
        ) : (
          <div className="ledger-table-wrap">
            <table className="ledger-table">
              <thead><tr><th>Sender</th><th>Message</th><th>Amount</th><th>Date</th></tr></thead>
              <tbody>
                {tips.map((tip) => (
                  <tr key={tip.id || tip.created_at} className="ledger-row">
                    <td>
                      <div className="sender-cell">
                        <div className="sender-avatar">{(tip.sender_name || 'A').charAt(0).toUpperCase()}</div>
                        <div className="sender-info">
                          <span className="sender-name">{tip.sender_name}</span>
                          <span className="sender-address">{tip.sender_address}</span>
                        </div>
                      </div>
                    </td>
                    <td className="message-cell">&quot;{tip.message}&quot;</td>
                    <td className="amount-cell"><span className="tip-amount-badge">+{tip.amount} G$</span></td>
                    <td className="date-cell">{tip.created_at ? new Date(tip.created_at).toLocaleString() : ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes successFlash { 0% { box-shadow: 0 0 0 0 rgba(40,200,64,0.4); } 50% { box-shadow: 0 0 0 8px rgba(40,200,64,0); } 100% { box-shadow: 0 0 0 0 rgba(40,200,64,0); } }
        .spin { animation: spin 0.8s linear infinite; }

        .dashboard-grid { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 24px; }
        .span-2 { grid-column: span 2; }
        .dashboard-header { margin-bottom: 8px; }
        .dashboard-hero { display: flex; justify-content: space-between; align-items: flex-end; gap: 32px; padding: 28px 32px; background: linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.4) 100%); border: 1px solid var(--border-glass); border-radius: 16px; backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); }
        .dashboard-hero-text { flex: 1; min-width: 0; }
        .hero-greeting { font-family: var(--font-mono); font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.12em; color: var(--text-muted); margin-bottom: 6px; }
        .dashboard-title { font-family: var(--font-sans); font-size: 2rem; font-weight: 700; letter-spacing: -0.02em; margin-bottom: 6px; color: var(--text-primary); }
        .dashboard-subtitle { font-size: 0.875rem; color: var(--text-secondary); line-height: 1.55; max-width: 360px; margin: 0; }
        .dashboard-hero-actions { flex-shrink: 0; min-width: 340px; }
        .tip-link-container { display: flex; flex-direction: column; gap: 10px; padding: 16px 18px; }
        .tip-link-header { display: flex; align-items: center; justify-content: space-between; }
        .tip-link-label { font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-muted); font-weight: 600; font-family: var(--font-mono); }
        .tip-link-status { font-family: var(--font-mono); font-size: 0.65rem; padding: 2px 8px; border-radius: 999px; display: flex; align-items: center; gap: 4px; }
        .active-dot { background: rgba(52,199,89,0.1); color: #1a7a38; border: 1px solid rgba(52,199,89,0.2); }
        .active-dot::before { content: ''; display: inline-block; width: 5px; height: 5px; background: #34c759; border-radius: 50%; }
        .inactive-dot { background: rgba(0,0,0,0.03); color: var(--text-muted); border: 1px solid var(--border-glass); }
        .tip-link-input-group { display: flex; gap: 8px; align-items: center; background: rgba(255,255,255,0.7); border: 1px solid var(--border-glass); border-radius: 8px; padding: 4px 4px 4px 12px; }
        .tip-link-display { font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-secondary); flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0; }
        .btn-copy-link { background: var(--text-primary); color: #fff; border: none; border-radius: 6px; padding: 0 14px; height: 36px; display: flex; align-items: center; gap: 6px; cursor: pointer; transition: var(--transition-smooth); font-family: var(--font-mono); font-size: 0.72rem; font-weight: 600; letter-spacing: 0.06em; flex-shrink: 0; }
        .btn-copy-link:hover:not(:disabled) { background: #222; }
        .btn-copy-link:disabled { opacity: 0.35; cursor: not-allowed; }

        .analytics-row { display: grid; grid-template-columns: repeat(3,1fr); gap: 24px; }
        .stat-card { display: flex; flex-direction: column; gap: 4px; position: relative; overflow: hidden; }
        .stat-card-top { display: flex; align-items: center; gap: 8px; }
        .stat-accent-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
        .stat-label { font-size: 0.8rem; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em; }
        .stat-value { font-family: var(--font-mono); font-size: 2rem; font-weight: 700; }
        .stat-currency { font-size: 1.15rem; color: var(--text-secondary); font-weight: 400; }
        .stat-desc { font-size: 0.75rem; color: var(--text-muted); }
        .stat-progress-track { position: absolute; bottom: 0; left: 0; right: 0; height: 3px; background: rgba(0,0,0,0.04); border-radius: 0 0 12px 12px; overflow: hidden; }
        .stat-progress-bar { height: 100%; border-radius: 2px; opacity: 0.5; }

        .section-header { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; border-bottom: 1px solid var(--border-glass); padding-bottom: 12px; }
        .section-header h3 { font-family: var(--font-mono); font-size: 1.15rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
        .section-desc { font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 20px; }
        .section-helper-text { font-size: 0.8rem; color: var(--text-muted); margin-top: -12px; margin-bottom: 20px; font-style: italic; }

        .settings-form { display: flex; flex-direction: column; gap: 16px; }
        .form-group { display: flex; flex-direction: column; }
        .form-divider { height: 1px; background: var(--border-glass); opacity: 0.5; margin: 4px 0; }
        .label-row { display: flex; justify-content: space-between; align-items: baseline; }
        .char-count { font-family: var(--font-mono); font-size: 0.7rem; color: var(--text-muted); }
        .char-count.over { color: #e53e3e; }
        .username-prefix-container { display: flex; align-items: center; border: 1px solid var(--border-glass); background: rgba(255,255,255,0.02); border-radius: 8px; overflow: hidden; }
        .username-prefix-container:focus-within { border-color: var(--text-primary); }
        .username-prefix-container .prefix { padding-left: 16px; color: var(--text-muted); font-family: var(--font-mono); font-size: 0.95rem; user-select: none; }
        .username-prefix-container input { border: none; background: transparent; }
        .social-input-group { display: flex; flex-direction: column; gap: 10px; }
        .social-input-wrapper { display: flex; align-items: center; border: 1px solid var(--border-glass); background: rgba(255,255,255,0.02); border-radius: 8px; overflow: hidden; }
        .social-input-wrapper:focus-within { border-color: var(--text-primary); }
        .social-icon { margin-left: 16px; color: var(--text-secondary); }
        .social-input-wrapper input { border: none; background: transparent; }
        .wallet-input { font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-muted); background: rgba(0,0,0,0.02); cursor: default; }

        .btn-save { display: inline-flex; align-items: center; gap: 8px; min-width: 140px; justify-content: center; }
        .btn-save:disabled { opacity: 0.75; cursor: not-allowed; }
        .btn-save-success { background: #28c840 !important; animation: successFlash 0.6s ease; }

        .promotion-column { display: flex; flex-direction: column; gap: 24px; }
        .qr-display-container { display: flex; align-items: flex-start; gap: 24px; background: rgba(0,0,0,0.005); border: 1px dashed var(--border-glass-hover); border-radius: 12px; padding: 20px; }
        .qr-badge { background: #fff; padding: 10px; border-radius: 10px; border: 1px solid var(--border-glass); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .qr-image { width: 110px; height: 110px; image-rendering: pixelated; }
        .qr-info { display: flex; flex-direction: column; gap: 4px; }
        .qr-info h4 { font-family: var(--font-mono); font-size: 1.1rem; }
        .qr-subtext { font-size: 0.75rem; color: var(--text-muted); }
        .btn-download-qr { display: inline-flex; align-items: center; gap: 6px; margin-top: 10px; padding: 7px 14px; background: transparent; border: 1px solid var(--text-primary); border-radius: 6px; font-family: var(--font-mono); font-size: 0.72rem; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; cursor: pointer; color: var(--text-primary); transition: all 0.25s ease; }
        .btn-download-qr:hover { background: var(--text-primary); color: #fff; }

        .widget-preview-box { background: rgba(0,0,0,0.03); border: 1px solid var(--border-glass); border-radius: 10px; margin-bottom: 16px; max-height: 140px; overflow-y: auto; }
        .widget-code-header { display: flex; align-items: center; gap: 6px; padding: 10px 14px 8px; border-bottom: 1px solid var(--border-glass); }
        .widget-code-dot { width: 8px; height: 8px; border-radius: 50%; opacity: 0.7; }
        .widget-code-lang { margin-left: auto; font-family: var(--font-mono); font-size: 0.65rem; letter-spacing: 0.06em; color: var(--text-muted); text-transform: uppercase; }
        .widget-code-preview { display: block; font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-secondary); white-space: pre-wrap; word-break: break-all; padding: 12px 14px; line-height: 1.65; }

        .ledger-card { margin-top: 12px; }
        .empty-ledger { text-align: center; padding: 56px 20px; color: var(--text-secondary); }
        .empty-ledger-icons { display: flex; align-items: center; justify-content: center; gap: 16px; margin-bottom: 20px; }
        .empty-ledger-title { font-family: var(--font-mono); font-size: 1.1rem; font-weight: 600; margin-bottom: 8px; color: var(--text-primary); }
        .ledger-table-wrap { overflow-x: auto; }
        .ledger-table { width: 100%; border-collapse: collapse; text-align: left; }
        .ledger-table th { font-family: var(--font-mono); text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.05em; color: var(--text-secondary); padding: 12px 16px; border-bottom: 1px solid var(--border-glass); }
        .ledger-table td { padding: 16px; border-bottom: 1px solid var(--border-glass); font-size: 0.9rem; }
        .ledger-row:hover { background-color: rgba(0,0,0,0.02); }
        .sender-cell { display: flex; align-items: center; gap: 12px; }
        .sender-avatar { width: 32px; height: 32px; background: rgba(0,0,0,0.04); border: 1px solid var(--border-glass); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: var(--font-mono); font-weight: bold; flex-shrink: 0; }
        .sender-info { display: flex; flex-direction: column; }
        .sender-name { font-weight: 600; }
        .sender-address { font-family: var(--font-mono); font-size: 0.7rem; color: var(--text-muted); }
        .message-cell { color: var(--text-secondary); font-style: italic; }
        .tip-amount-badge { font-family: var(--font-mono); color: var(--text-primary); border: 1.5px solid var(--text-primary); padding: 4px 10px; border-radius: 20px; font-size: 0.8rem; font-weight: 700; }
        .date-cell { font-size: 0.8rem; color: var(--text-muted); white-space: nowrap; }

        @media (max-width: 1024px) { .dashboard-grid { grid-template-columns: 1fr; } .span-2 { grid-column: span 1; } .analytics-row { grid-template-columns: 1fr 1fr; } }
        @media (max-width: 768px) { .dashboard-hero { flex-direction: column; align-items: flex-start; gap: 16px; padding: 20px; } .dashboard-hero-actions { width: 100%; min-width: 0; } .analytics-row { grid-template-columns: 1fr; } .qr-display-container { flex-direction: column; align-items: center; text-align: center; } }
        @media (max-width: 480px) { .dashboard-title { font-size: 1.6rem; } .stat-value { font-size: 1.6rem; } .ledger-table th, .ledger-table td { padding: 10px 8px; } .sender-avatar { display: none; } }
      `}</style>
    </div>
  );
}
