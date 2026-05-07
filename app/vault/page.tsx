"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@/hooks/useWallet";

export default function HomePage() {
  const { connect, isConnected } = useWallet();
  const router = useRouter();
  const [address, setAddress] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => { setMounted(true); }, []);

  // Animated hexagon grid on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let t = 0;

    function resize() {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx!.scale(window.devicePixelRatio, window.devicePixelRatio);
    }
    resize();
    window.addEventListener("resize", resize);

    function hexPath(x: number, y: number, r: number) {
      ctx!.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI / 3) * i - Math.PI / 6;
        const px = x + r * Math.cos(a);
        const py = y + r * Math.sin(a);
        i === 0 ? ctx!.moveTo(px, py) : ctx!.lineTo(px, py);
      }
      ctx!.closePath();
    }

    function draw() {
      if (!canvas || !ctx) return;
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      ctx.clearRect(0, 0, W, H);

      const R = 38;
      const cols = Math.ceil(W / (R * 1.732)) + 2;
      const rows = Math.ceil(H / (R * 1.5)) + 2;

      for (let row = -1; row < rows; row++) {
        for (let col = -1; col < cols; col++) {
          const x = col * R * 1.732 + (row % 2 === 0 ? 0 : R * 0.866);
          const y = row * R * 1.5;

          const dist = Math.sqrt((x - W * 0.5) ** 2 + (y - H * 0.5) ** 2);
          const maxDist = Math.sqrt((W * 0.5) ** 2 + (H * 0.5) ** 2);
          const norm = dist / maxDist;

          const wave = Math.sin(t * 0.8 + col * 0.4 + row * 0.3) * 0.5 + 0.5;
          const alpha = (1 - norm * 0.85) * wave * 0.18 + 0.02;

          hexPath(x, y, R - 2);
          ctx.strokeStyle = `rgba(124,101,255,${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();

          // Occasional filled hex
          if (wave > 0.92 && norm < 0.6) {
            hexPath(x, y, R - 2);
            ctx.fillStyle = `rgba(124,101,255,${alpha * 0.3})`;
            ctx.fill();
          }
        }
      }
      t += 0.018;
      animId = requestAnimationFrame(draw);
    }

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, [mounted]);

  if (isConnected) { router.push("/vault"); return null; }
  if (!mounted) return null;

  function handleConnect(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!address.trim()) { setError("Account address is required"); return; }
    if (!privateKey.trim()) { setError("Private key is required"); return; }
    connect(address.trim(), privateKey.trim());
    router.push("/vault");
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>

      {/* ── HEXAGON CANVAS BACKGROUND ── */}
      <canvas ref={canvasRef} style={{
        position: "fixed", inset: 0, width: "100%", height: "100%",
        zIndex: 0, opacity: 1,
      }} />

      {/* ── RADIAL GLOW OVERLAYS ── */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
        background: `
          radial-gradient(ellipse 55% 45% at 15% 50%, rgba(124,101,255,0.13) 0%, transparent 65%),
          radial-gradient(ellipse 40% 35% at 85% 20%, rgba(0,212,255,0.07) 0%, transparent 60%),
          radial-gradient(ellipse 60% 50% at 50% 100%, rgba(124,101,255,0.06) 0%, transparent 60%)
        `,
      }} />

      {/* ── CONTENT ── */}
      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", minHeight: "100vh" }}>

        {/* NAV */}
        <nav style={{
          padding: "0 48px", height: 64,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          borderBottom: "1px solid rgba(255,255,255,0.04)",
          background: "rgba(4,4,10,0.6)", backdropFilter: "blur(12px)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <HexLogo size={34} />
            <div>
              <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: "-0.01em" }}>Shelby</span>
              <span style={{ fontWeight: 300, fontSize: 15, color: "var(--text-3)", marginLeft: 4 }}>Media Vault</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <a href="https://docs.shelby.xyz" target="_blank" rel="noopener noreferrer"
              style={{ padding: "7px 16px", borderRadius: "var(--radius-md)", fontSize: 13, fontWeight: 500, color: "var(--text-3)", textDecoration: "none", transition: "color 0.15s", fontFamily: "var(--font)" }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--text-1)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--text-3)")}>
              Docs
            </a>
            <a href="https://docs.shelby.xyz/apis/faucet/shelbyusd" target="_blank" rel="noopener noreferrer"
              className="btn btn-ghost btn-sm" style={{ textDecoration: "none" }}>
              Get Testnet Funds
            </a>
          </div>
        </nav>

        {/* HERO */}
        <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 48px" }}>
          <div style={{ width: "100%", maxWidth: 1100, display: "grid", gridTemplateColumns: "1fr 440px", gap: 100, alignItems: "center" }}>

            {/* LEFT: copy */}
            <div>
              {/* Tag */}
              <div className="anim-fade-up" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "rgba(124,101,255,0.08)", border: "1px solid rgba(124,101,255,0.2)",
                borderRadius: "var(--radius-full)", padding: "5px 14px", marginBottom: 32,
              }}>
                <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: "var(--accent)", boxShadow: "0 0 8px var(--accent)" }} />
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--accent)" }}>
                  Powered by Shelby Network
                </span>
              </div>

              {/* Headline */}
              <h1 className="anim-fade-up delay-1" style={{
                fontSize: "clamp(40px, 5.5vw, 68px)", fontWeight: 700,
                lineHeight: 1.04, letterSpacing: "-0.03em", marginBottom: 24,
              }}>
                Your media.<br />
                <span style={{
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  backgroundImage: "linear-gradient(135deg, #7c65ff 0%, #00d4ff 60%, #7c65ff 100%)",
                  backgroundSize: "200%",
                  animation: "gradientShift 4s ease infinite",
                }}>
                  Decentralized.
                </span>
              </h1>

              {/* Sub */}
              <p className="anim-fade-up delay-2" style={{
                fontSize: 17, lineHeight: 1.75, color: "var(--text-2)",
                maxWidth: 480, marginBottom: 48,
              }}>
                Upload, organize, and retrieve images, video, and audio directly on Shelby's hot storage network. Built to hold, made to move.
              </p>

              {/* Feature pills */}
              <div className="anim-fade-up delay-3" style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 48 }}>
                {[
                  { icon: "⬡", label: "Decentralized Storage" },
                  { icon: "◎", label: "Wallet Access" },
                  { icon: "⬡", label: "Shareable Links" },
                  { icon: "◎", label: "Blob Integrity" },
                ].map(f => (
                  <div key={f.label} style={{
                    display: "flex", alignItems: "center", gap: 7,
                    background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: "var(--radius-full)", padding: "6px 14px",
                  }}>
                    <span style={{ fontSize: 12, color: "var(--accent)" }}>{f.icon}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-2)", letterSpacing: "0.02em" }}>{f.label}</span>
                  </div>
                ))}
              </div>

              {/* Stats row */}
              <div className="anim-fade-up delay-4" style={{ display: "flex", gap: 40 }}>
                {[
                  { num: "< 1s", label: "avg read latency" },
                  { num: "∞", label: "file types supported" },
                  { num: "Web3", label: "native storage" },
                ].map(s => (
                  <div key={s.label}>
                    <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", color: "var(--text-1)" }}>{s.num}</div>
                    <div style={{ fontSize: 11, color: "var(--text-4)", textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 600, marginTop: 2 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: connect card */}
            <div className="anim-scale-in delay-2" style={{ position: "relative" }}>

              {/* Glow behind card */}
              <div style={{
                position: "absolute", inset: -40, borderRadius: "50%",
                background: "radial-gradient(circle, rgba(124,101,255,0.15), transparent 70%)",
                pointerEvents: "none", zIndex: 0,
              }} />

              <div style={{
                position: "relative", zIndex: 1,
                background: "rgba(14,14,26,0.85)", backdropFilter: "blur(24px)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "var(--radius-xl)", padding: 36, overflow: "hidden",
              }}>
                {/* Card top accent line */}
                <div style={{
                  position: "absolute", top: 0, left: "20%", right: "20%", height: 1,
                  background: "linear-gradient(90deg, transparent, var(--accent), transparent)",
                }} />

                {/* Header */}
                <div style={{ marginBottom: 28 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <HexLogo size={28} />
                    <h3 style={{ fontSize: 18, fontWeight: 700 }}>Connect Wallet</h3>
                  </div>
                  <p style={{ fontSize: 13, color: "var(--text-3)", lineHeight: 1.6 }}>
                    Enter your Aptos devnet credentials to access your vault.
                    <span style={{ color: "rgba(255,181,71,0.9)" }}> Never use mainnet keys.</span>
                  </p>
                </div>

                <form onSubmit={handleConnect} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {/* Address */}
                  <div>
                    <label className="label">Account Address</label>
                    <div style={{ position: "relative" }}>
                      <input
                        className="input input-mono"
                        type="text"
                        placeholder="0x..."
                        value={address}
                        onChange={e => setAddress(e.target.value)}
                        onFocus={() => setFocused("address")}
                        onBlur={() => setFocused(null)}
                        style={{
                          borderColor: focused === "address" ? "var(--accent)" : undefined,
                          boxShadow: focused === "address" ? "0 0 0 3px rgba(124,101,255,0.12)" : undefined,
                        }}
                      />
                    </div>
                  </div>

                  {/* Key */}
                  <div>
                    <label className="label">Private Key</label>
                    <input
                      className="input input-mono"
                      type="password"
                      placeholder="0x..."
                      value={privateKey}
                      onChange={e => setPrivateKey(e.target.value)}
                      onFocus={() => setFocused("key")}
                      onBlur={() => setFocused(null)}
                      style={{
                        borderColor: focused === "key" ? "var(--accent)" : undefined,
                        boxShadow: focused === "key" ? "0 0 0 3px rgba(124,101,255,0.12)" : undefined,
                      }}
                    />
                  </div>

                  {error && (
                    <div style={{
                      display: "flex", alignItems: "center", gap: 8, padding: "10px 14px",
                      background: "rgba(255,87,87,0.08)", border: "1px solid rgba(255,87,87,0.2)",
                      borderRadius: "var(--radius-md)", fontSize: 13, color: "var(--danger)",
                    }}>
                      ✕ {error}
                    </div>
                  )}

                  <button className="btn btn-primary" type="submit" style={{
                    width: "100%", justifyContent: "center", marginTop: 6,
                    padding: "13px 24px", fontSize: 15, borderRadius: "var(--radius-md)",
                    background: "linear-gradient(135deg, var(--accent-dim), var(--accent))",
                    boxShadow: "0 4px 24px rgba(124,101,255,0.3)",
                  }}>
                    Open Vault →
                  </button>
                </form>

                {/* Divider */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0" }}>
                  <div style={{ flex: 1, height: 1, background: "var(--border-faint)" }} />
                  <span style={{ fontSize: 11, color: "var(--text-4)", fontWeight: 600, letterSpacing: "0.06em" }}>RESOURCES</span>
                  <div style={{ flex: 1, height: 1, background: "var(--border-faint)" }} />
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  {[
                    { label: "ShelbyUSD Faucet", href: "https://docs.shelby.xyz/apis/faucet/shelbyusd" },
                    { label: "CLI Setup", href: "https://docs.shelby.xyz/tools/cli" },
                  ].map(link => (
                    <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer"
                      style={{
                        flex: 1, textAlign: "center", padding: "9px 12px",
                        background: "var(--surface-2)", border: "1px solid var(--border-faint)",
                        borderRadius: "var(--radius-md)", fontSize: 12, fontWeight: 600,
                        color: "var(--text-3)", textDecoration: "none", transition: "all 0.15s",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--border-accent)"; e.currentTarget.style.color = "var(--accent)"; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border-faint)"; e.currentTarget.style.color = "var(--text-3)"; }}>
                      {link.label} →
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* FOOTER */}
        <footer style={{
          borderTop: "1px solid rgba(255,255,255,0.04)",
          padding: "16px 48px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <HexLogo size={18} />
            <span style={{ fontSize: 12, color: "var(--text-4)" }}>Shelby Media Vault</span>
          </div>
          <div style={{ display: "flex", gap: 24 }}>
            {[
              ["shelby.xyz", "https://shelby.xyz"],
              ["Docs", "https://docs.shelby.xyz"],
              ["GitHub", "https://github.com/shelby/shelby-quickstart"],
            ].map(([label, href]) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                style={{ fontSize: 12, color: "var(--text-4)", textDecoration: "none", transition: "color 0.15s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--text-2)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--text-4)")}>
                {label}
              </a>
            ))}
          </div>
        </footer>
      </div>

      <style>{`
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </div>
  );
}

function HexLogo({ size = 36 }: { size?: number }) {
  const s = size;
  const r = s * 0.42;
  const cx = s / 2, cy = s / 2;
  const pts = Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i - Math.PI / 6;
    return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
  }).join(" ");

  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} style={{ flexShrink: 0 }}>
      <defs>
        <linearGradient id="hexGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5a46d4" />
          <stop offset="100%" stopColor="#7c65ff" />
        </linearGradient>
      </defs>
      <polygon points={pts} fill="url(#hexGrad)" />
      <circle cx={cx} cy={cy} r={r * 0.38} fill="rgba(255,255,255,0.15)" />
    </svg>
  );
}
