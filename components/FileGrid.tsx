"use client";
import { VaultFile, formatBytes } from "@/types/vault";

const TYPE_CONFIG: Record<string, { icon:string; color:string; bg:string; border:string }> = {
  image:    { icon:"🖼", color:"#00d4ff", bg:"rgba(0,212,255,0.05)",    border:"rgba(0,212,255,0.1)" },
  video:    { icon:"🎬", color:"#a78bfa", bg:"rgba(167,139,250,0.05)",  border:"rgba(167,139,250,0.1)" },
  audio:    { icon:"🎵", color:"#00e5b0", bg:"rgba(0,229,176,0.05)",    border:"rgba(0,229,176,0.1)" },
  document: { icon:"📄", color:"#ffaa00", bg:"rgba(255,170,0,0.05)",    border:"rgba(255,170,0,0.1)" },
  other:    { icon:"📦", color:"rgba(255,255,255,0.3)", bg:"rgba(255,255,255,0.02)", border:"rgba(255,255,255,0.06)" },
};

interface FileGridProps {
  files: VaultFile[];
  onSelect: (f: VaultFile) => void;
  onCopyLink?: (f: VaultFile) => void;
  emptyMessage?: string;
}

export default function FileGrid({ files, onSelect, onCopyLink, emptyMessage }: FileGridProps) {
  if (files.length === 0) {
    return (
      <div style={{ textAlign:"center", padding:"80px 20px" }}>
        <div style={{
          width:72, height:72, margin:"0 auto 20px",
          background:"rgba(255,140,0,0.05)", border:"1px solid rgba(255,140,0,0.1)",
          borderRadius:18, display:"flex", alignItems:"center", justifyContent:"center", fontSize:30,
        }}>⬡</div>
        <p style={{ color:"rgba(255,255,255,0.25)", fontSize:15 }}>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(210px,1fr))", gap:12 }}>
      {files.map((file, i) => (
        <FileCard key={file.blobName} file={file} onSelect={onSelect} onCopyLink={onCopyLink} index={i} />
      ))}
    </div>
  );
}

function FileCard({ file, onSelect, onCopyLink, index }: {
  file: VaultFile; onSelect:(f:VaultFile)=>void; onCopyLink?:(f:VaultFile)=>void; index:number;
}) {
  const cfg = TYPE_CONFIG[file.type] || TYPE_CONFIG.other;
  const date = new Date(file.uploadedAt).toLocaleDateString("en-US", { month:"short", day:"numeric" });

  return (
    <div
      className="anim-fade-up"
      style={{
        background:"rgba(14,13,10,0.8)", border:"1px solid rgba(255,140,0,0.07)",
        borderRadius:14, overflow:"hidden", cursor:"pointer",
        transition:"all 0.22s cubic-bezier(0.22,1,0.36,1)",
        animationDelay:`${index * 0.04}s`,
        position:"relative",
      }}
      onClick={() => onSelect(file)}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.borderColor = "rgba(255,140,0,0.25)";
        el.style.transform = "translateY(-4px)";
        el.style.boxShadow = "0 16px 48px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,140,0,0.1)";
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.borderColor = "rgba(255,140,0,0.07)";
        el.style.transform = "translateY(0)";
        el.style.boxShadow = "none";
      }}
    >
      {/* Thumbnail */}
      <div style={{
        height:144, background:cfg.bg,
        display:"flex", alignItems:"center", justifyContent:"center",
        position:"relative", overflow:"hidden",
        borderBottom:`1px solid ${cfg.border}`,
      }}>
        {file.type === "image" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={`/api/download?blob=${encodeURIComponent(file.blobName)}&inline=true`}
            alt={file.name} style={{ width:"100%", height:"100%", objectFit:"cover" }}
            onError={e => { (e.target as HTMLImageElement).style.display="none"; }} />
        ) : (
          <span style={{ fontSize:40 }}>{cfg.icon}</span>
        )}

        {/* Type badge */}
        <div style={{
          position:"absolute", top:10, left:10,
          background:"rgba(8,8,6,0.8)", backdropFilter:"blur(8px)",
          border:`1px solid ${cfg.border}`,
          borderRadius:100, padding:"3px 10px",
          fontSize:10, fontWeight:700, color:cfg.color,
          letterSpacing:"0.06em", textTransform:"uppercase",
        }}>
          {file.type}
        </div>

        {/* Quick copy link button */}
        {onCopyLink && (
          <button
            onClick={e => { e.stopPropagation(); onCopyLink(file); }}
            style={{
              position:"absolute", top:8, right:8,
              width:28, height:28, borderRadius:7,
              background:"rgba(8,8,6,0.8)", backdropFilter:"blur(8px)",
              border:"1px solid rgba(255,140,0,0.15)",
              color:"rgba(255,255,255,0.5)", fontSize:13,
              cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center",
              transition:"all 0.15s", opacity:0,
            }}
            className="copy-btn"
            title="Copy share link"
            onMouseEnter={e=>{e.currentTarget.style.color="#ffaa00"; e.currentTarget.style.borderColor="rgba(255,140,0,0.4)";}}
            onMouseLeave={e=>{e.currentTarget.style.color="rgba(255,255,255,0.5)"; e.currentTarget.style.borderColor="rgba(255,140,0,0.15)";}}>
            ⎘
          </button>
        )}
      </div>

      {/* Info */}
      <div style={{ padding:"12px 14px" }}>
        <p className="truncate" title={file.name}
          style={{ fontWeight:700, fontSize:13, color:"rgba(255,255,255,0.85)", marginBottom:5 }}>
          {file.name}
        </p>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ fontSize:11, color:"rgba(255,255,255,0.25)", fontFamily:"var(--mono)" }}>{formatBytes(file.size)}</span>
          <span style={{ fontSize:11, color:"rgba(255,255,255,0.2)" }}>{date}</span>
        </div>
      </div>

      <style>{`.copy-btn { opacity: 0 !important; } div:hover > div > .copy-btn { opacity: 1 !important; }`}</style>
    </div>
  );
}
