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

  function handleDisconnect() { disconnect(); router.push("/"); }

  const r = 9, cx = 18, cy = 18;
  const hexPts = Array.from({length:6},(_,i)=>{
    const a=(Math.PI/3)*i-Math.PI/6;
    return `${cx+r*Math.cos(a)},${cy+r*Math.sin(a)}`;
  }).join(" ");
  const innerPts = Array.from({length:6},(_,i)=>{
    const a=(Math.PI/3)*i-Math.PI/6;
    return `${cx+r*0.55*Math.cos(a)},${cy+r*0.55*Math.sin(a)}`;
  }).join(" ");

  return (
    <nav style={{
      position:"sticky", top:0, zIndex:100,
      borderBottom:"1px solid rgba(255,140,0,0.07)",
      background:"rgba(8,8,6,0.88)",
      backdropFilter:"blur(20px)",
    }}>
      <div style={{ maxWidth:1160, margin:"0 auto", padding:"0 28px", height:62, display:"flex", alignItems:"center", justifyContent:"space-between" }}>

        {/* Logo */}
        <div style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer" }} onClick={() => router.push("/vault")}>
          <svg width={36} height={36} viewBox="0 0 36 36">
            <defs>
              <linearGradient id="ng" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffcc00"/>
                <stop offset="100%" stopColor="#ff8800"/>
              </linearGradient>
            </defs>
            <polygon points={hexPts} fill="url(#ng)"/>
            <polygon points={innerPts} fill="rgba(8,8,6,0.55)"/>
            <circle cx={cx} cy={cy} r={r*0.22} fill="url(#ng)"/>
          </svg>
          <div>
            <span style={{ fontWeight:800, fontSize:15, letterSpacing:"-0.02em", color:"#fff" }}>Shelby</span>
            <span style={{ fontWeight:400, fontSize:15, color:"rgba(255,255,255,0.3)", marginLeft:5 }}>Vault</span>
          </div>
        </div>

        {/* Nav tabs */}
        <div style={{ display:"flex", gap:2, background:"rgba(255,255,255,0.03)", borderRadius:10, padding:4, border:"1px solid rgba(255,140,0,0.06)" }}>
          {[["My Vault", "/vault"]].map(([label, href]) => (
            <button key={label} onClick={() => router.push(href as string)}
              style={{
                background: pathname === href ? "rgba(255,140,0,0.12)" : "transparent",
                border: pathname === href ? "1px solid rgba(255,140,0,0.2)" : "1px solid transparent",
                color: pathname === href ? "#ffaa00" : "rgba(255,255,255,0.4)",
                borderRadius:7, padding:"6px 16px",
                fontSize:13, fontWeight:700, fontFamily:"var(--font)",
                cursor:"pointer", transition:"all 0.15s",
              }}>
              {label}
            </button>
          ))}
        </div>

        {/* Right side */}
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          {/* Wallet pill */}
          <div style={{
            display:"flex", alignItems:"center", gap:8,
            background:"rgba(255,255,255,0.04)",
            border:"1px solid rgba(255,140,0,0.1)",
            borderRadius:100, padding:"7px 14px",
          }}>
            <span style={{ width:7, height:7, borderRadius:"50%", background:"#00e5b0", display:"inline-block", boxShadow:"0 0 8px #00e5b0" }}/>
            <span style={{ fontFamily:"var(--mono)", fontSize:12, color:"rgba(255,255,255,0.5)" }}>{short}</span>
          </div>

          {/* Menu */}
          <div style={{ position:"relative" }}>
            <button onClick={() => setShowMenu(v=>!v)}
              style={{
                width:36, height:36, borderRadius:9,
                background:"rgba(255,255,255,0.04)",
                border:"1px solid rgba(255,140,0,0.08)",
                color:"rgba(255,255,255,0.4)", fontSize:18,
                cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center",
                transition:"all 0.15s",
              }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(255,140,0,0.25)"; e.currentTarget.style.color="#ffaa00";}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,140,0,0.08)"; e.currentTarget.style.color="rgba(255,255,255,0.4)";}}>
              ⋯
            </button>
            {showMenu && (
              <>
                <div style={{ position:"fixed", inset:0, zIndex:9 }} onClick={() => setShowMenu(false)}/>
                <div style={{
                  position:"absolute", top:"calc(100% + 8px)", right:0, zIndex:10,
                  background:"rgba(14,13,10,0.97)", border:"1px solid rgba(255,140,0,0.12)",
                  borderRadius:12, padding:6, minWidth:180,
                  backdropFilter:"blur(20px)",
                  boxShadow:"0 16px 48px rgba(0,0,0,0.6)",
                  animation:"scaleIn 0.15s ease both",
                }}>
                  <a href="https://docs.shelby.xyz" target="_blank" rel="noopener noreferrer"
                    style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 12px", borderRadius:8, color:"rgba(255,255,255,0.5)", textDecoration:"none", fontSize:13, fontWeight:600, transition:"all 0.12s" }}
                    onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,140,0,0.08)"; e.currentTarget.style.color="#ffaa00";}}
                    onMouseLeave={e=>{e.currentTarget.style.background="transparent"; e.currentTarget.style.color="rgba(255,255,255,0.5)";}}>
                    <span>📄</span> Shelby Docs
                  </a>
                  <a href="https://docs.shelby.xyz/apis/faucet/shelbyusd" target="_blank" rel="noopener noreferrer"
                    style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 12px", borderRadius:8, color:"rgba(255,255,255,0.5)", textDecoration:"none", fontSize:13, fontWeight:600, transition:"all 0.12s" }}
                    onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,140,0,0.08)"; e.currentTarget.style.color="#ffaa00";}}
                    onMouseLeave={e=>{e.currentTarget.style.background="transparent"; e.currentTarget.style.color="rgba(255,255,255,0.5)";}}>
                    <span>⬡</span> Get Testnet Funds
                  </a>
                  <div style={{ height:1, background:"rgba(255,255,255,0.05)", margin:"4px 0" }}/>
                  <button onClick={handleDisconnect}
                    style={{ width:"100%", background:"transparent", border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:10, padding:"9px 12px", borderRadius:8, color:"#ff5757", fontSize:13, fontWeight:700, fontFamily:"var(--font)", transition:"all 0.12s" }}
                    onMouseEnter={e=>(e.currentTarget.style.background="rgba(255,87,87,0.08)")}
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
