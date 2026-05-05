"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@/hooks/useWallet";

export default function HomePage() {
  const { connect, isConnected } = useWallet();
  const router = useRouter();
  const [address, setAddress] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [error, setError] = useState("");

  if (isConnected) {
    router.push("/vault");
    return null;
  }

  function handleConnect(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!address.trim()) {
      setError("Account address is required");
      return;
    }
    if (!privateKey.trim()) {
      setError("Private key is required to sign uploads");
      return;
    }
    connect(address.trim(), privateKey.trim());
    router.push("/vault");
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        position: "relative",
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: "fixed",
          top: "30%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(108,92,231,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Logo */}
      <div className="animate-fade-up" style={{ marginBottom: 48, textAlign: "center" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            justifyContent: "center",
            marginBottom: 16,
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              background: "var(--accent)",
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              boxShadow: "0 0 30px var(--accent-glow)",
              animation: "pulse-glow 3s ease-in-out infinite",
            }}
          >
            ◈
          </div>
          <span
            style={{
              fontSize: 26,
              fontWeight: 800,
              letterSpacing: "-0.02em",
              color: "var(--text)",
            }}
          >
            Shelby Media Vault
          </span>
        </div>
        <p
          style={{
            color: "var(--text-2)",
            fontSize: 15,
            maxWidth: 440,
            lineHeight: 1.6,
            fontWeight: 400,
          }}
        >
          Decentralized media storage for creators. Upload, organize, and share
          your files on Shelby's network.
        </p>
      </div>

      {/* Connect Card */}
      <div
        className="card animate-fade-up"
        style={{
          width: "100%",
          maxWidth: 440,
          padding: 32,
          animationDelay: "0.1s",
        }}
      >
        <h2
          style={{
            fontSize: 18,
            fontWeight: 700,
            marginBottom: 6,
            color: "var(--text)",
          }}
        >
          Connect your wallet
        </h2>
        <p
          style={{ fontSize: 13, color: "var(--text-2)", marginBottom: 24 }}
        >
          Use your Aptos devnet account credentials to access your vault.{" "}
          <span style={{ color: "var(--accent-2)" }}>
            Never use mainnet keys here.
          </span>
        </p>

        <form onSubmit={handleConnect} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label
              style={{
                display: "block",
                fontSize: 12,
                fontWeight: 600,
                color: "var(--text-2)",
                marginBottom: 6,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              Account Address
            </label>
            <input
              className="input"
              type="text"
              placeholder="0x..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: 12,
                fontWeight: 600,
                color: "var(--text-2)",
                marginBottom: 6,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              Private Key
            </label>
            <input
              className="input"
              type="password"
              placeholder="0x..."
              value={privateKey}
              onChange={(e) => setPrivateKey(e.target.value)}
            />
          </div>

          {error && (
            <p
              style={{
                color: "var(--danger)",
                fontSize: 13,
                fontFamily: "var(--font-mono)",
              }}
            >
              ✗ {error}
            </p>
          )}

          <button className="btn-primary" type="submit" style={{ marginTop: 8 }}>
            Open Vault →
          </button>
        </form>

        <div
          style={{
            marginTop: 24,
            paddingTop: 20,
            borderTop: "1px solid var(--border)",
            fontSize: 12,
            color: "var(--text-2)",
            display: "flex",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <a
            href="https://docs.shelby.xyz/apis/faucet/shelbyusd"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--accent-2)", textDecoration: "none" }}
          >
            → Get ShelbyUSD testnet funds
          </a>
          <a
            href="https://docs.shelby.xyz/tools/cli"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--accent-2)", textDecoration: "none" }}
          >
            → Shelby CLI docs
          </a>
        </div>
      </div>

      {/* Feature pills */}
      <div
        className="animate-fade-up"
        style={{
          display: "flex",
          gap: 10,
          marginTop: 32,
          flexWrap: "wrap",
          justifyContent: "center",
          animationDelay: "0.2s",
        }}
      >
        {["Decentralized Storage", "Wallet-Based Access", "Media Preview", "Shareable Links", "Blob Integrity Proofs"].map((f) => (
          <span
            key={f}
            style={{
              background: "var(--bg-2)",
              border: "1px solid var(--border)",
              borderRadius: 100,
              padding: "6px 14px",
              fontSize: 12,
              color: "var(--text-2)",
              fontFamily: "var(--font-mono)",
            }}
          >
            {f}
          </span>
        ))}
      </div>
    </main>
  );
}
