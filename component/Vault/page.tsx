import { BIP32Interface } from "bip32";
import { publicToAddress, toChecksumAddress } from "@ethereumjs/util";
import { useState } from "react";

type Account = {
  index: number;
  address: string;
  privateKey: string;
  publicKey: string;
  path: string;
};

export default function Vault({
  root,
  count = 1,
}: {
  root: BIP32Interface | null;
  count?: number;
}) {
  const [walletCount, setWalletCount] = useState(count);
  const [showPrivateKeys, setShowPrivateKeys] = useState<boolean[]>(
    Array(count).fill(false)
  );

  if (!root) {
    return (
      <div className="mt-2 border rounded p-3">
        <h1 className="font-bold text-3xl">Wallet</h1>
        <div>No wallet available</div>
      </div>
    );
  }

  const accounts: Account[] = [];
  for (let i = 0; i < walletCount; i++) {
    const path = `m/44'/60'/0'/0/${i}`;
    const child = root.derivePath(path);
    if (!child.publicKey || !child.privateKey) continue;
    const pubKey = child.publicKey;
    const addressBuffer = publicToAddress(pubKey, true);
    const address = toChecksumAddress(
      "0x" + Buffer.from(addressBuffer).toString("hex")
    );
    accounts.push({
      index: i,
      address,
      privateKey: Buffer.from(child.privateKey).toString("hex"),
      publicKey: Buffer.from(pubKey).toString("hex"),
      path,
    });
  }

  function togglePrivateKey(idx: number) {
    setShowPrivateKeys((prev) => prev.map((v, i) => (i === idx ? !v : v)));
  }

  function handleAddWallet() {
    setWalletCount((prev) => prev + 1);
    setShowPrivateKeys((prev) => [...prev, false]);
  }

  return (
    <div className="mt-2 border rounded p-3">
      <div className="flex justify-between items-center">
        <h1 className="font-bold text-3xl">Wallets</h1>
        <button
          onClick={handleAddWallet}
          className="ml-4 px-3 py-1 border rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          Add new Wallet
        </button>
      </div>
      <div className="mt-4 space-y-4">
        {accounts.map((acc, idx) => (
          <div key={acc.index} className="border p-3 rounded bg-gray-800">
            <div className="font-bold text-3xl">Account : {acc.index}</div>
            <div>
              <span className="font-semibold"> Address: {acc.address}</span>
            </div>
            <div>
              <span className="font-semibold">Private Key: </span>
              <span className="font-mono text-sm break-all text-red-400">
                {showPrivateKeys[idx] ? acc.privateKey : "********"}
              </span>
              <button
                onClick={() => togglePrivateKey(idx)}
                className="text-blue-400 underline"
              >
                {showPrivateKeys[idx] ? " Hide" : " Show"}
              </button>
            </div>
            <div>
              <span className="font-semibold">Public Key: {acc.publicKey}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
