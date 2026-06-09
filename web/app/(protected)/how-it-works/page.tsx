'use client';

export default function HowItWorksPage() {
  return (
    <div className="how-it-works-wrap">
      <span className="tag-mono">Platform Guide</span>
      <h1 className="page-title">How it Works</h1>

      <div className="glass-card info-card">
        <h3>The Creator Ecosystem</h3>
        <p>
          The GoodDollar Tip Jar lets anyone support creators directly using G$ — the
          Universal Basic Income token on the Celo blockchain. Tips flow peer-to-peer,
          with no middlemen and zero platform fees.
        </p>

        <div className="steps-flow">
          {[
            {
              n: '01',
              title: 'Sign In & Register',
              desc: 'Connect your wallet via Privy. Your Celo address is your on-chain tipping identity. Pick a username — it gets registered to the TipJarRegistry smart contract.',
            },
            {
              n: '02',
              title: 'Share Your Page',
              desc: 'Copy your tipping link or QR code and share it anywhere — streams, bios, newsletters. Embed the iframe widget directly on your website.',
            },
            {
              n: '03',
              title: 'Earn Peer-to-Peer',
              desc: 'Fans approve G$ and call sendTip() on-chain. G$ goes directly from their wallet to yours via the Celo blockchain — instant, transparent, fee-free.',
            },
          ].map((s) => (
            <div key={s.n} className="flow-step">
              <div className="step-num">{s.n}</div>
              <h4>{s.title}</h4>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card info-card">
        <h3>Smart Contract</h3>
        <p>
          The <strong>TipJarRegistry</strong> contract is deployed on Celo Mainnet.
          It handles creator registration and routes tips directly wallet-to-wallet — no funds are
          ever held by the contract.
        </p>
        <div className="contract-detail">
          <span className="contract-label">Contract address</span>
          <a
            href="https://celoscan.io/address/0x9c69aa76f0D565eC514563E36bf9371ba7E74F05"
            target="_blank"
            rel="noopener noreferrer"
            className="contract-addr"
          >
            0x9c69aa76f0D565eC514563E36bf9371ba7E74F05 ↗
          </a>
        </div>
        <div className="contract-detail">
          <span className="contract-label">G$ token (Celo)</span>
          <a
            href="https://celoscan.io/address/0x62B8b11039fcfe5Ab0c56E502B1c372a3d2a9C14"
            target="_blank"
            rel="noopener noreferrer"
            className="contract-addr"
          >
            0x62B8b11039fcfe5Ab0c56E502B1c372a3d2a9C14 ↗
          </a>
        </div>
      </div>

      <style>{`
        .how-it-works-wrap { max-width: 860px; margin: 0 auto; }
        .page-title { font-family: var(--font-mono); font-size: 2rem; margin-bottom: 24px; margin-top: 6px; }
        .info-card { margin-bottom: 24px; }
        .info-card h3 { font-family: var(--font-mono); margin-bottom: 12px; text-transform: uppercase; font-size: 0.85rem; letter-spacing: 0.1em; }
        .info-card > p { color: var(--text-secondary); line-height: 1.7; margin-bottom: 28px; }
        .steps-flow { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        .flow-step { position: relative; background: rgba(255,255,255,0.4); border: 1px solid var(--border-glass); border-radius: 12px; padding: 20px; }
        .step-num { font-family: var(--font-mono); font-size: 2.2rem; font-weight: 700; color: rgba(0,0,0,0.04); position: absolute; top: 10px; right: 14px; line-height: 1; }
        .flow-step h4 { font-size: 0.95rem; font-weight: 600; margin-bottom: 8px; position: relative; z-index: 1; }
        .flow-step p { font-size: 0.82rem; color: var(--text-secondary); line-height: 1.6; margin: 0; position: relative; z-index: 1; }
        .contract-detail { display: flex; align-items: center; gap: 16px; padding: 12px 0; border-bottom: 1px solid var(--border-glass); }
        .contract-detail:last-child { border-bottom: none; }
        .contract-label { font-family: var(--font-mono); font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-muted); flex-shrink: 0; min-width: 140px; }
        .contract-addr { font-family: var(--font-mono); font-size: 0.78rem; color: var(--text-secondary); word-break: break-all; border-bottom: none; }
        .contract-addr:hover { color: var(--text-primary); border-bottom: none; }
        @media (max-width: 768px) { .steps-flow { grid-template-columns: 1fr; } .contract-detail { flex-direction: column; align-items: flex-start; gap: 4px; } }
      `}</style>
    </div>
  );
}
