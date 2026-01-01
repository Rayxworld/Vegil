'use client';
import { useState } from 'react';

export default function ScanForm() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');

  const handleScan = async () => {
    const res = await fetch('http://localhost:8000/api/scans/link', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: input }),
    });
    const data = await res.json();
    setResult(JSON.stringify(data, null, 2));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste link, email, or X post URL"
        className="w-full p-4 border rounded-lg h-40"
      />
      <button
        onClick={handleScan}
        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded"
      >
        Scan for Threats
      </button>
      {result && (
        <pre className="mt-8 p-4 bg-gray-100 rounded">{result}</pre>
      )}
    </div>
  );
}