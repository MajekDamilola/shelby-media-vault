"use client";
import { useWallet } from "@/hooks/useWallet";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";

export default function Nav() {
  const { address, disconnect } = useWallet();
  const router = useRouter();
  const pathname = usePathname();
  const [showMenu, setShowMenu] = useState(false);

  const short = address ? `${address.slice(0,6)}...${address.slice(-4)}` : "";

  function handleDisconnect() {
    disconnect();
    router.push("/");
  }

  return (
    <nav style={{
      position:"sticky", top:0, zIndex:100,
      borderBottom:"1px solid var(--border-faint)",
      background:"rgba(4,4,10,0.85)",
      backdropFilter:"blur(20px)",
      WebkitBackdropFilter:"blur(20px)",
    }}>
      <div style={{ maxWidth:1160, margin:"0 auto", padding:"0 24px", height:60, display:"flex", alignItems:"center", justifyContent:"space-between" }}>

        {/* Logo */}
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:30, height:30, background:"linear-gradient(135deg, var(--accent-dim), var(--accent))", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:15 }}>◈</div>
          <span style={{ fontWeight:700, fontSize:15, letterSpacing:"-0.01em" }}>Shelby Vault</span>
        </div>

        {/* Nav links */}
        <div style={{ display:"flex", gap:4 }}>
          {[["Vault", "/vault"], ["Share", null]].map(([label, href]) => (
            href ? (
              <button key={label} onClick={() => router.push(href)}
                style={{
                  background:"transparent", border:"none", cursor:"pointer",
                  padding:"6px 14px", borderRadius:"var(--radius-md)",
                  fontSize:13, fontWeight:600, fontFamily:"var(--font)",
                  color: pathname === href ? "var(--text-1)" : "var(--text-3)",
                  background: pathname === href ? "var(--surface-3)" : "transparent",
                  transition:"all 0.15s",
                }}>
                {label}
              </button>
            ) : null
          ))}
        </div>

        {/* Wallet info */}
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{
            display:"flex", alignItems:"center", gap:8,
            background:"var(--surface-2)", border:"1px solid var(--border-subtle)",
            borderRadius:"var(--radius-full)", padding:"6px 14px",
            fontSize:12, fontFamily:"var(--mono)",
          }}>
            <span style={{ width:7, height:7, borderRadius:"50%", background:"var(--success)", display:"inline-block", boxShadow:"0 0 6px var(--success)" }} />
            <span style={{ color:"var(--text-2)" }}>{short}</span>
          </div>

          <div style={{ position:"relative" }}>
            <button className="btn btn-ghost btn-icon"
              onClick={() => setShowMenu(v => !v)}
              style={{ fontSize:16, color:"var(--text-2)" }}>
              ⋯
            </button>
            {showMenu && (
              <>
                <div style={{ position:"fixed", inset:0, zIndex:9 }} onClick={() => setShowMenu(false)} />
                <div style={{
                  position:"absolute", top:"calc(100% + 8px)", right:0, zIndex:10,
                  background:"var(--surface-2)", border:"1px solid var(--border-default)",
                  borderRadius:"var(--radius-md)", padding:6, minWidth:160,
                  boxShadow:"0 16px 48px rgba(0,0,0,0.4)",
                  animation:"scaleIn 0.15s ease both",
                }}>
                  <a href="https://docs.shelby.xyz" target="_blank" rel="noopener noreferrer"
                    style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 12px", borderRadius:"var(--radius-sm)", color:"var(--text-2)", textDecoration:"none", fontSize:13, fontWeight:500, transition:"all 0.12s" }}
                    onMouseEnter={e=>{e.currentTarget.style.background="var(--surface-3)";e.currentTarget.style.color="var(--text-1)"}}
                    onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color="var(--text-2)"}}>
                    <span>📄</span> Shelby Docs
                  </a>
                  <hr className="divider" style={{ margin:"4px 0" }} />
                  <button onClick={handleDisconnect}
                    style={{ width:"100%", background:"transparent", border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:10, padding:"9px 12px", borderRadius:"var(--radius-sm)", color:"var(--danger)", fontSize:13, fontWeight:500, fontFamily:"var(--font)", transition:"all 0.12s" }}
                    onMouseEnter={e=>(e.currentTarget.style.background="var(--danger-soft)")}
                    onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>
                    <span>↩</span> Disconnect
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
