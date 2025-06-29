"use client";

export default function GenerateSecret({ mnemonic }: { mnemonic: string }) {
  return (
    <div className="mt-4 border border-gray-700 rounded-lg bg-gray-900 p-5 shadow-md">
  <h1 className="font-bold text-2xl text-white">🧠 Current Secret Phrase</h1>

  <div>
    {mnemonic ? (
      <div className="flex flex-wrap gap-3 mt-4 bg-gray-800 p-4 rounded-md">
        {mnemonic.split(" ").map((word, idx) => (
          <span
            key={idx}
            className="rounded bg-yellow-300 text-black px-3 py-1 font-mono text-sm shadow-sm"
          >
            {word}
          </span>
        ))}
      </div>
    ) : (
      <p className="text-red-400 mt-2">⚠️ Invalid Secret Phrase</p>
    )}
  </div>
</div>

  );
}
