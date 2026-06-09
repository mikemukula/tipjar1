'use client';

import { useState } from 'react';
import { Send, CheckCircle2, User, MessageCircle, ArrowRight, Star, ExternalLink } from 'lucide-react';
import { useSendTip } from '@/hooks/useSendTip';

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

const AnimatedCheck = () => (
  <svg className="animated-check" width="56" height="56" viewBox="0 0 56 56" fill="none">
    <circle className="check-circle" cx="28" cy="28" r="25" stroke="var(--text-primary)" strokeWidth="2" />
    <path className="check-path" d="M17 28.5L24.5 36L39 21" stroke="var(--text-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

interface Creator {
  name: string;
  username: string;
  bio: string;
  youtube: string;
  twitter: string;
  wallet_address?: string;
}

interface Tip {
  id?: string;
  creator_username: string;
  sender_name: string;
  sender_address: string;
  amount: number;
  message: string;
  tx_hash?: string | null;
  created_at?: string;
}

interface TipPageViewProps {
  creatorInfo: Creator;
  onAddTip?: (tip: Tip) => void;
  isWidget?: boolean;
}

export default function TipPageView({ creatorInfo, onAddTip, isWidget = false }: TipPageViewProps) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(50);
  const [customAmount, setCustomAmount] = useState('');
  const [message, setMessage] = useState('');
  const [senderName, setSenderName] = useState('');
  const [bounceKey, setBounceKey] = useState<number | null>(null);

  const { sendTip, status, txHash, error: tipError, reset: resetTip } = useSendTip();

  const isSending = status === 'approving' || status === 'approved' || status === 'sending';
  const isSuccess = status === 'success';

  const sendingLabel =
    status === 'approving' ? 'Approving G$…' :
    status === 'approved'  ? 'Approval confirmed…' :
    status === 'sending'   ? 'Sending tip…' : 'Processing…';

  const presets = [10, 50, 100, 500];

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
    setBounceKey(amount);
    setTimeout(() => setBounceKey(null), 400);
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setCustomAmount(value);
      setSelectedAmount(null);
    }
  };

  const activeAmount = selectedAmount !== null ? selectedAmount : (parseInt(customAmount) || 0);

  const handleSubmitTip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (activeAmount <= 0) return;

    const hash = await sendTip({
      creatorUsername: creatorInfo.username,
      amountG$: activeAmount,
      message: message.trim() || '',
    });

    if (hash && onAddTip) {
      onAddTip({
        creator_username: creatorInfo.username,
        sender_name: senderName.trim() || 'Anonymous Fan',
        sender_address: '',
        amount: activeAmount,
        message: message.trim() || 'Supported the creator!',
        tx_hash: hash,
      });
    }
  };

  const resetForm = () => {
    resetTip();
    setMessage('');
    setSenderName('');
    setSelectedAmount(50);
    setCustomAmount('');
  };

  return (
    <div className={`tip-container ${isWidget ? 'widget-mode' : ''}`}>
      {!isSuccess ? (
        <div className="glass-card tip-card">
          <div className="tip-card-accent" />
          <div className="tip-profile-header">
            <div className="creator-avatar-ring">
              <div className="creator-avatar">
                {creatorInfo.name ? creatorInfo.name.charAt(0).toUpperCase() : 'C'}
              </div>
            </div>
            <div className="creator-name-row">
              <h2 className="creator-title">{creatorInfo.name || 'Creator Name'}</h2>
              <Star size={15} className="verified-badge" />
            </div>
            <p className="creator-handle">@{creatorInfo.username || 'username'}</p>
            <p className="creator-bio">"{creatorInfo.bio || 'Thank you for supporting my content creation journey!'}"</p>
            {(creatorInfo.youtube || creatorInfo.twitter) && (
              <div className="social-badges">
                {creatorInfo.youtube && (
                  <a href={creatorInfo.youtube} target="_blank" rel="noopener noreferrer" className="social-badge">
                    <YoutubeIcon size={13} /> YouTube
                  </a>
                )}
                {creatorInfo.twitter && (
                  <a href={creatorInfo.twitter} target="_blank" rel="noopener noreferrer" className="social-badge">
                    <TwitterIcon size={13} /> Twitter
                  </a>
                )}
              </div>
            )}
            {creatorInfo.wallet_address && (
              <div className="wallet-address-badge">
                <span className="wallet-label">Celo Address</span>
                <span className="wallet-addr">
                  {creatorInfo.wallet_address.slice(0, 6)}…{creatorInfo.wallet_address.slice(-4)}
                </span>
              </div>
            )}
          </div>

          <form className="tipping-form" onSubmit={handleSubmitTip}>
            <div className="form-group">
              <label>Select Amount (G$)</label>
              <div className="preset-grid">
                {presets.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => handleAmountSelect(amt)}
                    className={`preset-chip ${selectedAmount === amt ? 'active' : ''} ${bounceKey === amt ? 'bounce' : ''}`}
                  >
                    {amt} G$
                  </button>
                ))}
              </div>
              <div className="or-divider">
                <span className="or-divider-line" />
                <span className="or-divider-text">or</span>
                <span className="or-divider-line" />
              </div>
              <div className="floating-input-wrap">
                <input
                  type="text"
                  placeholder=" "
                  value={customAmount}
                  onChange={handleCustomAmountChange}
                  className="custom-amount-input"
                  id="customAmount"
                />
                <label htmlFor="customAmount" className="floating-label">Custom G$ amount</label>
              </div>
            </div>

            <div className="form-group">
              <div className="floating-input-wrap has-icon">
                <span className="input-icon"><User size={16} /></span>
                <input
                  type="text"
                  id="senderName"
                  placeholder=" "
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                />
                <label htmlFor="senderName" className="floating-label with-icon">Your Name (Optional)</label>
              </div>
            </div>

            <div className="form-group">
              <div className="floating-input-wrap has-icon textarea-wrap">
                <span className="input-icon textarea-icon"><MessageCircle size={16} /></span>
                <textarea
                  id="message"
                  placeholder=" "
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  maxLength={150}
                />
                <label htmlFor="message" className="floating-label with-icon">Add a Message</label>
              </div>
            </div>

            {tipError && (
              <div className="tip-error-banner">{tipError}</div>
            )}
            <button type="submit" disabled={activeAmount <= 0 || isSending} className="tip-submit-btn">
              {isSending ? (
                <div className="submit-loading">
                  <div className="spinner-clean" />
                  <span className="sending-text">{sendingLabel}</span>
                </div>
              ) : (
                <span className="submit-content">
                  <span>Send {activeAmount > 0 ? `${activeAmount} G$` : 'Tip'}</span>
                  <ArrowRight size={16} className="submit-arrow" />
                </span>
              )}
            </button>
          </form>
        </div>
      ) : (
        <div className="glass-card tip-card success-card">
          <div className="confetti-container" aria-hidden="true">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className={`confetti-dot dot-${i}`} />
            ))}
          </div>
          <div className="success-icon-wrap"><AnimatedCheck /></div>
          <h2 className="success-title">Tip Sent!</h2>
          <p className="success-desc">Your daily GoodDollar UBI has made someone&apos;s day.</p>
          <div className="receipt-box">
            <div className="receipt-row">
              <span className="receipt-label">Recipient</span>
              <span className="receipt-value">{creatorInfo.name}</span>
            </div>
            <div className="receipt-row">
              <span className="receipt-label">Amount</span>
              <span className="receipt-value-strong">{activeAmount} G$</span>
            </div>
            {senderName && (
              <div className="receipt-row">
                <span className="receipt-label">From</span>
                <span className="receipt-value">{senderName}</span>
              </div>
            )}
            {message && (
              <div className="receipt-msg">
                <span className="receipt-label">Message</span>
                <p className="receipt-msg-text">&quot;{message}&quot;</p>
              </div>
            )}
          </div>
          {txHash && (
            <a
              href={`https://celoscan.io/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="tx-link"
            >
              <ExternalLink size={13} /> View on Celoscan
            </a>
          )}
          <button onClick={resetForm} className="btn-secondary full-width reset-btn">
            Send Another Tip
          </button>
        </div>
      )}

      <style>{`
        .tip-container { display: flex; justify-content: center; align-items: center; min-height: 80vh; width: 100%; }
        .tip-card { position: relative; overflow: hidden; width: 100%; max-width: 440px; padding: 36px; border-radius: 20px; animation: fadeUpScale 0.7s cubic-bezier(0.16,1,0.3,1) both; }
        .tip-card-accent { position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, var(--text-primary) 0%, transparent 100%); opacity: 0.7; }
        .tip-container.widget-mode { min-height: auto; padding: 0; }
        .widget-mode .tip-card { border-radius: 16px; box-shadow: none; max-width: 100%; padding: 20px; }

        .tip-profile-header { display: flex; flex-direction: column; align-items: center; text-align: center; margin-bottom: 28px; }
        .creator-avatar-ring { position: relative; padding: 4px; border-radius: 50%; margin-bottom: 16px; }
        .creator-avatar-ring::before { content: ''; position: absolute; inset: 0; border-radius: 50%; border: 1.5px solid var(--border-glass-hover); animation: avatarPulse 3s ease-in-out infinite; }
        .creator-avatar { width: 72px; height: 72px; border-radius: 50%; background: rgba(0,0,0,0.02); border: 1px solid var(--border-glass); display: flex; align-items: center; justify-content: center; font-family: var(--font-mono); font-size: 2rem; font-weight: 700; position: relative; z-index: 1; }
        .creator-name-row { display: flex; align-items: center; gap: 6px; }
        .creator-title { font-size: 1.6rem; font-weight: 700; letter-spacing: -0.02em; }
        .verified-badge { color: var(--text-primary); fill: var(--text-primary); opacity: 0.85; flex-shrink: 0; }
        .creator-handle { font-family: var(--font-mono); font-size: 0.82rem; color: var(--text-muted); opacity: 0.75; margin-bottom: 10px; }
        .creator-bio { font-size: 0.88rem; color: var(--text-secondary); line-height: 1.65; font-style: italic; max-width: 360px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .social-badges { display: flex; gap: 8px; margin-top: 16px; }
        .social-badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(0,0,0,0.01); border: 1px solid var(--border-glass); border-radius: 20px; padding: 6px 14px; font-size: 0.72rem; font-weight: 500; color: var(--text-secondary); text-decoration: none; transition: var(--transition-smooth); }
        .social-badge:hover { color: var(--text-primary); border-color: var(--text-primary); transform: scale(1.05); }
        .wallet-address-badge { display: flex; align-items: center; gap: 8px; margin-top: 12px; background: rgba(0,0,0,0.02); border: 1px solid var(--border-glass); border-radius: 20px; padding: 5px 14px; }
        .wallet-label { font-family: var(--font-mono); font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-muted); }
        .wallet-addr { font-family: var(--font-mono); font-size: 0.78rem; color: var(--text-secondary); }

        .tipping-form { display: flex; flex-direction: column; gap: 18px; }
        .preset-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
        .preset-chip { background: transparent; border: 1px solid var(--border-glass); color: var(--text-secondary); padding: 11px 0; border-radius: 10px; font-family: var(--font-mono); font-size: 0.84rem; font-weight: 600; cursor: pointer; transition: all 0.3s cubic-bezier(0.16,1,0.3,1); }
        .preset-chip:hover { border-color: rgba(10,10,10,0.35); color: var(--text-primary); background: rgba(0,0,0,0.015); }
        .preset-chip.active { background: var(--text-primary); color: #fff; border-color: var(--text-primary); transform: scale(1.02); box-shadow: 0 2px 10px rgba(10,10,10,0.12); }
        .preset-chip.bounce { animation: chipBounce 0.4s cubic-bezier(0.34,1.56,0.64,1); }
        .or-divider { display: flex; align-items: center; gap: 12px; margin: 14px 0 6px; }
        .or-divider-line { flex: 1; height: 1px; background: var(--border-glass); }
        .or-divider-text { font-family: var(--font-mono); font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.15em; color: var(--text-muted); font-weight: 500; }
        .floating-input-wrap { position: relative; }
        .floating-input-wrap input, .floating-input-wrap textarea { width: 100%; background: rgba(255,255,255,0.6); border: 1px solid var(--border-glass); border-radius: 8px; color: var(--text-primary); padding: 18px 16px 8px; font-family: var(--font-body); font-size: 0.92rem; outline: none; transition: border-color 0.35s, background 0.35s, box-shadow 0.35s; }
        .floating-input-wrap.has-icon input, .floating-input-wrap.has-icon textarea { padding-left: 44px; }
        .floating-input-wrap input:focus, .floating-input-wrap textarea:focus { border-color: var(--text-primary); background: #fff; box-shadow: 0 4px 16px rgba(0,0,0,0.02); }
        .floating-label { position: absolute; top: 50%; left: 16px; transform: translateY(-50%); font-family: var(--font-body); font-size: 0.88rem; color: var(--text-muted); pointer-events: none; transition: all 0.25s cubic-bezier(0.16,1,0.3,1); background: transparent; padding: 0 4px; margin-left: -4px; }
        .floating-label.with-icon { left: 44px; }
        .textarea-wrap .floating-label { top: 18px; transform: none; }
        .floating-input-wrap input:focus ~ .floating-label, .floating-input-wrap input:not(:placeholder-shown) ~ .floating-label { top: 6px; transform: none; font-size: 0.65rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-secondary); }
        .floating-input-wrap textarea:focus ~ .floating-label, .floating-input-wrap textarea:not(:placeholder-shown) ~ .floating-label { top: -8px; font-size: 0.65rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-secondary); background: linear-gradient(to bottom, transparent 45%, rgba(255,255,255,0.9) 45%); }
        .floating-input-wrap textarea { padding-top: 18px; min-height: 96px; resize: vertical; }
        .input-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: var(--text-muted); pointer-events: none; z-index: 2; }
        .textarea-icon { top: 20px; transform: none; }

        .tip-submit-btn { width: 100%; height: 48px; background: var(--text-primary); color: #fff; border: none; border-radius: 10px; font-size: 0.92rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; font-family: var(--font-sans); transition: all 0.35s cubic-bezier(0.16,1,0.3,1); margin-top: 6px; }
        .tip-submit-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(10,10,10,0.15); background: #1a1a16; }
        .tip-submit-btn:disabled { opacity: 0.45; cursor: not-allowed; }
        .submit-content { display: flex; align-items: center; gap: 8px; }
        .submit-arrow { transition: transform 0.35s cubic-bezier(0.16,1,0.3,1); }
        .tip-submit-btn:hover:not(:disabled) .submit-arrow { transform: translateX(4px); }
        .submit-loading { display: flex; align-items: center; gap: 10px; }
        .sending-text { font-size: 0.88rem; opacity: 0.8; animation: textFade 1.5s ease-in-out infinite; }
        .spinner-clean { width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.2); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; }

        .success-card { text-align: center; animation: fadeUpScale 0.6s cubic-bezier(0.16,1,0.3,1); position: relative; overflow: hidden; }
        .confetti-container { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
        .confetti-dot { position: absolute; width: 5px; height: 5px; border-radius: 50%; background: var(--text-primary); opacity: 0; animation: confettiFloat 2.8s ease-out forwards; }
        .dot-0  { left: 10%; bottom: 0; animation-delay: 0.1s;  --drift: -12px; }
        .dot-1  { left: 20%; bottom: 0; animation-delay: 0.25s; --drift: 18px;  width: 4px; height: 4px; }
        .dot-2  { left: 35%; bottom: 0; animation-delay: 0.15s; --drift: -8px;  }
        .dot-3  { left: 50%; bottom: 0; animation-delay: 0.35s; --drift: 14px;  width: 6px; height: 6px; }
        .dot-4  { left: 65%; bottom: 0; animation-delay: 0.1s;  --drift: -20px; }
        .dot-5  { left: 78%; bottom: 0; animation-delay: 0.3s;  --drift: 10px;  width: 4px; height: 4px; }
        .dot-6  { left: 88%; bottom: 0; animation-delay: 0.2s;  --drift: -15px; }
        .dot-7  { left: 15%; bottom: 0; animation-delay: 0.45s; --drift: 22px;  width: 3px; height: 3px; }
        .dot-8  { left: 42%; bottom: 0; animation-delay: 0.05s; --drift: -6px;  width: 4px; height: 4px; }
        .dot-9  { left: 58%; bottom: 0; animation-delay: 0.4s;  --drift: 16px;  }
        .dot-10 { left: 72%; bottom: 0; animation-delay: 0.18s; --drift: -18px; width: 5px; height: 5px; }
        .dot-11 { left: 92%; bottom: 0; animation-delay: 0.32s; --drift: 8px;   width: 3px; height: 3px; }
        .success-icon-wrap { display: inline-flex; justify-content: center; align-items: center; width: 88px; height: 88px; background: rgba(0,0,0,0.015); border: 1px solid var(--border-glass); border-radius: 50%; margin-bottom: 20px; }
        .animated-check .check-circle { stroke-dasharray: 160; stroke-dashoffset: 160; animation: drawCircle 0.6s cubic-bezier(0.65,0,0.35,1) 0.2s forwards; fill: none; }
        .animated-check .check-path { stroke-dasharray: 36; stroke-dashoffset: 36; animation: drawCheck 0.4s cubic-bezier(0.65,0,0.35,1) 0.65s forwards; }
        .success-title { font-size: 1.65rem; font-weight: 700; letter-spacing: -0.02em; margin-bottom: 6px; }
        .success-desc { font-size: 0.88rem; color: var(--text-secondary); margin-bottom: 28px; }
        .receipt-box { background: rgba(0,0,0,0.015); border: 1px solid var(--border-glass); border-left: 3px solid var(--text-primary); border-radius: 10px; padding: 20px 22px; margin-bottom: 28px; text-align: left; }
        .receipt-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid rgba(0,0,0,0.04); }
        .receipt-row:last-of-type { border-bottom: none; }
        .receipt-label { font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.08em; }
        .receipt-value { font-size: 0.88rem; font-weight: 500; color: var(--text-primary); }
        .receipt-value-strong { font-family: var(--font-mono); font-weight: 700; font-size: 1rem; color: var(--text-primary); }
        .receipt-msg { margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(0,0,0,0.04); }
        .receipt-msg-text { margin-top: 6px; font-size: 0.84rem; color: var(--text-secondary); font-style: italic; }
        .reset-btn { width: 100%; padding: 14px; border-radius: 10px; font-weight: 600; }
        .tip-error-banner { background: rgba(229,62,62,0.06); border: 1px solid rgba(229,62,62,0.25); border-radius: 8px; padding: 10px 14px; font-size: 0.82rem; color: #c53030; text-align: center; }
        .tx-link { display: inline-flex; align-items: center; gap: 5px; font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-muted); text-decoration: none; margin-bottom: 12px; opacity: 0.7; transition: opacity 0.2s; }
        .tx-link:hover { opacity: 1; }

        @media (max-width: 480px) {
          .tip-card { padding: 24px; border-radius: 16px; }
          .creator-title { font-size: 1.35rem; }
          .preset-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </div>
  );
}
