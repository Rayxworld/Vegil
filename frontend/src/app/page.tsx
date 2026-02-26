import type { ReactNode } from 'react';
import Link from 'next/link';
import WaitlistSignup from '@/components/WaitlistSignup';

const heroStats = [
  { label: 'Avg. response', value: '0.32s', detail: 'from signal to containment' },
  { label: 'Signals correlated', value: '36', detail: 'per asset snapshot' },
  { label: 'Global nodes', value: '12', detail: 'monitoring 24/7' },
];

const flowSteps = [
  {
    title: 'Signal Intake',
    desc: 'Link, email, and X inputs converge into one ledger that mirrors your infrastructure.',
  },
  {
    title: 'Context Matching',
    desc: 'Temporal fingerprinting matches every asset with historical threats and trust anchors.',
  },
  {
    title: 'Human Review',
    desc: 'Analysts validate the AI’s verdicts before any mitigation notice leaves the platform.',
  },
];

const proofPoints = [
  {
    label: 'Synthetic targets neutralized',
    value: '3,812',
    detail: 'last quarter, curated by our Blue Team',
  },
  {
    label: 'Avg. false positives dropped',
    value: '72%',
    detail: 'since we added behavior envelopes',
  },
  {
    label: 'Days of uptime',
    value: '998',
    detail: 'across sandy bridge, base, and arbitrum',
  },
];

const featureTiles = [
  {
    title: 'Covert Link Intercept',
    desc: 'We mirror every DOM render to confirm a link’s intent before your user sees it.',
  },
  {
    title: 'Encrypted Verification',
    desc: 'Non-repudiable logs and readouts ensure auditors can trace each conclusion.',
  },
  {
    title: 'Behavioral Analysis',
    desc: 'Urgency, sentiment, and automation cues converge into a single trust score.',
  },
];

const ArrowButton = ({ children, href }: { children: ReactNode; href: string }) => (
  <Link
    href={href}
    className="inline-flex items-center gap-2 rounded-full bg-amber-200 px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-slate-900 transition hover:bg-amber-100"
  >
    {children}
    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-950/70 text-xs font-bold text-white">
      →
    </span>
  </Link>
);

const PulseIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
    <circle cx="20" cy="20" r="18" stroke="#c7b28b" strokeWidth="2" opacity="0.5" />
    <path
      d="M6 25.5L12 14L16 22L21 12L26 24L30 19L34 27"
      stroke="#c7b28b"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#030711] text-white">
      <div className="mesh-bg" />

      <section className="container mx-auto px-6 pt-24 pb-16">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-8">
            <p className="text-xs uppercase tracking-[0.4em] text-amber-200">SheildGuard</p>
            <h1 className="text-4xl font-black leading-tight tracking-tight lg:text-6xl">
              Security leadership for Web3 teams that treat threats like state actors.
            </h1>
            <p className="max-w-3xl text-lg text-gray-300">
              We blend deterministic instrumentation with curated human reviews so every alert feels
              rigorous, intentional, and actionable—no glossy buzzwords, just missions protected.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <ArrowButton href="/dashboard">Launch Platform</ArrowButton>
              <ArrowButton href="#mission">View Mission</ArrowButton>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {heroStats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-3xl border border-white/10 bg-slate-950/70 p-4 text-sm"
                >
                  <p className="text-xs uppercase tracking-[0.3em] text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-black text-white">{stat.value}</p>
                  <p className="text-xs text-gray-400">{stat.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative rounded-[32px] border border-white/5 bg-slate-950/80 p-6 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.9)]">
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-gray-400">
              <span>Signal Deck</span>
              <span className="text-amber-200 font-semibold">Live</span>
            </div>
            <div className="mt-6 space-y-8">
              <div className="flex items-center gap-4">
                <PulseIcon />
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-gray-500">Live threat pulse</p>
                  <p className="text-3xl font-black">02:18</p>
                </div>
              </div>
              <div className="space-y-3 text-sm text-gray-300">
                <p>Signal convergence is humming at 83% confidence.</p>
                <p>Next analyst shift syncs in 11 minutes.</p>
              </div>
              <div className="h-1 w-full rounded-full bg-white/5">
                <div className="h-full w-[74%] rounded-full bg-amber-200" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="mission" className="container mx-auto px-6 py-12">
        <div className="flex flex-col gap-4 text-center">
          <p className="text-xs uppercase tracking-[0.5em] text-amber-200">Signal Flow</p>
          <h2 className="text-3xl font-black">We choreograph signal, context, and human insight.</h2>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {flowSteps.map((step) => (
            <article key={step.title} className="rounded-[28px] border border-white/5 bg-slate-950/70 p-6">
              <h3 className="text-lg font-semibold text-white">{step.title}</h3>
              <p className="mt-3 text-sm text-gray-400 leading-relaxed">{step.desc}</p>
              <div className="mt-5 h-[2px] w-10 rounded-full bg-gray-700" />
            </article>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-6 py-12">
        <div className="grid gap-6 lg:grid-cols-3">
          {proofPoints.map((point) => (
            <div
              key={point.label}
              className="rounded-[28px] border border-white/5 bg-slate-950/60 p-6 text-sm shadow-[0_20px_40px_-25px_rgba(0,0,0,0.9)]"
            >
              <p className="text-xs uppercase tracking-[0.4em] text-gray-500">{point.label}</p>
              <p className="mt-3 text-3xl font-black text-white">{point.value}</p>
              <p className="text-xs text-gray-400">{point.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-6 py-12">
        <div className="flex flex-col gap-4 text-center">
          <p className="text-xs uppercase tracking-[0.5em] text-amber-200">Proof in action</p>
          <h2 className="text-3xl font-black">Our narrative beats the clipboard talk.</h2>
          <p className="text-gray-400 max-w-3xl mx-auto">
            The SheildGuard team publishes curated write-ups, hosts analyst reviews, and keeps the
            community looped in on every module release.
          </p>
        </div>
        <div className="mt-8 grid gap-8 md:grid-cols-3">
          {featureTiles.map((feature) => (
            <article key={feature.title} className="rounded-[30px] border border-white/10 bg-slate-950/80 p-6">
              <div className="flex items-center justify-between">
                <span className="text-sm uppercase tracking-[0.4em] text-gray-500">Module</span>
                <span className="text-xs font-semibold text-amber-200">Built in-house</span>
              </div>
              <h3 className="mt-5 text-2xl font-black">{feature.title}</h3>
              <p className="mt-4 text-sm text-gray-400 leading-relaxed">{feature.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-6 py-12">
        <WaitlistSignup />
      </section>

      <section id="pricing" className="container mx-auto px-6 py-12">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.5em] text-amber-200">Offers</p>
          <h2 className="text-3xl font-black">Pick the guard that fits your mission</h2>
        </div>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          <PricingCard
            title="Explorer"
            price="0"
            features={['Basic Link Scanning', 'Community Support', 'Manual Account Check']}
          />
          <PricingCard
            title="Sentinel"
            price="12"
            popular
            features={['Advanced AI Analysis', 'X-Risk Monitoring (Coming Soon)', 'Priority API Access', 'Email Guard']}
          />
          <PricingCard
            title="Guardian"
            price="45"
            features={['Real-time Stream Alerts', 'Insurance Coverage', 'API For Developers', '24/7 Forensic Support']}
          />
        </div>
      </section>

      <footer className="border-t border-white/5 bg-slate-950/80 px-6 py-10 text-center text-sm text-gray-400">
        © 2026 SheildGuard. Decentralized security for critical infrastructure.
      </footer>
    </div>
  );
}

function PricingCard({ title, price, features, popular }: any) {
  return (
    <div
      className={`glass-card p-6 sm:p-8 space-y-6 border ${popular ? 'border-amber-200/50 bg-amber-200/5 text-slate-900' : 'border-white/10 bg-slate-950/70'
        }`}
    >
      {popular && (
        <div className="text-xs font-black uppercase tracking-[0.3em] text-amber-200">Most Popular</div>
      )}
      <h3 className="text-xl font-black uppercase tracking-[0.3em] text-gray-400">{title}</h3>
      <p className="text-4xl font-black">${price}</p>
      <ul className="space-y-3 text-sm text-gray-300">
        {features.map((feature: string) => (
          <li key={feature} className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-amber-200" />
            {feature}
          </li>
        ))}
      </ul>
      <Link
        href="/dashboard"
        className={`block rounded-full border border-white/10 px-5 py-3 text-center text-xs font-semibold uppercase tracking-[0.3em] transition ${popular ? 'bg-amber-200 text-slate-900' : 'hover:bg-white/10'}`}
      >
        Choose plan
      </Link>
    </div>
  );
}
