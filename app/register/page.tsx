'use client';

import { useState } from 'react';

export default function PrivateEncryptSimulator() {
  const [senderKeys, setSenderKeys] = useState<{ pub: CryptoKey; priv: CryptoKey } | null>(null);
  const [senderPubBase64, setSenderPubBase64] = useState('');
  const [senderPrivBase64, setSenderPrivBase64] = useState('');
  const [receiverPubKey, setReceiverPubKey] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [signedMessage, setSignedMessage] = useState('');
  const [manualPubKey, setManualPubKey] = useState('');
  const [verificationResult, setVerificationResult] = useState('');
  const [decodedAmount, setDecodedAmount] = useState('');

  const generateKeys = async () => {
    const pair = await crypto.subtle.generateKey(
      {
        name: 'RSASSA-PKCS1-v1_5',
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: 'SHA-256',
      },
      true,
      ['sign', 'verify']
    );

    const pubExport = await crypto.subtle.exportKey('spki', pair.publicKey);
    const privExport = await crypto.subtle.exportKey('pkcs8', pair.privateKey);
    const pubB64 = btoa(String.fromCharCode(...new Uint8Array(pubExport)));
    const privB64 = btoa(String.fromCharCode(...new Uint8Array(privExport)));

    setSenderKeys({ pub: pair.publicKey, priv: pair.privateKey });
    setSenderPubBase64(pubB64);
    setSenderPrivBase64(privB64);
    setAmount(0);
    setSignedMessage('');
    setManualPubKey('');
    setVerificationResult('');
    setDecodedAmount('');
    setReceiverPubKey('');
  };

  const handleEncrypt = async () => {
    if (!senderKeys || amount <= 0) return;

    if (!receiverPubKey) {
      alert("⚠️ Please enter the receiver's public key before encrypting.");
      return;
    }

    const encoded = new TextEncoder().encode(amount.toString());

    const signature = await crypto.subtle.sign(
      { name: 'RSASSA-PKCS1-v1_5' },
      senderKeys.priv,
      encoded
    );

    const signatureBase64 = btoa(String.fromCharCode(...new Uint8Array(signature)));
    setSignedMessage(signatureBase64);
  };

  const handleDecrypt = async () => {
    if (!manualPubKey || !signedMessage) return;

    try {
      const pubBuf = Uint8Array.from(atob(manualPubKey), c => c.charCodeAt(0));
      const importedPub = await crypto.subtle.importKey(
        'spki',
        pubBuf,
        { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
        false,
        ['verify']
      );

      const encodedMsg = new TextEncoder().encode(amount.toString());
      const signatureBuf = Uint8Array.from(atob(signedMessage), c => c.charCodeAt(0));

      const isValid = await crypto.subtle.verify(
        { name: 'RSASSA-PKCS1-v1_5' },
        importedPub,
        signatureBuf,
        encodedMsg
      );

      if (isValid) {
        setVerificationResult('✅ Decrypted & Verified');
        setDecodedAmount(amount.toString());
      } else {
        setVerificationResult('❌ Verification Failed');
      }
    } catch (err) {
      console.error(err);
      setVerificationResult('❌ Decryption Error');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 mt-10 bg-gray-900 text-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">🔐 Private-Key Encryption Simulator</h1>

      <button
        onClick={generateKeys}
        className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded mb-6"
      >
        🪪 Generate Sender Keys
      </button>

      {senderKeys && (
        <>
          <p className="text-sm text-gray-400">Sender Public Key:</p>
          <textarea className="w-full bg-gray-800 p-2 text-xs rounded mb-4" value={senderPubBase64} readOnly rows={3} />

          <p className="text-sm text-gray-400">Sender Private Key:</p>
          <textarea className="w-full bg-gray-800 p-2 text-xs rounded mb-4" value={senderPrivBase64} readOnly rows={4} />

          <input
            type="text"
            placeholder="Receiver's Public Key (Base64)"
            className="w-full bg-gray-800 p-2 rounded text-xs mb-3"
            value={receiverPubKey}
            onChange={(e) => setReceiverPubKey(e.target.value)}
          />

          <input
            type="number"
            placeholder="Amount to sign"
            className="w-full bg-gray-800 p-2 rounded text-sm mb-3"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />

          <button
            onClick={handleEncrypt}
            className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded mb-6"
          >
            🔐 Send 
          </button>
        </>
      )}

      {signedMessage && (
        <>
          <h3 className="font-semibold mb-2">📦 Encrypted msg</h3>
          <code className="block bg-gray-800 p-2 rounded text-xs break-all mb-4">{signedMessage}</code>

          <textarea
            placeholder="Paste Sender's Public Key to decrypt"
            className="w-full bg-gray-800 p-2 text-xs rounded mb-4"
            rows={4}
            value={manualPubKey}
            onChange={(e) => setManualPubKey(e.target.value)}
          />

          <button
            onClick={handleDecrypt}
            className="bg-purple-600 hover:bg-purple-700 px-5 py-2 rounded"
          >
            🔓 Decrypt (Verify with Public Key)
          </button>

          {verificationResult && <p className="mt-3 text-sm text-yellow-400">{verificationResult}</p>}
          {decodedAmount && (
            <p className="text-green-400 text-lg mt-4">✅ Decrypted Amount: ${decodedAmount}</p>
          )}
        </>
      )}
    </div>
  );
}
