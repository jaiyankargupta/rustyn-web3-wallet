"use client";
import React, { useState, useEffect, useCallback } from "react";
import * as bip39 from "bip39";
import { BIP32Factory } from "bip32";
import * as ecc from "tiny-secp256k1";
import SecretPhrase from "../component/generateSecret/page";
import Vault from "../component/Vault/page";
import Seed from "@/component/Seed.tsx/page";
import { useRouter } from "next/navigation";
// Initialize BIP32 with ECC
const bip32 = BIP32Factory(ecc);

export default function Home() {
  const [showSecret, setShowSecret] = useState(false);
  const [showVault, setShowVault] = useState(false);
  const [phraseValue, setPhraseValue] = useState("");
  const [mnemonic, setMnemonic] = useState<string>("");
  const [seedValue, setSeedValue] = useState<string>("");

  const [root, setRoot] = useState<ReturnType<typeof bip32.fromSeed> | null>(null);
  const router = useRouter();
  const handleRegister = () => {
    router.push("/register")
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPhraseValue(e.target.value);
    const seedValue = Buffer.from(e.target.value, "hex");
    setSeedValue(seedValue.toString("hex"));

    const root = bip32.fromSeed(seedValue);
    setRoot(root);

    if (showVault === true) {
      setPhraseValue("");
    }
  }

  const generateRandomMnemonic = useCallback(async () => {
    const generatedMnemonic = bip39.generateMnemonic();
    setMnemonic(generatedMnemonic);
    const seed = await bip39.mnemonicToSeed(generatedMnemonic);
    setSeedValue(seed.toString("hex"));
    const root = bip32.fromSeed(seed);
    setRoot(root);
  }, []);

  useEffect(() => {
    if (!phraseValue) {
      generateRandomMnemonic();
    }
  }, [phraseValue, generateRandomMnemonic]);

  return (
    <div className="mt-24 mx-auto max-w-4xl px-6 text-white">
      <div className="mb-10">
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-indigo-400 via-pink-500 to-purple-500 text-transparent bg-clip-text">
          Rustyn Wallet
        </h1>
        <p className="text-lg text-gray-300 mt-2">
          A personal web3 wallet for{" "}
          <span className="text-white font-bold">rustyn-user</span>.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch gap-3 sm:gap-4 w-full">
        <input
          value={phraseValue}
          onChange={(e) => {
            handleInputChange(e);
            setShowSecret(false);
            setShowVault(false);
          }}
          className="flex-1 border border-gray-700 bg-gray-800 px-4 py-2 rounded-md placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          type="text"
          placeholder="Enter your secret phrase (or leave blank to generate)"
        />
        <button
          className="bg-indigo-600 hover:bg-indigo-700 transition-all duration-150 px-4 py-2 rounded-md text-sm font-semibold"
          onClick={() => {
            setShowSecret(!showSecret);
            setShowVault(!showVault);
          }}
        >
          {phraseValue ? "Add Wallet" : "Generate Wallet"}
        </button>
        <button
          className="bg-indigo-600 hover:bg-indigo-700 transition-all duration-150 px-4 py-2 rounded-md text-sm font-semibold"
          onClick={() => {
            handleRegister();
          }}
        >
          Register
        </button>
      </div>

      {showSecret && !phraseValue && (
        <div className="mt-8 space-y-6">
          <div className="bg-gray-800 p-4 rounded-lg shadow-md">
            <SecretPhrase mnemonic={mnemonic} />
          </div>
          <div className="bg-gray-800 p-4 rounded-lg shadow-md">
            <Seed seed={seedValue} />
          </div>
        </div>
      )}

      {showVault && (
        <div className="mt-8 bg-gray-800 p-4 rounded-lg shadow-md">
          <Vault root={root} />
        </div>
      )}
    </div>
  );
}
