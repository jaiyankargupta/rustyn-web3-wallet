import { useState } from "react";

export default function Seed({ seed }: { seed: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="mt-2 border rounded p-3">
      <h2 className="font-bold text-2xl">Seed</h2>
      <p className="text-gray-300 break-words">{seed}</p>
      <div className="flex items-center justify-end">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm ml-auto flex items-center"
          onClick={() => {
            navigator.clipboard.writeText(seed);
            setCopied(true);
          }}
          title="Copy seed to clipboard"
        >
          {copied ? "Copied!" : "Click to Copy"}
        </button>
      </div>
    </div>
  );
}
