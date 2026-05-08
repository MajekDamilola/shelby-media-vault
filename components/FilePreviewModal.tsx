"use client";
import { useState } from "react";
import { VaultFile, formatBytes } from "@/types/vault";

interface Props { file: VaultFile; onClose: () => void; onCopyLink?: () => void; }

export default function FilePreviewModal({ file, onClose, onCopyLink }: Props) {
  const [copied, setCopied] = useState(false);
  const downloadUrl = `/api/download?blob=${encodeURIComponent(file.blobName)}`;
  const inlineUrl   = `/api/download?blob=${encodeURIComponent(file.blobName)}&inline=true`;
  const shareUrl    = typeof window !== "undefined"
    ? `${window.location.origin}/share/${encodeURIComponent(file.blobName)}` : "";

  async function copyLink() {
    onCopyLink?.();
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  }

  const date = new Date(file.uploadedAt).toLocaleString("en-US", {
    month:"long", day:"numeric", year:"numeric", hour:"2-digit", minute:"2-digit",
  });

  return (
    <div className="modal-backdrop" onClick={e=>{if(e.target===e.currentTarget) onClose();}}>
      <div className="anim-scale-in" style={{
        width:"100%", maxWidth:700, maxHeight:"92vh",
        display:"flex", flexDirection:"column", overflow:"hidden",
        background:"rgba(12,11,8,0.97)", backdropFilter:"blur(28px)",
        border:"1px solid rgba(255,140,0,0.15)", borderRadius:20,
        boxShadow:"0 32px 80px rgba(0,0,0,0.7)",
        position:"relative",
      }}>
        {/* Top accent */}
        <div style={{ position:"absolute", top:0, left:"20%", right:"20%", height:1, background:"linear-gradient(90deg,transparent,#ffaa00,transparent)" }}/>

        {/* Header */}
        <div style={{ padding:"20px 24px", borderBottom:"1px solid rgba(255,140,0,0.08)", display:"flex", alignItems:"center", gap:14, flexShrink:0 }}>
          <div style={{ flex:1, minWidth:0 }}>
            <h4 className="truncate" style={{ marginBottom:3, fontSize:16, fontWeight:800, color:"#fff" }}>{file.name}</h4>
            <div style={{ display:"flex", gap:10, alignItems:"center" }}>
              <span style={{ fontFamily:"var(--mono)", fontSize:11, color:"rgba(255,255,255,0.3)" }}>{formatBytes(file.size)}</span>
              <span style={{ fontSize:11, color:"rgba(255,255,255,0.15)" }}>·</span>
              <span style={{ fontSize:11, color:"rgba(255,255,255,0.25)" }}>{file.mimeType}</span>
            </div>
          </div>
          <button onClick={onClose} style={{
            width:32, height:32, borderRadius:8, background:"rgba(255,255,255,0.04)",
            border:"1px solid rgba(255,255,255,0.07)", color:"rgba(255,255,255,0.3)",
            fontSize:16, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center",
            transition:"all 0.15s", flexShrink:0,
          }}
            onMouseEnter={e=>{e.currentTarget.style.color="#ff5757"; e.currentTarget.style.borderColor="rgba(255,87,87,0.3)";}}
            onMouseLeave={e=>{e.currentTarget.style.color="rgba(255,255,255,0.3)"; e.currentTarget.style.borderColor="rgba(255,255,255,0.07)";}}>
            ✕
          </button>
        </div>

        {/* Preview */}
        <div style={{
          flex:1, overflow:"auto", background:"#08080600",
          display:"flex", alignItems:"center", justifyContent:"center",
          minHeight:240, maxHeight:400, padding:28,
          background:"rgba(6,6,4,0.6)",
        }}>
          {file.type === "image" && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={inlineUrl} alt={file.name} style={{ maxWidth:"100%", maxHeight:"100%", borderRadius:10, objectFit:"contain" }}/>
          )}
          {file.type === "video" && (
            <video src={inlineUrl} controls style={{ maxWidth:"100%", maxHeight:"100%", borderRadius:10 }}/>
          )}
          {file.type === "audio" && (
            <div style={{ textAlign:"center", width:"100%" }}>
              <div style={{ fontSize:56, marginBottom:20 }}>🎵</div>
              <audio src={inlineUrl} controls style={{ width:"100%" }}/>
            </div>
          )}
          {(file.type==="document"||file.type==="other") && (
            <div style={{ textAlign:"center", color:"rgba(255,255,255,0.25)" }}>
              <div style={{ fontSize:52, marginBottom:12 }}>{file.type==="document"?"📄":"📦"}</div>
              <p style={{ fontSize:14 }}>Preview not available for this file type</p>
            </div>
          )}
        </div>

        {/* Metadata */}
        <div style={{ padding:"16px 24px", borderTop:"1px solid rgba(255,140,0,0.06)", display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, flexShrink:0 }}>
          {[
            { k:"Uploaded", v:date },
            { k:"File size", v:formatBytes(file.size) },
            ...(file.merkleRoot ? [{k:"Merkle root", v:`${file.merkleRoot.slice(0,22)}…`}] : []),
            { k:"Network", v:"Shelby Devnet" },
          ].map(item => (
            <div key={item.k}>
              <div style={{ fontSize:10, color:"rgba(255,255,255,0.2)", textTransform:"uppercase", letterSpacing:"0.09em", fontWeight:700, marginBottom:3 }}>{item.k}</div>
              <div style={{ fontSize:12, fontFamily:"var(--mono)", color:"rgba(255,255,255,0.5)" }}>{item.v}</div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div style={{ padding:"16px 24px", borderTop:"1px solid rgba(255,140,0,0.06)", display:"flex", gap:8, flexWrap:"wrap", flexShrink:0 }}>
          <a href={downloadUrl} download={file.name}
            style={{
              padding:"9px 20px", borderRadius:9, textDecoration:"none",
              background:"linear-gradient(135deg,#ffcc00,#ff8800)", color:"#080806",
              fontSize:13, fontWeight:800, fontFamily:"var(--font)",
              display:"inline-flex", alignItems:"center", gap:6,
              boxShadow:"0 4px 20px rgba(255,140,0,0.25)", transition:"all 0.18s",
            }}
            onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 6px 28px rgba(255,140,0,0.4)"; e.currentTarget.style.transform="translateY(-1px)";}}
            onMouseLeave={e=>{e.currentTarget.style.boxShadow="0 4px 20px rgba(255,140,0,0.25)"; e.currentTarget.style.transform="";}}>
            ↓ Download
          </a>
          <button onClick={copyLink} style={{
            padding:"9px 20px", borderRadius:9,
            background: copied ? "rgba(0,229,176,0.1)" : "rgba(255,255,255,0.04)",
            border:`1px solid ${copied ? "rgba(0,229,176,0.3)" : "rgba(255,140,0,0.12)"}`,
            color: copied ? "#00e5b0" : "rgba(255,255,255,0.6)",
            fontSize:13, fontWeight:700, fontFamily:"var(--font)", cursor:"pointer",
            transition:"all 0.18s", display:"flex", alignItems:"center", gap:6,
          }}>
            {copied ? "✓ Copied!" : "⎘ Copy Share Link"}
          </button>
          <a href={shareUrl} target="_blank" rel="noopener noreferrer"
            style={{
              marginLeft:"auto", padding:"9px 16px", borderRadius:9,
              background:"transparent", border:"1px solid rgba(255,255,255,0.06)",
              color:"rgba(255,255,255,0.3)", fontSize:13, fontWeight:600,
              fontFamily:"var(--font)", textDecoration:"none", transition:"all 0.15s",
              display:"inline-flex", alignItems:"center",
            }}
            onMouseEnter={e=>{e.currentTarget.style.color="rgba(255,255,255,0.7)"; e.currentTarget.style.borderColor="rgba(255,255,255,0.15)";}}
            onMouseLeave={e=>{e.currentTarget.style.color="rgba(255,255,255,0.3)"; e.currentTarget.style.borderColor="rgba(255,255,255,0.06)";}}>
            Share Page ↗
          </a>
        </div>
      </div>
    </div>
  );
}
