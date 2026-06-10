'use client';

import { useState } from 'react';
import { Copy, Check, QrCode, Code, User, MessageSquare, Download, Loader2, Heart } from 'lucide-react';
import type { Creator, Tip } from '@/providers/CreatorProvider';

interface DashboardViewProps {
  creatorInfo: Creator;
  setCreatorInfo: (info: Creator) => void;
  tips: Tip[];
  onSaveProfile: (profile: Creator) => Promise<void>;
  isOnChain?: boolean;
  regStatus?: 'idle' | 'pending' | 'success' | 'error';
  regError?: string | null;
  gBalance?: number | null;
  balanceLoading?: boolean;
}

const BIO_MAX = 280;

export default function DashboardView({
  creatorInfo, setCreatorInfo, tips, onSaveProfile,
  isOnChain, regStatus, regError, gBalance, balanceLoading,
}: DashboardViewProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedWidget, setCopiedWidget] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const tipLink = `${origin}/tip/${creatorInfo.username || 'username'}`;
  const widgetCode = `<iframe src="${origin}/widget/${creatorInfo.username || 'username'}" width="350" height="500" style="border:1px solid #e5e5e5;border-radius:16px;"></iframe>`;

  const copy = (text: string, isWidget = false) => {
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
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(tipLink)}&format=png`;
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

  const balanceDisplay = balanceLoading && gBalance == null
    ? '…'
    : gBalance != null
      ? gBalance.toLocaleString(undefined, { maximumFractionDigits: 2 })
      : '—';

  const stats = [
    { label: 'Wallet balance', value: balanceDisplay, suffix: 'G$', live: true },
    { label: 'Total received', value: totalTips.toLocaleString(), suffix: 'G$' },
    { label: 'Tips', value: String(tips.length) },
    { label: 'Average tip', value: String(avgTip), suffix: 'G$' },
  ];

  const inputClass =
    'w-full rounded-lg border border-line bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors focus:border-foreground/40 outline-none';

  return (
    <div className="mx-auto flex max-w-5xl animate-fade-up flex-col gap-6">
      {/* Greeting + tip link */}
      <div className="flex items-end justify-between gap-6 max-md:flex-col max-md:items-stretch">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight">
            {creatorInfo.name ? `Hello, ${creatorInfo.name.split(' ')[0]}` : 'Welcome'}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Track earnings and manage your tipping profile.
          </p>
        </div>

        <div className="flex h-10 max-w-md flex-1 items-center gap-1 rounded-xl border border-line bg-card pl-3.5 pr-1 max-md:max-w-none">
          <span className="min-w-0 flex-1 truncate font-mono text-xs text-muted-foreground">
            {creatorInfo.username ? tipLink : 'Set a username to activate your link'}
          </span>
          <button
            onClick={() => copy(tipLink)}
            disabled={!creatorInfo.username}
            className="flex h-8 shrink-0 items-center gap-1.5 rounded-lg bg-primary px-3 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-30"
          >
            {copiedLink ? <Check size={13} /> : <Copy size={13} />}
            {copiedLink ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 max-lg:grid-cols-2">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-line bg-card p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground">{s.label}</p>
              {s.live && (
                <span className="flex items-center gap-1 rounded-full bg-success-bg px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-success">
                  <span className="h-1 w-1 animate-pulse rounded-full bg-success" />
                  Live
                </span>
              )}
            </div>
            <p className="mt-2 font-display text-2xl font-bold tracking-tight">
              {s.value}
              {s.suffix && <span className="ml-1 text-sm font-medium text-muted-foreground">{s.suffix}</span>}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-5 gap-6 max-lg:grid-cols-1">
        {/* Profile settings */}
        <section className="col-span-3 rounded-xl border border-line bg-card p-6 max-lg:col-span-1">
          <div className="mb-5 flex items-center gap-2.5">
            <User size={17} className="text-muted-foreground" />
            <h3 className="font-display text-[15px] font-semibold">Profile</h3>
            {isOnChain && (
              <span className="ml-auto rounded-full bg-accent px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wide text-accent-foreground">
                On-chain
              </span>
            )}
          </div>

          <form onSubmit={handleSave} className="flex flex-col gap-4">
            <div>
              <label htmlFor="name" className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                Display name
              </label>
              <input id="name" name="name" type="text" value={creatorInfo.name || ''} onChange={handleInputChange} placeholder="e.g. Nuwayama" className={inputClass} />
            </div>

            <div>
              <label htmlFor="username" className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                Username
              </label>
              <div className="flex items-center overflow-hidden rounded-lg border border-line bg-background transition-colors focus-within:border-foreground/40">
                <span className="pl-3.5 font-mono text-sm text-muted-foreground/60">tip/</span>
                <input id="username" name="username" type="text" value={creatorInfo.username || ''} onChange={handleInputChange} placeholder="username" className="w-full bg-transparent px-1.5 py-2.5 text-sm outline-none placeholder:text-muted-foreground/60" />
              </div>
            </div>

            <div>
              <div className="mb-1.5 flex items-baseline justify-between">
                <label htmlFor="bio" className="text-xs font-semibold text-muted-foreground">Bio</label>
                <span className={`font-mono text-[10px] ${bioLength > BIO_MAX ? 'text-danger' : 'text-muted-foreground/60'}`}>
                  {bioLength}/{BIO_MAX}
                </span>
              </div>
              <textarea id="bio" name="bio" value={creatorInfo.bio || ''} onChange={handleInputChange} maxLength={BIO_MAX + 20} placeholder="What does fan support help you achieve?" className={`${inputClass} min-h-22 resize-y`} />
            </div>

            <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
              <div>
                <label htmlFor="youtube" className="mb-1.5 block text-xs font-semibold text-muted-foreground">YouTube</label>
                <input id="youtube" name="youtube" type="text" value={creatorInfo.youtube || ''} onChange={handleInputChange} placeholder="Channel URL" className={inputClass} />
              </div>
              <div>
                <label htmlFor="twitter" className="mb-1.5 block text-xs font-semibold text-muted-foreground">Twitter / X</label>
                <input id="twitter" name="twitter" type="text" value={creatorInfo.twitter || ''} onChange={handleInputChange} placeholder="Profile URL" className={inputClass} />
              </div>
            </div>

            {creatorInfo.wallet_address && (
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Celo wallet</label>
                <input type="text" readOnly value={creatorInfo.wallet_address} className={`${inputClass} cursor-default font-mono text-xs text-muted-foreground`} />
              </div>
            )}

            {regError && (
              <p className="rounded-lg bg-danger-bg px-3.5 py-2.5 text-xs font-medium text-danger">{regError}</p>
            )}

            <button
              type="submit"
              disabled={saving || regStatus === 'pending'}
              className={`mt-1 flex h-10 w-fit items-center gap-2 rounded-lg px-5 text-sm font-semibold transition-all disabled:opacity-60 ${
                saveSuccess ? 'bg-success text-white' : 'bg-primary text-primary-foreground hover:opacity-90'
              }`}
            >
              {regStatus === 'pending' ? (<><Loader2 size={15} className="animate-spin" />Confirm in wallet…</>)
                : saving ? (<><Loader2 size={15} className="animate-spin" />Saving…</>)
                : saveSuccess ? (<><Check size={15} />Saved</>)
                : isOnChain ? 'Save changes' : 'Register & save'}
            </button>
          </form>
        </section>

        {/* Right column — QR + widget */}
        <div className="col-span-2 flex flex-col gap-6 max-lg:col-span-1">
          <section className="rounded-xl border border-line bg-card p-6">
            <div className="mb-4 flex items-center gap-2.5">
              <QrCode size={17} className="text-muted-foreground" />
              <h3 className="font-display text-[15px] font-semibold">QR code</h3>
            </div>
            <div className="flex items-center gap-4">
              <div className="shrink-0 rounded-xl border border-line bg-white p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(tipLink)}`}
                  alt="Tipping QR code"
                  className="h-24 w-24"
                />
              </div>
              <div className="min-w-0">
                <p className="truncate font-mono text-sm font-semibold">@{creatorInfo.username || 'username'}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">Scan to tip in G$</p>
                <button
                  onClick={handleDownloadQR}
                  className="mt-3 flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-xs font-semibold transition-colors hover:border-foreground/30"
                >
                  <Download size={12} />
                  Download
                </button>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-line bg-card p-6">
            <div className="mb-4 flex items-center gap-2.5">
              <Code size={17} className="text-muted-foreground" />
              <h3 className="font-display text-[15px] font-semibold">Embed widget</h3>
            </div>
            <pre className="mb-3 max-h-28 overflow-auto rounded-lg bg-muted p-3 font-mono text-[11px] leading-relaxed whitespace-pre-wrap break-all text-muted-foreground">
              {widgetCode}
            </pre>
            <button
              onClick={() => copy(widgetCode, true)}
              className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-line py-2 text-xs font-semibold transition-colors hover:border-foreground/30"
            >
              {copiedWidget ? <><Check size={13} />Copied</> : <><Copy size={13} />Copy HTML</>}
            </button>
          </section>
        </div>
      </div>

      {/* Tips ledger */}
      <section className="rounded-xl border border-line bg-card p-6">
        <div className="mb-4 flex items-center gap-2.5">
          <MessageSquare size={17} className="text-muted-foreground" />
          <h3 className="font-display text-[15px] font-semibold">Recent tips</h3>
        </div>

        {tips.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-12 text-center">
            <Heart size={28} className="text-muted-foreground/30" />
            <p className="text-sm font-semibold">No tips yet</p>
            <p className="text-xs text-muted-foreground">Share your link to start receiving G$.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-line text-[11px] uppercase tracking-wider text-muted-foreground">
                  <th className="pb-2.5 pr-4 font-semibold">From</th>
                  <th className="pb-2.5 pr-4 font-semibold">Message</th>
                  <th className="pb-2.5 pr-4 font-semibold">Amount</th>
                  <th className="pb-2.5 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                {tips.map((tip) => (
                  <tr key={tip.id || tip.created_at} className="border-b border-line/60 last:border-0">
                    <td className="py-3 pr-4">
                      <p className="font-semibold">{tip.sender_name}</p>
                      {tip.sender_address && (
                        <p className="font-mono text-[11px] text-muted-foreground">
                          {tip.sender_address.slice(0, 6)}…{tip.sender_address.slice(-4)}
                        </p>
                      )}
                    </td>
                    <td className="max-w-xs py-3 pr-4 text-muted-foreground italic">
                      {tip.message ? `"${tip.message}"` : '—'}
                    </td>
                    <td className="py-3 pr-4">
                      <span className="rounded-full bg-accent px-2.5 py-0.5 font-mono text-xs font-bold text-accent-foreground">
                        +{tip.amount} G$
                      </span>
                    </td>
                    <td className="whitespace-nowrap py-3 text-xs text-muted-foreground">
                      {tip.created_at ? new Date(tip.created_at).toLocaleString() : ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
