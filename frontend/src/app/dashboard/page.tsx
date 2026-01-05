"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { 
  Shield, Mail, Globe, Twitter, AlertTriangle, CheckCircle, Search, 
  ArrowLeft, Cpu, Zap, Lock, Crown, Info, RefreshCw
} from 'lucide-react';
import SubscribeButton from '@/components/SubscribeButton';

export default function Dashboard() {
  const { isConnected, address } = useAccount();
  const [activeTab, setActiveTab] = useState<'link' | 'email' | 'x' | 'premium'>('link');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [systemStatus, setSystemStatus] = useState<any>(null);

  // Form states
  const [url, setUrl] = useState('');
  const [emailContent, setEmailContent] = useState('');
  const [xHandle, setXHandle] = useState('');
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://vigil-backend.onrender.com';

  useEffect(() => {
    async function fetchStatus() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/scans/status`);
        const data = await res.json();
        setSystemStatus(data);
      } catch (err) {
        console.error("Failed to fetch system status:", err);
      }
    }
    fetchStatus();
  }, [API_BASE_URL]);

  const handleScan = async () => {
    setLoading(true);
    setResult(null);
    
    let endpoint = "";
    let body = {};
    
    if (activeTab === 'link') {
      endpoint = "link";
      body = { url };
    } else if (activeTab === 'email') {
      endpoint = "email";
      body = { content: emailContent };
    } else {
      endpoint = "x-risk";
      body = { handle: xHandle };
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/scans/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      console.error("Scan error:", err);
      setResult({ error: "Connection to security engine failed.", details: err?.message || String(err) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-gray-100 pb-20 pt-28 px-6">
      <div className="mesh-bg opacity-50" />
      
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-extrabold tracking-tight">Security Command Center</h1>
            <p className="text-gray-400">Manage your digital defense and analyze incoming threats.</p>
          </div>
          
          <div className="flex items-center space-x-4">
            {systemStatus && (
              <div className="flex items-center space-x-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-2 backdrop-blur-md">
                 <div className="relative">
                   <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                   <div className="absolute top-0 left-0 w-2 h-2 bg-green-400 rounded-full animate-ping opacity-50" />
                 </div>
                 <span className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                   <Cpu className="w-3.5 h-3.5" />
                   {systemStatus.active_service} Online
                 </span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <TabButton active={activeTab === 'link'} onClick={() => setActiveTab('link')} icon={<Globe />} label="Link Filter" />
          <TabButton active={activeTab === 'email'} onClick={() => setActiveTab('email')} icon={<Mail />} label="Email Guard" />
          <TabButton active={activeTab === 'x'} onClick={() => setActiveTab('x')} icon={<Twitter />} label="X Analysis" />
          <TabButton 
            active={activeTab === 'premium'} 
            onClick={() => setActiveTab('premium')} 
            icon={<Crown className={activeTab === 'premium' ? 'text-yellow-400' : ''} />} 
            label="Sentinel Premium" 
            special
          />
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-[1fr_400px] gap-8">
          
          <div className="space-y-8">
            {activeTab === 'premium' ? (
              <PremiumView isConnected={isConnected} walletAddress={address} />
            ) : (
              <div className="glass-card p-6 sm:p-8 md:p-12 min-h-[500px] flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-white/5 rounded-2xl border border-white/10 shrink-0">
                      {activeTab === 'link' && <Globe className="text-cyan-400" />}
                      {activeTab === 'email' && <Mail className="text-purple-400" />}
                      {activeTab === 'x' && <Twitter className="text-blue-400" />}
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold leading-tight">
                        {activeTab === 'link' && 'Link Integrity Check'}
                        {activeTab === 'email' && 'Deep Content Analysis'}
                        {activeTab === 'x' && 'Social Reputation Score'}
                      </h2>
                      <p className="text-xs sm:text-sm text-gray-500">Analysis provided by Vigil AI Layer 2</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {activeTab === 'link' && (
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-400 uppercase">Target URL</label>
                        <input 
                          type="text" 
                          value={url}
                          onChange={(e) => setUrl(e.target.value)}
                          placeholder="https://suspicious-site.com"
                          className="w-full bg-slate-950/50 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-cyan-500 outline-none transition"
                        />
                      </div>
                    )}

                    {activeTab === 'email' && (
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-400 uppercase">Input Text / Raw Headers</label>
                        <textarea 
                          value={emailContent}
                          onChange={(e) => setEmailContent(e.target.value)}
                          placeholder="Paste email content or headers..."
                          className="w-full bg-slate-950/50 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-purple-500 outline-none transition h-48 resize-none"
                        />
                      </div>
                    )}

                    {activeTab === 'x' && (
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-400 uppercase">X Handle</label>
                        <div className="relative">
                          <span className="absolute left-4 top-4 text-gray-500 font-bold">@</span>
                          <input 
                            type="text" 
                            value={xHandle}
                            onChange={(e) => setXHandle(e.target.value)}
                            placeholder="username"
                            className="w-full bg-slate-950/50 border border-white/10 rounded-2xl p-4 pl-10 text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <button 
                  onClick={handleScan}
                  disabled={loading}
                  className="w-full mt-10 btn-primary py-5 rounded-2xl font-bold text-lg flex items-center justify-center disabled:opacity-50"
                >
                  {loading ? (
                    <RefreshCw className="animate-spin mr-3" />
                  ) : (
                    <Search className="mr-3" />
                  )}
                  {loading ? 'Initializing Neural Scan...' : 'Execute Security Scan'}
                </button>
              </div>
            )}
          </div>

          {/* Results Area */}
          <div className="space-y-6">
            <div className="glass-card p-6 sm:p-8 min-h-[400px] border-cyan-500/10">
              <h3 className="font-bold flex items-center gap-2 mb-6">
                <Shield className="w-4 h-4 text-cyan-400" />
                Live Analysis Output
              </h3>

              {!result && !loading && (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50 py-20">
                  <div className="p-5 bg-white/5 rounded-full border border-white/10">
                    <Lock className="w-8 h-8" />
                  </div>
                  <p className="text-sm px-10">Scan an asset to generate security report</p>
                </div>
              )}

              {loading && (
                <div className="animate-pulse space-y-6">
                  <div className="h-4 bg-white/5 rounded w-3/4" />
                  <div className="h-20 bg-white/5 rounded" />
                  <div className="space-y-2">
                    <div className="h-2 bg-white/5 rounded w-full" />
                    <div className="h-2 bg-white/5 rounded w-5/6" />
                  </div>
                </div>
              )}

              {result && !loading && (
                <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
                  <div className={`p-6 rounded-2xl border ${
                    (result.risk_level === 'High' || result.risk_level === 'Critical') 
                      ? 'bg-red-500/10 border-red-500/20 text-red-400' 
                      : 'bg-green-500/10 border-green-500/20 text-green-400'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Risk Profile</span>
                      <span className="font-bold text-xl">{result.risk_level || (result.suspension_risk > 50 ? 'High' : 'Low')}</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-1000 ${
                          (result.risk_score || result.suspension_risk) > 50 ? 'bg-red-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${result.risk_score || result.suspension_risk || 0}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs px-1">
                      <span className="text-gray-500 font-bold uppercase">Source Engine</span>
                      <span className="text-cyan-400 font-mono tracking-tighter">{result.source}</span>
                    </div>
                    <div className="p-6 bg-slate-950/80 border border-white/5 rounded-2xl space-y-4 shadow-2xl">
                      <p className="text-sm leading-relaxed text-gray-300 italic">
                        "{result.analysis || result.details || result.recommendation}"
                      </p>
                      
                      {result.flags && result.flags.length > 0 && (
                        <div className="pt-4 border-t border-white/5">
                          <p className="text-[10px] font-black text-gray-500 uppercase mb-3 px-1">Detected Indicators</p>
                          <div className="flex flex-wrap gap-2">
                            {result.flags.slice(0, 5).map((f: string, i: number) => (
                              <span key={i} className="text-[10px] bg-red-400/10 text-red-500 border border-red-500/20 font-bold px-2 py-1 rounded-md uppercase">
                                {f}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Tips */}
            <div className="glass-card p-6 border-transparent bg-white/2">
               <h4 className="text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                 <Info className="w-3.5 h-3.5" />
                 Sec-Ops Tip
               </h4>
               <p className="text-xs text-gray-500 leading-relaxed">
                 Vigil's L2 engine analyzes social entropy and urgency patterns. Even if a link has no malicious payload, it can be flagged for social engineering behavior.
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label, special }: any) {
  return (
    <button 
      onClick={onClick}
      className={`group relative overflow-hidden flex items-center justify-center gap-3 p-5 rounded-2xl transition-all border ${
        active 
          ? (special ? 'bg-yellow-400/10 border-yellow-400/50 text-yellow-500' : 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400') 
          : 'bg-white/5 border-white/5 text-gray-500 hover:border-white/10 hover:text-gray-300'
      }`}
    >
      {active && <div className={`absolute bottom-0 left-0 w-full h-[2px] ${special ? 'bg-yellow-400' : 'bg-cyan-400'}`} />}
      <span className="shrink-0">{icon}</span>
      <span className="font-bold tracking-tight text-sm md:text-base">{label}</span>
    </button>
  );
}

function PremiumView({ isConnected, walletAddress }: any) {
  return (
    <div className="glass-card p-6 sm:p-10 md:p-12 border-yellow-500/20 bg-yellow-500/[0.02] flex flex-col items-center justify-center text-center space-y-8 min-h-[500px]">
      <div className="relative">
        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-yellow-400/10 rounded-full flex items-center justify-center border border-yellow-400/20">
          <Crown className="w-10 h-10 sm:w-12 sm:h-12 text-yellow-500 animate-float" />
        </div>
        <div className="absolute -top-2 -right-2 bg-yellow-500 text-black text-[10px] font-black px-2 py-1 rounded-full uppercase">VIP</div>
      </div>
      
      <div className="max-w-md space-y-4">
        <h2 className="text-3xl sm:text-4xl font-black italic tracking-tighter uppercase leading-tight">Sentinel Premium</h2>
        <p className="text-sm sm:text-base text-gray-400">Unlock real-time monitoring, AI-powered forensic reports, and decentralized security vaults.</p>
      </div>

      <div className="w-full max-w-sm space-y-6 pt-4">
        {!isConnected ? (
          <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl text-xs text-orange-200 font-medium">
            Connection required to verify subscription state.
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/5">
              <span className="text-xs text-gray-500 font-bold uppercase">Status</span>
              <span className="text-xs text-red-500 font-black uppercase tracking-widest">Inactive</span>
            </div>
            <SubscribeButton />
          </div>
        )}
      </div>

      <div className="flex gap-4 text-[10px] font-bold text-gray-500 uppercase pt-8">
        <span className="flex items-center gap-1"><Zap className="w-3 h-3"/> 0ms Latency</span>
        <span className="flex items-center gap-1"><Shield className="w-3 h-3"/> 1M USDC Insured</span>
        <span className="flex items-center gap-1"><Globe className="w-3 h-3"/> Global Nodes</span>
      </div>
    </div>
  );
}
