"use client";
import { VaultFile, formatBytes } from "@/types/vault";

const TYPE_CONFIG: Record<string, { icon:string; color:string; bg:string }> = {
  image:    { icon:"🖼", color:"var(--cyan)",    bg:"rgba(0,212,255,0.06)" },
  video:    { icon:"🎬", color:"#a78bfa",        bg:"rgba(167,139,250,0.06)" },
  audio:    { icon:"🎵", color:"var(--success)", bg:"rgba(0,229,176,0.06)" },
  document: { icon:"📄", color:"var(--warning)", bg:"rgba(255,181,71,0.06)" },
  other:    { icon:"📦", color:"var(--text-2)",  bg:"var(--surface-2)" },
};

interface FileGridProps {
  files: VaultFile[];
  onSelect: (f: VaultFile) => void;
  emptyMessage?: string;
}

export default function FileGrid({ files, onSelect, emptyMessage }: FileGridProps) {
  if (files.length === 0) {
    return (
      <div style={{ textAlign:"center", padding:"80px 20px" }}>
        <div style={{
          width:72, height:72, margin:"0 auto 20px",
          background:"var(--surface-2)", border:"1px solid var(--border-subtle)",
          borderRadius:"var(--radius-xl)", display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:30, color:"var(--text-4)",
        }}>◈</div>
        <p style={{ color:"var(--text-3)", fontSize:15 }}>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(210px,1fr))", gap:12 }}>
      {files.map((file, i) => <FileCard key={file.blobName} file={file} onSelect={onSelect} index={i} />)}
    </div>
  );
}

function FileCard({ file, onSelect, index }: { file:VaultFile; onSelect:(f:VaultFile)=>void; index:number }) {
  const cfg = TYPE_CONFIG[file.type] || TYPE_CONFIG.other;
  const date = new Date(file.uploadedAt).toLocaleDateString("en-US", { month:"short", day:"numeric" });

  return (
    <div
      className="anim-fade-up"
      onClick={() => onSelect(file)}
      style={{
        background:"var(--surface)", border:"1px solid var(--border-subtle)",
        borderRadius:"var(--radius-lg)", overflow:"hidden", cursor:"pointer",
        transition:"all 0.2s ease",
        animationDelay:`${index * 0.04}s`,
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.borderColor = "var(--border-accent)";
        el.style.transform = "translateY(-3px)";
        el.style.boxShadow = "0 12px 40px rgba(0,0,0,0.3)";
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.borderColor = "var(--border-subtle)";
        el.style.transform = "translateY(0)";
        el.style.boxShadow = "none";
      }}
    >
      {/* Thumbnail */}
      <div style={{
        height:140, background:cfg.bg,
        display:"flex", alignItems:"center", justifyContent:"center",
        position:"relative", overflow:"hidden",
        borderBottom:"1px solid var(--border-faint)",
      }}>
        {file.type === "image" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`/api/download?blob=${encodeURIComponent(file.blobName)}&inline=true`}
            alt={file.name}
            style={{ width:"100%", height:"100%", objectFit:"cover" }}
            onError={e => { (e.target as HTMLImageElement).style.display="none"; }}
          />
        ) : (
          <span style={{ fontSize:38 }}>{cfg.icon}</span>
        )}

        {/* Type badge */}
        <div style={{
          position:"absolute", top:10, right:10,
          background:"rgba(4,4,10,0.75)", backdropFilter:"blur(8px)",
          border:"1px solid var(--border-subtle)", borderRadius:"var(--radius-full)",
          padding:"3px 10px", fontSize:10, fontWeight:700,
          color:cfg.color, letterSpacing:"0.06em", textTransform:"uppercase",
        }}>
          {file.type}
        </div>
      </div>

      {/* Info */}
      <div style={{ padding:"12px 14px" }}>
        <p className="truncate" title={file.name}
          style={{ fontWeight:600, fontSize:13, color:"var(--text-1)", marginBottom:5 }}>
          {file.name}
        </p>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ fontSize:11, color:"var(--text-3)", fontFamily:"var(--mono)" }}>{formatBytes(file.size)}</span>
          <span style={{ fontSize:11, color:"var(--text-4)" }}>{date}</span>
        </div>
      </div>
    </div>
  );
}
