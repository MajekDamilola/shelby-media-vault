"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@/hooks/useWallet";
import Nav from "@/components/Nav";

export default function VaultLayout({ children }: { children: React.ReactNode }) {
  const { isConnected } = useWallet();
  const router = useRouter();

  useEffect(() => {
    if (!isConnected) {
      router.push("/");
    }
  }, [isConnected, router]);

  if (!isConnected) return null;

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Nav />
      <main style={{ flex: 1, padding: "32px 24px", maxWidth: 1200, margin: "0 auto", width: "100%" }}>
        {children}
      </main>
    </div>
  );
}
