"use client";
import React, { useState, useEffect } from "react";
import * as bip39 from "bip39";
import { BIP32Factory } from "bip32";
import * as ecc from "tiny-secp256k1";
import SecretPhrase from "../component/generateSecret/page";
import Vault from "../component/Vault/page";

// Initialize BIP32 with the elliptic curve cryptography library
const bip32 = BIP32Factory(ecc);

export default function Home() {
  const [showSecret, setShowSecret] = useState(false);
  const [showVault, setShowVault] = useState(false);
  const [phraseValue, setPhraseValue] = useState("");
  const [mnemonic, setMnemonic] = useState<string>("");
  const [root, setRoot] = useState<ReturnType<typeof bip32.fromSeed> | null>(
    null
  );
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPhraseValue(e.target.value);
  }

  const generateRandomMnemonic = async () => {
    const generatedMnemonic = bip39.generateMnemonic();
    setMnemonic(generatedMnemonic);
    const seed = await bip39.mnemonicToSeed(generatedMnemonic);

    const root = bip32.fromSeed(seed);
    setRoot(root);
  };

  useEffect(() => {
    generateRandomMnemonic();
  }, []);

  return (
    <>
      <div className="mt-24 mx-[100px] max-w-3xl w-full">
        <div>
          <h1 className="text-4xl font-extrabold bg-clip-text">
            Rustyn wallet
          </h1>
          <p className="text-lg text-gray-300">
            A personal web-3 wallet for{" "}
            <span className=" text-white font-bold">rustyn-user.</span>
          </p>
        </div>

        <div className="flex mt-2 w-full">
          <input
            value={phraseValue}
            onChange={(e) => {
              handleInputChange(e);
              setShowSecret(false);
              setShowVault(false);
            }}
            className="flex-[0.8] border p-2 rounded bg-transparent placeholder-gray-400 text-white"
            type="text"
            placeholder="Enter your secret phrase (or leave blank to generate)"
          />
          {phraseValue ? (
            <button
              className="flex-[0.2] ml-2 p-2 bg-white rounded text-black"
              onClick={() => {
                setShowSecret(!showSecret);
                setShowVault(!showVault);
              }}
            >
              Add Wallet
            </button>
          ) : (
            <button
              className="flex-[0.2] ml-2 p-2 bg-white rounded text-black"
              onClick={() => {
                setShowSecret(!showSecret);
                setShowVault(!showVault);
              }}
            >
              Generate Wallet
            </button>
          )}
        </div>

        <div>
          {showSecret && !phraseValue ? (
            <SecretPhrase mnemonic={mnemonic} />
          ) : (
            ""
          )}
        </div>
        <div>{showVault ? <Vault root={root} /> : ""}</div>
      </div>
    </>
  );
}
