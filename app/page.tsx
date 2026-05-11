"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

export default function HomePage() {
  const { connected, wallets = [], connect } = useWallet();
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mounted, setMounted] = useState(false);
  const [showWallets, setShowWallets] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => { if (connected) router.push("/vault"); }, [connected, router]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !mounted) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animId: number;
    let t = 0;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);
    const hex = (x: number, y: number, r: number, fill: string, stroke: string, lw: number) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI / 3) * i - Math.PI / 6;
        i === 0 ? ctx.moveTo(x + r * Math.cos(a), y + r * Math.sin(a)) : ctx.lineTo(x + r * Math.cos(a), y + r * Math.sin(a));
      }
      ctx.closePath();
      if (fill) { ctx.fillStyle = fill; ctx.fill(); }
      if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
    };
    const draw = () => {
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#080806"; ctx.fillRect(0, 0, W, H);
      const g1 = ctx.createRadialGradient(W * 0.1, H * 0.2, 0, W * 0.1, H * 0.2, W * 0.55);
      g1.addColorStop(0, "rgba(255,160,20,0.10)"); g1.addColorStop(1, "transparent");
      ctx.fillStyle = g1; ctx.fillRect(0, 0, W, H);
      const R = 42;
      for (let row = -1; row < Math.ceil(H / (R * 1.5)) + 3; row++) {
        for (let col = -1; col < Math.ceil(W / (R * 1.732)) + 3; col++) {
          const x = col * R * 1.732 + (row % 2 ? R * 0.866 : 0);
          const y = row * R * 1.5;
          const dist = Math.hypot(x - W * 0.18, y - H * 0.35) / (W * 0.6);
          const wave = Math.sin(t * 0.6 + col * 0.5 + row * 0.4) * 0.5 + 0.5;
          const proximity = Math.max(0, 1 - dist);
          const alpha = proximity * wave * 0.22 + 0.025;
          if (wave > 0.88 && proximity > 0.3) hex(x, y, R - 3, `rgba(255,150,10,${alpha * 0.5})`, "", 0);
          hex(x, y, R - 2, "", `rgba(255,140,0,${alpha})`, 0.7);
        }
      }
      t += 0.016;
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, [mounted]);

  if (!mounted) return null;

  const HexLogo = ({ size = 36 }: { size?: number }) => {
    const r = size * 0.44, cx = size / 2, cy = size / 2;
    const pts = Array.from({ length: 6 }, (_, i) => { const a = (Math.PI / 3) * i - Math.PI / 6; return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`; }).join(" ");
    const inner = Array.from({ length: 6 }, (_, i) => { const a = (Math.PI / 3) * i - Math.PI / 6; return `${cx + r * 0.55 * Math.cos(a)},${cy + r * 0.55 * Math.sin(a)}`; }).join(" ");
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flexShrink: 0 }}>
        <defs><linearGradient id={`hg${size}`} x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#ffcc00" /><stop offset="100%" stopColor="#ff8800" /></linearGradient></defs>
        <polygon points={pts} fill={`url(#hg${size})`} />
        <polygon points={inner} fill="rgba(8,8,6,0.5)" />
        <circle cx={cx} cy={cy} r={r * 0.22} fill={`url(#hg${size})`} />
      </svg>
    );
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", position: "relative", background: "#080806", overflow: "hidden" }}>
      <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, zIndex: 0 }} />

      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        {/* NAV */}
        <nav style={{ padding: "0 48px", height: 68, display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(255,140,0,0.08)", background: "rgba(8,8,6,0.7)", backdropFilter: "blur(16px)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <HexLogo size={36} />
            <div>
              <span style={{ fontWeight: 800, fontSize: 16, letterSpacing: "-0.02em", color: "#fff" }}>Shelby</span>
              <span style={{ fontWeight: 400, fontSize: 16, color: "rgba(255,255,255,0.35)", marginLeft: 6 }}>Media Vault</span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <a href="https://docs.shelby.xyz" target="_blank" rel="noopener noreferrer"
              style={{ padding: "7px 16px", fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.4)", textDecoration: "none", borderRadius: 8, transition: "color 0.15s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#fff")} onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}>
              Docs
            </a>
            <a href="https://docs.shelby.xyz/apis/faucet/shelbyusd" target="_blank" rel="noopener noreferrer"
              style={{ padding: "8px 18px", fontSize: 13, fontWeight: 700, color: "#080806", background: "linear-gradient(135deg,#ffaa00,#ff7a00)", borderRadius: 8, textDecoration: "none", boxShadow: "0 2px 16px rgba(255,140,0,0.25)", transition: "all 0.18s" }}>
              Get Testnet Funds
            </a>
          </div>
        </nav>

        {/* HERO */}
        <main style={{ flex: 1, display: "flex", alignItems: "center", padding: "0 48px" }}>
          <div style={{ width: "100%", maxWidth: 1120, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 420px", gap: 96, alignItems: "center" }}>

            {/* LEFT */}
            <div>
              <div className="anim-fade-up" style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 28, border: "1px solid rgba(255,140,0,0.25)", borderRadius: 100, padding: "5px 14px 5px 10px", background: "rgba(255,140,0,0.06)" }}>
                <HexLogo size={18} />
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#ffaa00" }}>Powered by Shelby Network</span>
              </div>
              <h1 className="anim-fade-up delay-1" style={{ fontSize: "clamp(44px,6vw,76px)", fontWeight: 800, lineHeight: 1.0, letterSpacing: "-0.035em", color: "#fff", marginBottom: 8 }}>Your media.</h1>
              <h1 className="anim-fade-up delay-2" style={{ fontSize: "clamp(44px,6vw,76px)", fontWeight: 800, lineHeight: 1.0, letterSpacing: "-0.035em", marginBottom: 28, background: "linear-gradient(135deg,#ffcc00 0%,#ff8800 50%,#ff5500 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Decentralized.</h1>
              <p className="anim-fade-up delay-3" style={{ fontSize: 17, lineHeight: 1.75, color: "rgba(255,255,255,0.5)", maxWidth: 500, marginBottom: 44 }}>
                Upload, organize, and retrieve images, video, and audio on Shelby's hot storage network. Built to hold, made to move.
              </p>
              <div className="anim-fade-up delay-4" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, maxWidth: 480, marginBottom: 48 }}>
                {[["⬡", "Decentralized Storage", "Files live on Shelby's network"], ["◎", "Wallet-Based Access", "Your keys, your vault"], ["⟳", "Fast Retrieval", "Hot storage, instant reads"], ["⎘", "Shareable Links", "Public URLs for any file"]].map(([icon, title, sub]) => (
                  <div key={title} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "14px 16px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,140,0,0.08)", borderRadius: 12 }}>
                    <span style={{ fontSize: 16, color: "#ffaa00", marginTop: 1, flexShrink: 0 }}>{icon}</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 13, color: "#fff", marginBottom: 2 }}>{title}</div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{sub}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="anim-fade-up delay-5" style={{ display: "flex", gap: 40, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                {[["< 1s", "Read Latency"], ["∞", "File Types"], ["Web3", "Native Storage"]].map(([val, lab]) => (
                  <div key={lab}>
                    <div style={{ fontSize: 24, fontWeight: 800, color: "#ffaa00", letterSpacing: "-0.02em" }}>{val}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", marginTop: 3 }}>{lab}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: Connect card */}
            <div className="anim-scale-in delay-2" style={{ position: "relative" }}>
              <div style={{ position: "absolute", inset: -30, borderRadius: "50%", background: "radial-gradient(circle,rgba(255,140,0,0.12),transparent 70%)", pointerEvents: "none" }} />
              <div style={{ position: "relative", background: "rgba(14,13,10,0.92)", backdropFilter: "blur(28px)", border: "1px solid rgba(255,140,0,0.15)", borderRadius: 20, padding: 36, overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: "15%", right: "15%", height: 1, background: "linear-gradient(90deg,transparent,#ffaa00,transparent)" }} />

                <div style={{ marginBottom: 28 }}>
                  <h3 style={{ fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 8, letterSpacing: "-0.02em" }}>Connect Wallet</h3>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.38)", lineHeight: 1.6 }}>
                    Connect your Aptos wallet to access your vault. Supports Petra, Nightly, Martian and more.
                  </p>
                </div>

                {/* Main connect button */}
                <button onClick={() => setShowWallets(v => !v)} style={{
                  width: "100%", padding: "14px 24px", border: "none", borderRadius: 10, cursor: "pointer",
                  background: "linear-gradient(135deg,#ffcc00,#ff8800)", color: "#080806",
                  fontSize: 16, fontWeight: 800, fontFamily: "var(--font)",
                  boxShadow: "0 4px 28px rgba(255,140,0,0.35)", transition: "all 0.18s",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 6px 40px rgba(255,140,0,0.55)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 4px 28px rgba(255,140,0,0.35)"; e.currentTarget.style.transform = ""; }}>
                  <HexLogo size={20} /> Connect Wallet
                </button>

                {/* Wallet list — shows when button clicked */}
                {showWallets && wallets.length > 0 && (
                  <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
                    {wallets.map((w) => {
                      const ready = w.readyState === "Installed";
                      return (
                        <button key={w.name} onClick={() => ready && connect(w.name as never)}
                          style={{
                            width: "100%", padding: "12px 16px", borderRadius: 10, cursor: ready ? "pointer" : "default",
                            background: "rgba(255,255,255,0.03)", border: `1px solid ${ready ? "rgba(255,140,0,0.15)" : "rgba(255,255,255,0.05)"}`,
                            display: "flex", alignItems: "center", gap: 12, transition: "all 0.15s",
                            opacity: ready ? 1 : 0.4, fontFamily: "var(--font)",
                          }}
                          onMouseEnter={e => { if (ready) { e.currentTarget.style.background = "rgba(255,140,0,0.08)"; e.currentTarget.style.borderColor = "rgba(255,140,0,0.3)"; } }}
                          onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor = ready ? "rgba(255,140,0,0.15)" : "rgba(255,255,255,0.05)"; }}>
                          {w.icon
                            // eslint-disable-next-line @next/next/no-img-element
                            ? <img src={w.icon} alt={w.name} width={28} height={28} style={{ borderRadius: 6 }} />
                            : <span style={{ fontSize: 20 }}>⬡</span>}
                          <div style={{ textAlign: "left" }}>
                            <div style={{ fontWeight: 700, fontSize: 13, color: "#fff" }}>{w.name}</div>
                            <div style={{ fontSize: 11, color: ready ? "#ffaa00" : "rgba(255,255,255,0.3)", marginTop: 2 }}>{ready ? "Click to connect" : "Not installed"}</div>
                          </div>
                          {!ready && (
                            <a href={w.url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                              style={{ marginLeft: "auto", fontSize: 11, color: "rgba(255,255,255,0.3)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, padding: "4px 10px", textDecoration: "none" }}>
                              Install
                            </a>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* No wallets detected */}
                {showWallets && wallets.length === 0 && (
                  <div style={{ marginTop: 12, padding: "16px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,140,0,0.08)", borderRadius: 10, textAlign: "center" }}>
                    <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", marginBottom: 8 }}>No wallets detected</p>
                    <a href="https://petra.app" target="_blank" rel="noopener noreferrer"
                      style={{ fontSize: 13, color: "#ffaa00", textDecoration: "none", fontWeight: 600 }}>
                      Install Petra Wallet →
                    </a>
                  </div>
                )}

                <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "20px 0" }}>
                  <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
                  <span style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.2)", letterSpacing: "0.1em" }}>RESOURCES</span>
                  <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  {[["ShelbyUSD Faucet", "https://docs.shelby.xyz/apis/faucet/shelbyusd"], ["CLI Setup", "https://docs.shelby.xyz/tools/cli"]].map(([label, href]) => (
                    <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                      style={{ flex: 1, textAlign: "center", padding: "9px 12px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,140,0,0.08)", borderRadius: 8, fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.3)", textDecoration: "none", transition: "all 0.15s", fontFamily: "var(--font)" }}
                      onMouseEnter={e => { e.currentTarget.style.color = "#ffaa00"; e.currentTarget.style.borderColor = "rgba(255,140,0,0.3)"; }}
                      onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.3)"; e.currentTarget.style.borderColor = "rgba(255,140,0,0.08)"; }}>
                      {label} →
                    </a>
                  ))}
                </div>

                <div style={{ marginTop: 16, padding: "10px 14px", background: "rgba(255,140,0,0.05)", border: "1px solid rgba(255,140,0,0.1)", borderRadius: 8, display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 14 }}>⬡</span>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>Running on <span style={{ color: "#ffaa00" }}>Aptos Testnet</span> via Shelby Network</span>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* FOOTER */}
        <footer style={{ padding: "16px 48px", borderTop: "1px solid rgba(255,140,0,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <HexLogo size={20} />
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.2)" }}>Shelby Media Vault · Testnet</span>
          </div>
          <div style={{ display: "flex", gap: 24 }}>
            {[["shelby.xyz", "https://shelby.xyz"], ["Docs", "https://docs.shelby.xyz"], ["GitHub", "https://github.com/MajekDamilola/shelby-media-vault"]].map(([l, h]) => (
              <a key={l} href={h} target="_blank" rel="noopener noreferrer"
                style={{ fontSize: 12, color: "rgba(255,255,255,0.2)", textDecoration: "none", transition: "color 0.15s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#ffaa00")} onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.2)")}>
                {l}
              </a>
            ))}
          </div>
        </footer>
      </div>
    </div>
  );
}
