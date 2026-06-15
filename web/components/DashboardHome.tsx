'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Copy, Check, MessageSquare, Heart, ArrowRight } from 'lucide-react';
import { useCreator } from '@/providers/CreatorProvider';
import { useGDollarBalance } from '@/hooks/useGDollarBalance';

export default function DashboardHome() {
  const { creator, tips, tipStats, walletAddress } = useCreator();
  const { balance: gBalance, isLoading: balanceLoading } = useGDollarBalance(walletAddress || undefined);
  const [copied, setCopied] = useState(false);

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const tipLink = `${origin}/tip/${creator.username || 'username'}`;

  const copyLink = () => {
    navigator.clipboard.writeText(tipLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const avgTip = tipStats.receivedCount > 0
    ? Math.round(tipStats.totalReceived / tipStats.receivedCount)
    : 0;

  const balanceDisplay = balanceLoading && gBalance == null
    ? '…'
    : gBalance != null
      ? gBalance.toLocaleString(undefined, { maximumFractionDigits: 2 })
      : '—';

  const stats = [
    { label: 'Wallet balance', value: balanceDisplay, suffix: 'G$', live: true },
    { label: 'Total received', value: tipStats.totalReceived.toLocaleString(), suffix: 'G$' },
    { label: 'Total tipped', value: tipStats.totalTipped.toLocaleString(), suffix: 'G$' },
    { label: 'Average tip', value: String(avgTip), suffix: 'G$' },
  ];

  return (
    <div className="mx-auto flex max-w-5xl animate-fade-up flex-col gap-6">
      {/* Greeting + tip link */}
      <div className="flex items-end justify-between gap-6 max-md:flex-col max-md:items-stretch">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight">
            {creator.name ? `Hello, ${creator.name.split(' ')[0]}` : 'Welcome'}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Your earnings at a glance.
          </p>
        </div>

        <div className="flex h-10 max-w-md flex-1 items-center gap-1 rounded-xl border border-line bg-card pl-3.5 pr-1 max-md:max-w-none">
          <span className="min-w-0 flex-1 truncate font-mono text-xs text-muted-foreground">
            {creator.username ? tipLink : 'Set a username to activate your link'}
          </span>
          <button
            onClick={copyLink}
            disabled={!creator.username}
            className="flex h-8 shrink-0 items-center gap-1.5 rounded-lg bg-primary px-3 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-30"
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Onboarding nudge */}
      {!creator.username && (
        <Link
          href="/settings"
          className="flex items-center justify-between gap-4 rounded-xl border border-line bg-accent/15 px-5 py-4 transition-colors hover:bg-accent/25"
        >
          <div>
            <p className="text-sm font-semibold">Claim your username to start receiving tips</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Register your handle on-chain and set up your public page in Settings.
            </p>
          </div>
          <ArrowRight size={16} className="shrink-0 text-muted-foreground" />
        </Link>
      )}

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
