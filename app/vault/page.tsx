"use client";
import { useState } from "react";
import { useVault } from "@/hooks/useVault";
import { useWallet } from "@/hooks/useWallet";
import UploadZone from "@/components/UploadZone";
import FileGrid from "@/components/FileGrid";
import FilePreviewModal from "@/components/FilePreviewModal";
import { VaultFile, formatBytes } from "@/types/vault";

const FILTER_TABS = [
  { id:"all", label:"All" },
  { id:"image", label:"Images" },
  { id:"video", label:"Videos" },
  { id:"audio", label:"Audio" },
  { id:"document", label:"Docs" },
];

export default function VaultPage() {
  const { address } = useWallet();
  const { files, loading, error, uploadProgress, uploadFile, resetUpload, refetch } = useVault();
  const [selected, setSelected] = useState<VaultFile | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [showUpload, setShowUpload] = useState(false);

  const totalSize = files.reduce((s, f) => s + f.size, 0);
  const filtered = files.filter(f =>
    (filter === "all" || f.type === filter) &&
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:32, position:"relative", zIndex:1 }}>

      {/* ── PAGE HEADER ── */}
      <div className="anim-fade-up" style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", flexWrap:"wrap", gap:16, paddingTop:8 }}>
        <div>
          <h2 style={{ fontSize:28, fontWeight:700, letterSpacing:"-0.02em", marginBottom:6 }}>My Vault</h2>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <span style={{ fontFamily:"var(--mono)", fontSize:12, color:"var(--text-3)" }}>
              {address?.slice(0,8)}...{address?.slice(-6)}
            </span>
            <span style={{ width:3, height:3, borderRadius:"50%", background:"var(--text-4)", display:"inline-block" }} />
            <span style={{ fontSize:12, color:"var(--text-3)" }}>{files.length} files · {formatBytes(totalSize)}</span>
          </div>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <button className="btn btn-ghost btn-sm" onClick={refetch} title="Refresh">
            ↻
          </button>
          <button className="btn btn-primary" onClick={() => { setShowUpload(true); resetUpload(); }}>
            + Upload
          </button>
        </div>
      </div>

      {/* ── STATS ── */}
      <div className="anim-fade-up delay-1" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(130px,1fr))", gap:10 }}>
        {[
          { label:"Total files", value:files.length, color:"var(--accent)" },
          { label:"Images",      value:files.filter(f=>f.type==="image").length, color:"var(--cyan)" },
          { label:"Videos",      value:files.filter(f=>f.type==="video").length, color:"#a78bfa" },
          { label:"Audio",       value:files.filter(f=>f.type==="audio").length, color:"var(--success)" },
          { label:"Total size",  value:formatBytes(totalSize), color:"var(--warning)" },
        ].map(stat => (
          <div key={stat.label} style={{
            background:"var(--surface)", border:"1px solid var(--border-subtle)",
            borderRadius:"var(--radius-lg)", padding:"16px 20px",
          }}>
            <div style={{ fontSize:22, fontWeight:700, color:stat.color, letterSpacing:"-0.02em", lineHeight:1 }}>{stat.value}</div>
            <div style={{ fontSize:11, color:"var(--text-3)", marginTop:6, textTransform:"uppercase", letterSpacing:"0.06em", fontWeight:600 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* ── FILTERS & SEARCH ── */}
      <div className="anim-fade-up delay-2" style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
        {/* Search */}
        <div style={{ position:"relative", flex:"0 0 260px" }}>
          <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:"var(--text-3)", fontSize:14, pointerEvents:"none" }}>⌕</span>
          <input className="input" type="text" placeholder="Search files..."
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft:36 }} />
        </div>

        {/* Type filter tabs */}
        <div style={{ display:"flex", gap:4, background:"var(--surface-2)", borderRadius:"var(--radius-md)", padding:4, border:"1px solid var(--border-faint)" }}>
          {FILTER_TABS.map(tab => (
            <button key={tab.id} onClick={() => setFilter(tab.id)}
              style={{
                background: filter === tab.id ? "var(--surface-4)" : "transparent",
                border: filter === tab.id ? "1px solid var(--border-default)" : "1px solid transparent",
                color: filter === tab.id ? "var(--text-1)" : "var(--text-3)",
                borderRadius:"var(--radius-sm)", padding:"5px 14px",
                fontSize:12, fontWeight:600, fontFamily:"var(--font)",
                cursor:"pointer", transition:"all 0.15s",
              }}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── FILE GRID ── */}
      {loading ? (
        <LoadingSkeleton />
      ) : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : (
        <div className="anim-fade-up delay-3">
          <FileGrid files={filtered} onSelect={setSelected}
            emptyMessage={files.length === 0 ? "Your vault is empty — upload your first file!" : "No files match your search."} />
        </div>
      )}

      {/* ── MODALS ── */}
      {showUpload && (
        <UploadZone uploadProgress={uploadProgress} onUpload={uploadFile} onClose={() => setShowUpload(false)} />
      )}
      {selected && (
        <FilePreviewModal file={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:12 }}>
      {Array.from({length:8}).map((_,i) => (
        <div key={i} style={{ borderRadius:"var(--radius-lg)", overflow:"hidden", border:"1px solid var(--border-faint)" }}>
          <div className="skeleton" style={{ height:130 }} />
          <div style={{ padding:"12px 14px", display:"flex", flexDirection:"column", gap:8 }}>
            <div className="skeleton" style={{ height:14, width:"75%" }} />
            <div className="skeleton" style={{ height:11, width:"50%" }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function ErrorState({ message, onRetry }: { message:string; onRetry:()=>void }) {
  return (
    <div style={{ textAlign:"center", padding:"60px 20px" }}>
      <div style={{ width:56, height:56, borderRadius:"var(--radius-lg)", background:"var(--danger-soft)", border:"1px solid rgba(255,87,87,0.2)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px", fontSize:24 }}>⚠</div>
      <p style={{ color:"var(--danger)", marginBottom:4, fontWeight:600 }}>Failed to load vault</p>
      <p style={{ color:"var(--text-3)", fontSize:13, marginBottom:20 }}>{message}</p>
      <button className="btn btn-ghost btn-sm" onClick={onRetry}>Try again</button>
    </div>
  );
}
