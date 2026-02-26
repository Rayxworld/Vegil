'use client';

import { FormEvent, useEffect, useState } from 'react';

const STATUS_MESSAGE: Record<'idle' | 'success' | 'error', string> = {
  idle: '',
  success: 'You are on the waitlist. We will send an invite shortly.',
  error: 'Enter a valid email or try again later.',
};

export default function WaitlistSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [countData, setCountData] = useState({ count: 0, capacity: 2000 });

  useEffect(() => {
    fetch('/api/waitlist/status')
      .then((res) => res.json())
      .then((data) => {
        if (data?.count && data?.capacity) {
          setCountData({ count: data.count, capacity: data.capacity });
        }
      })
      .catch(() => {
        setCountData({ count: 0, capacity: 2000 });
      });
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage(STATUS_MESSAGE.error);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/waitlist/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      setStatus(data.success ? 'success' : 'error');
      setMessage(data.message || STATUS_MESSAGE[data.success ? 'success' : 'error']);
      if (data?.count) {
        setCountData((prev) => ({
          capacity: prev.capacity,
          count: Number(data.count),
        }));
      }
    } catch (error) {
      console.error('Waitlist submit error', error);
      setStatus('error');
      setMessage(STATUS_MESSAGE.error);
    } finally {
      setLoading(false);
      setEmail('');
    }
  };

  const progress = Math.min(
    Math.round((countData.count / countData.capacity) * 100),
    100
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-card border-amber-200/20 bg-slate-950/60 p-6 sm:p-8 rounded-3xl max-w-3xl mx-auto space-y-6"
    >
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.4em] text-amber-200 mb-2">
          Access Priority (2,000 seats)
        </p>
        <h3 className="text-2xl sm:text-3xl font-black">
          Secure a slot on the SheildGuard waitlist
        </h3>
        <p className="text-gray-400 text-sm sm:text-base mt-1">
          {Math.min(countData.count, countData.capacity).toLocaleString()} of {countData.capacity.toLocaleString()} seats
          claimed. We are capping the first wave at 2,000 operators.
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-gray-400">
          <span>Waitlist filled</span>
          <span className="flex-1 bg-white/5 h-1 rounded-full shadow-inner">
            <span
              className="block h-1 rounded-full bg-amber-200"
              style={{ width: `${progress}%` }}
            />
          </span>
          <span>{progress}%</span>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setStatus('idle');
              setMessage('');
            }}
            placeholder="you@email.com"
            className="flex-1 bg-white/5 border border-white/10 rounded-full px-5 py-4 focus:outline-none focus:ring-2 focus:ring-amber-300 transition"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center px-6 py-4 rounded-full bg-amber-200 text-slate-900 font-bold hover:bg-amber-100 transition disabled:opacity-60"
          >
            {loading ? 'Saving...' : 'Join Waitlist'}
          </button>
        </div>
      </div>

      {message && (
        <p
          className={`text-sm ${status === 'success' ? 'text-green-400' : 'text-red-400'}`}
        >
          {message}
        </p>
      )}
    </form>
  );
}
