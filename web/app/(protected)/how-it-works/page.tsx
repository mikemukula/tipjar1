'use client';

import { ExternalLink } from 'lucide-react';

const STEPS = [
  {
    n: '01',
    title: 'Sign in & register',
    desc: 'Connect your wallet via Privy. Pick a username — it gets registered on the TipJarRegistry smart contract on Celo.',
  },
  {
    n: '02',
    title: 'Share your page',
    desc: 'Copy your tipping link or QR code and share it anywhere. Embed the iframe widget directly on your website.',
  },
  {
    n: '03',
    title: 'Earn peer-to-peer',
    desc: 'Fans send G$ directly from their wallet to yours, on-chain. Instant, transparent, and fee-free.',
  },
];

const CONTRACTS = [
  {
    label: 'TipJarRegistry',
    address: '0x9c69aa76f0D565eC514563E36bf9371ba7E74F05',
  },
  {
    label: 'G$ token (Celo)',
    address: '0x62B8b11039fcfe5Ab0c56E502B1c372a3d2a9C14',
  },
];

export default function HowItWorksPage() {
  return (
    <div className="mx-auto flex max-w-3xl animate-fade-up flex-col gap-6">
      <div>
        <h2 className="font-display text-2xl font-bold tracking-tight">How it works</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Direct creator support with G$ — Universal Basic Income on Celo.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 max-md:grid-cols-1">
        {STEPS.map((s) => (
          <div key={s.n} className="rounded-xl border border-line bg-card p-5">
            <span className="font-mono text-xs font-bold text-muted-foreground/50">{s.n}</span>
            <h3 className="mt-2 font-display text-[15px] font-semibold">{s.title}</h3>
            <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">{s.desc}</p>
          </div>
        ))}
      </div>

      <section className="rounded-xl border border-line bg-card p-6">
        <h3 className="font-display text-[15px] font-semibold">Smart contracts</h3>
        <p className="mt-1 text-[13px] text-muted-foreground">
          Tips flow wallet-to-wallet — the contract never holds funds.
        </p>
        <div className="mt-4 flex flex-col">
          {CONTRACTS.map((c) => (
            <a
              key={c.address}
              href={`https://celoscan.io/address/${c.address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between gap-4 border-t border-line py-3 first:border-t-0 max-md:flex-col max-md:items-start max-md:gap-1"
            >
              <span className="shrink-0 text-xs font-semibold text-muted-foreground">{c.label}</span>
              <span className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground transition-colors group-hover:text-foreground">
                {c.address}
                <ExternalLink size={11} className="opacity-50" />
              </span>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
