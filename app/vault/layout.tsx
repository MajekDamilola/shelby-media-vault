"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import Nav from "@/components/Nav";

export default function VaultLayout({ children }: { children: React.ReactNode }) {
  const { connected } = useWallet();
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // Small delay to let wallet adapter initialize before checking
    const timer = setTimeout(() => {
      setChecked(true);
      if (!connected) router.push("/");
    }, 500);
    return () => clearTimeout(timer);
  }, [connected, router]);

  if (!checked) {
    return (
      <div style={{ minHeight: "100vh", background: "#080806", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <div style={{ width: 36, height: 36, border: "3px solid rgba(255,140,0,0.15)", borderTopColor: "#ffaa00", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", fontFamily: "var(--mono)" }}>Loading vault…</span>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!connected) return null;

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#080806" }}>
      <Nav />
      <main style={{ flex: 1, padding: "32px 24px", maxWidth: 1160, margin: "0 auto", width: "100%" }}>
        {children}
      </main>
    </div>
  );
}
