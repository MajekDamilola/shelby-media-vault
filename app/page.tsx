"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@/hooks/useWallet";

export default function HomePage() {
  const { connect, isConnected } = useWallet();
  const router = useRouter();
  const [address, setAddress] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  if (isConnected) { router.push("/vault"); return null; }

  function handleConnect(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!address.trim()) { setError("Account address is required"); return; }
    if (!privateKey.trim()) { setError("Private key is required"); return; }
    connect(address.trim(), privateKey.trim());
    router.push("/vault");
  }

  if (!mounted) return null;

  return (
    <main style={{ minHeight:"100vh", display:"flex", flexDirection:"column", position:"relative", zIndex:1 }}>

      {/* ── NAV ── */}
      <nav style={{ padding:"20px 40px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <LogoMark size={32} />
          <span style={{ fontWeight:700, fontSize:16, letterSpacing:"-0.01em" }}>Shelby Vault</span>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <a href="https://docs.shelby.xyz" target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm">Docs</a>
          <a href="https://docs.shelby.xyz/apis/faucet/shelbyusd" target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm">Get Testnet Funds</a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:"60px 24px" }}>
        <div style={{ width:"100%", maxWidth:980, display:"grid", gridTemplateColumns:"1fr 1fr", gap:80, alignItems:"center" }}>

          {/* Left: copy */}
          <div>
            <div className="badge badge-accent anim-fade-up" style={{ marginBottom:24 }}>
              <span style={{ width:6, height:6, borderRadius:"50%", background:"var(--accent)", display:"inline-block" }} />
              Powered by Shelby Network
            </div>
            <h1 className="anim-fade-up delay-1" style={{ fontSize:"clamp(36px,5vw,58px)", fontWeight:700, lineHeight:1.08, marginBottom:20 }}>
              Your media.<br/>
              <span style={{ background:"linear-gradient(135deg, var(--accent), var(--cyan))", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
                Decentralized.
              </span>
            </h1>
            <p className="anim-fade-up delay-2" style={{ fontSize:16, lineHeight:1.7, marginBottom:36, maxWidth:440, color:"var(--text-2)" }}>
              Upload, organize, and share images, video, and audio directly on Shelby's decentralized storage network. Your vault, your keys, your files.
            </p>

            {/* Features */}
            <div className="anim-fade-up delay-3" style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {[
                ["◈", "Wallet-based access", "Connect with your Aptos account"],
                ["⬡", "Decentralized storage", "Files stored on Shelby's network"],
                ["◎", "Shareable links", "Generate public URLs instantly"],
              ].map(([icon, title, sub]) => (
                <div key={title} style={{ display:"flex", alignItems:"center", gap:14 }}>
                  <div style={{ width:36, height:36, background:"var(--surface-3)", border:"1px solid var(--border-default)", borderRadius:"var(--radius-md)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, color:"var(--accent)", flexShrink:0 }}>{icon}</div>
                  <div>
                    <div style={{ fontWeight:600, fontSize:14, color:"var(--text-1)" }}>{title}</div>
                    <div style={{ fontSize:12, color:"var(--text-3)" }}>{sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: connect card */}
          <div className="anim-scale-in delay-2">
            <div className="glass" style={{ padding:36, position:"relative", overflow:"hidden" }}>
              {/* Decorative glow inside card */}
              <div style={{ position:"absolute", top:-60, right:-60, width:200, height:200, borderRadius:"50%", background:"radial-gradient(circle, rgba(124,101,255,0.15), transparent 70%)", pointerEvents:"none" }} />

              <div style={{ marginBottom:28 }}>
                <h3 style={{ marginBottom:6 }}>Connect your wallet</h3>
                <p style={{ fontSize:13, color:"var(--text-3)" }}>
                  Use your Aptos devnet credentials.{" "}
                  <span style={{ color:"var(--accent)" }}>Never use mainnet keys.</span>
                </p>
              </div>

              <form onSubmit={handleConnect} style={{ display:"flex", flexDirection:"column", gap:16 }}>
                <div>
                  <label className="label">Account Address</label>
                  <input className="input input-mono" type="text" placeholder="0x..." value={address} onChange={e => setAddress(e.target.value)} />
                </div>
                <div>
                  <label className="label">Private Key</label>
                  <input className="input input-mono" type="password" placeholder="0x..." value={privateKey} onChange={e => setPrivateKey(e.target.value)} />
                </div>

                {error && (
                  <div style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 14px", background:"var(--danger-soft)", border:"1px solid rgba(255,87,87,0.2)", borderRadius:"var(--radius-md)", fontSize:13, color:"var(--danger)" }}>
                    <span>✕</span> {error}
                  </div>
                )}

                <button className="btn btn-primary btn-lg" type="submit" style={{ width:"100%", marginTop:4, justifyContent:"center" }}>
                  Open Vault →
                </button>
              </form>

              <hr className="divider" style={{ margin:"24px 0" }} />
              <div style={{ display:"flex", justifyContent:"center", gap:20 }}>
                <a href="https://docs.shelby.xyz/apis/faucet/shelbyusd" target="_blank" rel="noopener noreferrer" style={{ fontSize:12, color:"var(--text-3)", textDecoration:"none", transition:"color 0.15s" }}
                   onMouseEnter={e=>(e.currentTarget.style.color="var(--accent)")} onMouseLeave={e=>(e.currentTarget.style.color="var(--text-3)")}>
                  Get ShelbyUSD →
                </a>
                <a href="https://docs.shelby.xyz/tools/cli" target="_blank" rel="noopener noreferrer" style={{ fontSize:12, color:"var(--text-3)", textDecoration:"none", transition:"color 0.15s" }}
                   onMouseEnter={e=>(e.currentTarget.style.color="var(--accent)")} onMouseLeave={e=>(e.currentTarget.style.color="var(--text-3)")}>
                  CLI Setup →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ padding:"20px 40px", borderTop:"1px solid var(--border-faint)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <LogoMark size={18} />
          <span style={{ fontSize:12, color:"var(--text-3)" }}>Shelby Media Vault</span>
        </div>
        <span style={{ fontSize:12, color:"var(--text-4)" }}>Built on Shelby Network · Devnet</span>
      </footer>
    </main>
  );
}

function LogoMark({ size = 36 }: { size?: number }) {
  return (
    <div style={{
      width:size, height:size,
      background:"linear-gradient(135deg, var(--accent-dim), var(--accent))",
      borderRadius: Math.round(size * 0.28),
      display:"flex", alignItems:"center", justifyContent:"center",
      fontSize: Math.round(size * 0.5),
      flexShrink:0,
    }}>◈</div>
  );
}
