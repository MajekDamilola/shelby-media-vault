"use client";

import { useWallet } from "@/hooks/useWallet";
import { useRouter } from "next/navigation";

export default function Nav() {
  const { address, disconnect } = useWallet();
  const router = useRouter();

  function handleDisconnect() {
    disconnect();
    router.push("/");
  }

  return (
    <nav
      style={{
        borderBottom: "1px solid var(--border)",
        background: "rgba(9,9,15,0.8)",
        backdropFilter: "blur(12px)",
        position: "sticky",
        top: 0,
        zIndex: 100,
        padding: "0 24px",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          height: 56,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            style={{
              width: 30,
              height: 30,
              background: "var(--accent)",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
            }}
          >
            ◈
          </span>
          <span style={{ fontWeight: 700, fontSize: 16, letterSpacing: "-0.01em" }}>
            Shelby Vault
          </span>
        </div>

        {/* Wallet address + disconnect */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              background: "var(--bg-3)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              padding: "6px 12px",
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              color: "var(--text-2)",
            }}
          >
            <span style={{ color: "var(--success)" }}>●</span>{" "}
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </div>
          <button
            className="btn-ghost"
            style={{ fontSize: 12, padding: "6px 14px" }}
            onClick={handleDisconnect}
          >
            Disconnect
          </button>
        </div>
      </div>
    </nav>
  );
}
