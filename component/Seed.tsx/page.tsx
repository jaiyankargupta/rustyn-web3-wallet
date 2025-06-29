import { useState } from "react";

export default function Seed({ seed }: { seed: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="mt-4 border border-gray-700 rounded-lg bg-gray-900 p-5 shadow-lg">
  <h2 className="font-bold text-2xl text-white mb-2">🔑 Seed</h2>

  <p className="text-gray-300 break-words bg-gray-800 p-3 rounded-md text-sm">
    {seed}
  </p>

  <div className="flex justify-end mt-3">
    <button
      className={`px-4 py-1.5 text-sm rounded-md font-medium transition ${
        copied
          ? 'bg-green-600 hover:bg-green-700 text-white'
          : 'bg-blue-600 hover:bg-blue-700 text-white'
      }`}
      onClick={() => {
        navigator.clipboard.writeText(seed);
        setCopied(true);
      }}
      title="Copy seed to clipboard"
    >
      {copied ? '✅ Copied!' : '📋 Copy Seed'}
    </button>
  </div>
</div>

  );
}
