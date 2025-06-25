"use client";

export default function GenerateSecret({ mnemonic }: { mnemonic: string }) {
  return (
    <div className="mt-2 border rounded p-3">
      <h1 className="font-bold text-2xl">Current Secret Phrase</h1>
      <div>
        {mnemonic ? (
          <div className="flex flex-wrap gap-3 mt-4 bg-black ml-6">
            {mnemonic.split(" ").map((word, idx) => (
              <span
                key={idx}
                className="rounded bg-yellow-100 text-black px-3 py-1 font-mono border"
              >
                {word}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-red-500 mt-2">Invalid Secret Phrase</p>
        )}
      </div>
    </div>
  );
}
