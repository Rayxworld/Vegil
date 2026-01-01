import Link from 'next/link';
import { Shield, Mail, Globe, Twitter, ArrowRight, Zap, Lock, Eye, CheckCircle2 } from 'lucide-react';

export default function Home() {
  return (
    <div className="relative pt-24 pb-20">
      <div className="mesh-bg" />
      
      {/* Hero Section */}
      <section className="container mx-auto px-6 text-center space-y-10">
        <div className="inline-flex items-center space-x-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-1.5 mb-6">
          <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse"></span>
          <span className="text-xs font-bold text-cyan-400 tracking-wider uppercase">Live Network Protection</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-8xl font-black tracking-tighter leading-none max-w-5xl mx-auto px-4">
          The <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Invisible Shield</span> for Your Digital Life.
        </h1>
        
        <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed px-6">
          Vigil uses advanced AI to monitor your assets, filter malicious links, and protect your identity in real-time. Secure your Web3 journey today.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 pt-6 px-6">
          <Link href="/dashboard" className="w-full sm:w-auto btn-primary flex items-center justify-center px-8 sm:px-10 py-4 sm:py-5 rounded-2xl text-base sm:text-lg font-bold">
            Launch Platform
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
          <Link href="#pricing" className="w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 rounded-2xl text-base sm:text-lg font-bold border border-white/10 hover:bg-white/5 transition-all text-center">
            View Analytics
          </Link>
        </div>

        <div className="pt-20 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-40 grayscale hover:grayscale-0 transition-all">
          <div className="flex justify-center text-xl font-bold italic tracking-widest uppercase">OpenAI</div>
          <div className="flex justify-center text-xl font-bold italic tracking-widest uppercase">Meta</div>
          <div className="flex justify-center text-xl font-bold italic tracking-widest uppercase">Mistral</div>
          <div className="flex justify-center text-xl font-bold italic tracking-widest uppercase">Google</div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="container mx-auto px-6 mt-40">
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<Zap className="w-8 h-8 text-cyan-400" />}
            title="Real-time Interception"
            desc="Our AI intercepts potential phishing links before they touch your local environment."
          />
          <FeatureCard 
            icon={<Lock className="w-8 h-8 text-purple-400" />}
            title="Encrypted Verification"
            desc="All security scanns are performed in encrypted sandboxes to protect your data."
          />
          <FeatureCard 
            icon={<Eye className="w-8 h-8 text-blue-400" />}
            title="Behavioral Analysis"
            desc="Advanced algorithms detect social engineering patterns that standard filters miss."
          />
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="container mx-auto px-6 mt-40">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Select Your Protection</h2>
          <p className="text-gray-400">Simple, transparent plans for every level of user.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <PricingCard 
            title="Explorer"
            price="0"
            features={["Basic Link Scanning", "Community Support", "Manual Account Check"]}
          />
          <PricingCard 
            title="Sentinel"
            price="12"
            popular
            features={["Advanced AI Analysis", "X-Risk Monitoring", "Priority API Access", "Email Guard"]}
          />
          <PricingCard 
            title="Guardian"
            price="45"
            features={["Real-time Stream Alerts", "Insurance Coverage", "API For Developers", "24/7 Forensic Support"]}
          />
        </div>
      </section>

      <footer className="mt-40 pt-10 border-t border-white/5 text-center text-gray-500 text-sm">
        <p>© 2026 Vigil Protocol. Decentralized Security for the Open Web.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: any) {
  return (
    <div className="glass-card p-6 sm:p-10 space-y-4">
      <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 mb-4 sm:mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-gray-400 leading-relaxed text-sm">{desc}</p>
    </div>
  );
}

function PricingCard({ title, price, features, popular }: any) {
  return (
    <div className={`glass-card p-6 sm:p-10 space-y-8 relative overflow-hidden transition-all duration-500 ${popular ? 'border-cyan-500/50 bg-cyan-500/5 ring-1 ring-cyan-500/20 md:scale-105 z-10' : ''}`}>
      {popular && (
        <div className="absolute top-0 right-0 bg-cyan-500 text-black text-[10px] font-black tracking-tighter px-4 py-1.5 rounded-bl-xl uppercase">
          Most Popular
        </div>
      )}
      <div className="space-y-4">
        <h3 className="font-bold text-gray-400 uppercase tracking-widest text-xs">{title}</h3>
        <div className="flex items-baseline space-x-1">
          <span className="text-4xl font-black">${price}</span>
          <span className="text-gray-500 text-sm">/month</span>
        </div>
      </div>
      
      <ul className="space-y-4">
        {features.map((f: string, i: number) => (
          <li key={i} className="flex items-center text-sm text-gray-300">
            <CheckCircle2 className="w-4 h-4 text-cyan-500 mr-3 shrink-0" />
            {f}
          </li>
        ))}
      </ul>

      <Link href="/dashboard" className={`w-full flex justify-center py-4 rounded-xl text-sm font-bold transition-all ${popular ? 'bg-cyan-500 text-black hover:bg-cyan-400' : 'bg-white/5 hover:bg-white/10'}`}>
        Choose {title}
      </Link>
    </div>
  );
}