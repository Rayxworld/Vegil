'use client';

import Link from 'next/link';
import { ArrowRight, Shield } from 'lucide-react';

export default function AboutPage() {
  const values = [
    {
      title: 'Precision at the core',
      desc: 'We treat every signal with contextual fidelity so operators see what truly matters, not noise.',
    },
    {
      title: 'Human-led automation',
      desc: 'AI expedites the work; our analysts steer the conclusions and validate outcomes nightly.',
    },
    {
      title: 'Operational integrity',
      desc: 'Auditable workflows, private data handling, and continuous compliance checks keep trust intact.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#030711]">
      <div className="mesh-bg" />
      <main className="container mx-auto px-6 py-24 space-y-16">
        <section className="space-y-5 max-w-3xl">
          <p className="text-xs uppercase tracking-[0.5em] text-amber-200">About SheildGuard</p>
          <h1 className="text-4xl sm:text-5xl font-black text-white">Why we built the guard</h1>
          <p className="text-gray-400 text-lg leading-relaxed">
            The rising scale of automation attacks demanded a different response. SheildGuard blends
            deterministic instrumentation with curated AI oversight so teams can operate with
            confidence instead of fear.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/dashboard"
              className="btn-primary flex items-center gap-2 font-bold px-6 py-3"
            >
              Explore Platform
              <ArrowRight className="h-4 w-4" />
            </Link>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-3 text-xs uppercase tracking-[0.4em] text-gray-400">
              <Shield className="h-4 w-4 text-amber-200" />
              Rider-led Protocol
            </span>
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-3">
          {values.map((value) => (
            <article
              key={value.title}
              className="rounded-[24px] border border-white/5 bg-slate-900/70 p-6 shadow-lg"
            >
              <h2 className="text-lg font-semibold text-white">{value.title}</h2>
              <p className="mt-3 text-sm text-gray-400 leading-relaxed">{value.desc}</p>
            </article>
          ))}
        </section>

        <section className="rounded-[24px] border border-white/5 bg-slate-950/70 p-8 space-y-6 shadow-xl">
          <h3 className="text-2xl font-black text-white">Operational Transparency</h3>
          <p className="text-gray-400 leading-relaxed">
            We publish weekly status notes, maintain immutable scan logs, and make it simple to
            export findings into your GRC workflow. Every module is tested continuously, and we
            invite partners to shape the roadmap directly through the waitlist and advisory board.
          </p>
        </section>
      </main>
    </div>
  );
}
