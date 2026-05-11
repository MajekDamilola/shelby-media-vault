"use client";
import { useState } from "react";
import { useVault } from "@/hooks/useVault";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useToast } from "@/components/Toast";
import UploadZone from "@/components/UploadZone";
import FileGrid from "@/components/FileGrid";
import FilePreviewModal from "@/components/FilePreviewModal";
import { VaultFile, formatBytes } from "@/types/vault";

const FILTER_TABS = [
  { id: "all", label: "All" },
  { id: "image", label: "Images" },
  { id: "video", label: "Videos" },
  { id: "audio", label: "Audio" },
  { id: "document", label: "Docs" },
];

export default function VaultPage() {
  const { account } = useWallet();
  const address = account?.address?.toString() ?? "";
  const toast = useToast();
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

  async function handleUpload(file: File, days: number) {
    return uploadFile(file, days,
      (f) => toast.success("File stored on Shelby!", f.name),
      (msg) => toast.error("Upload failed", msg),
    );
  }

  function handleRefetch() { refetch(); toast.info("Refreshing vault…"); }

  async function handleCopyLink(file: VaultFile) {
    const url = `${window.location.origin}/share/${encodeURIComponent(file.blobName)}`;
    await navigator.clipboard.writeText(url);
    toast.success("Link copied!", file.name);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32, position: "relative", zIndex: 1 }}>

      {/* HEADER */}
      <div className="anim-fade-up" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16, paddingTop: 8 }}>
        <div>
          <h2 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 6 }}>My Vault</h2>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontFamily: "var(--mono)", fontSize: 12, color: "rgba(255,255,255,0.3)" }}>
              {address ? `${address.slice(0, 8)}…${address.slice(-6)}` : "…"}
            </span>
            <span style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "inline-block" }} />
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>{files.length} files · {formatBytes(totalSize)}</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={handleRefetch} style={{ padding: "8px 16px", borderRadius: 9, background: "transparent", border: "1px solid rgba(255,140,0,0.15)", color: "rgba(255,255,255,0.5)", fontSize: 13, fontWeight: 600, fontFamily: "var(--font)", cursor: "pointer" }}>
            ↻ Refresh
          </button>
          <button onClick={() => { setShowUpload(true); resetUpload(); }} style={{ padding: "8px 20px", borderRadius: 9, background: "linear-gradient(135deg,#ffcc00,#ff8800)", border: "none", color: "#080806", fontSize: 13, fontWeight: 800, fontFamily: "var(--font)", cursor: "pointer" }}>
            + Upload
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="anim-fade-up delay-1" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px,1fr))", gap: 10 }}>
        {[
          { label: "Total files", value: files.length },
          { label: "Images", value: files.filter(f => f.type === "image").length },
          { label: "Videos", value: files.filter(f => f.type === "video").length },
          { label: "Audio", value: files.filter(f => f.type === "audio").length },
          { label: "Total size", value: formatBytes(totalSize) },
        ].map((stat, i) => (
          <div key={stat.label} style={{ background: "rgba(14,13,10,0.8)", border: "1px solid rgba(255,140,0,0.08)", borderRadius: 14, padding: "16px 20px" }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: i === 0 ? "#ffaa00" : "rgba(255,255,255,0.85)", letterSpacing: "-0.02em", lineHeight: 1 }}>{stat.value}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 6, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* FILTERS */}
      <div className="anim-fade-up delay-2" style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: "0 0 260px" }}>
          <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)", fontSize: 14, pointerEvents: "none" }}>⌕</span>
          <input className="input" type="text" placeholder="Search files…" value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 36 }} />
        </div>
        <div style={{ display: "flex", gap: 4, background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: 4, border: "1px solid rgba(255,140,0,0.06)" }}>
          {FILTER_TABS.map(tab => (
            <button key={tab.id} onClick={() => setFilter(tab.id)} style={{
              background: filter === tab.id ? "rgba(255,140,0,0.12)" : "transparent",
              border: filter === tab.id ? "1px solid rgba(255,140,0,0.2)" : "1px solid transparent",
              color: filter === tab.id ? "#ffaa00" : "rgba(255,255,255,0.35)",
              borderRadius: 7, padding: "5px 14px", fontSize: 12, fontWeight: 700,
              fontFamily: "var(--font)", cursor: "pointer", transition: "all 0.15s",
            }}>{tab.label}</button>
          ))}
        </div>
      </div>

      {/* FILES */}
      {loading ? <LoadingSkeleton /> : error ? <ErrorState message={error} onRetry={refetch} /> : (
        <div className="anim-fade-up delay-3">
          <FileGrid files={filtered} onSelect={setSelected} onCopyLink={handleCopyLink}
            emptyMessage={files.length === 0 ? "Your vault is empty — upload your first file!" : "No files match your search."} />
        </div>
      )}

      {showUpload && <UploadZone uploadProgress={uploadProgress} onUpload={handleUpload} onClose={() => setShowUpload(false)} />}
      {selected && <FilePreviewModal file={selected} onClose={() => setSelected(null)} onCopyLink={() => handleCopyLink(selected)} />}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 12 }}>
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} style={{ borderRadius: 14, overflow: "hidden", border: "1px solid rgba(255,140,0,0.05)" }}>
          <div className="skeleton" style={{ height: 130 }} />
          <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: 8 }}>
            <div className="skeleton" style={{ height: 14, width: "75%" }} />
            <div className="skeleton" style={{ height: 11, width: "50%" }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div style={{ textAlign: "center", padding: "60px 20px" }}>
      <div style={{ width: 56, height: 56, borderRadius: 14, background: "rgba(255,87,87,0.08)", border: "1px solid rgba(255,87,87,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 24 }}>⚠</div>
      <p style={{ color: "#ff5757", marginBottom: 4, fontWeight: 700 }}>Failed to load vault</p>
      <p style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", marginBottom: 20 }}>{message}</p>
      <button onClick={onRetry} style={{ padding: "8px 20px", borderRadius: 8, background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)", fontSize: 13, fontFamily: "var(--font)", cursor: "pointer" }}>Try again</button>
    </div>
  );
}
