"use client";

import { useState } from "react";
import { useVault } from "@/hooks/useVault";
import { useWallet } from "@/hooks/useWallet";
import UploadZone from "@/components/UploadZone";
import FileGrid from "@/components/FileGrid";
import FilePreviewModal from "@/components/FilePreviewModal";
import { VaultFile, formatBytes } from "@/types/vault";

export default function VaultPage() {
  const { address } = useWallet();
  const { files, loading, error, uploadProgress, uploadFile, resetUpload, refetch } = useVault();
  const [selectedFile, setSelectedFile] = useState<VaultFile | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [showUpload, setShowUpload] = useState(false);

  const totalSize = files.reduce((sum, f) => sum + f.size, 0);

  const filteredFiles = files.filter((f) => {
    const matchSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchType = filterType === "all" || f.type === filterType;
    return matchSearch && matchType;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      {/* Header */}
      <div
        className="animate-fade-up"
        style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}
      >
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 4 }}>
            My Vault
          </h1>
          <p style={{ color: "var(--text-2)", fontFamily: "var(--font-mono)", fontSize: 12 }}>
            {address?.slice(0, 8)}...{address?.slice(-6)} · {files.length} files · {formatBytes(totalSize)}
          </p>
        </div>
        <button
          className="btn-primary"
          onClick={() => { setShowUpload(true); resetUpload(); }}
        >
          + Upload Media
        </button>
      </div>

      {/* Stats bar */}
      <div
        className="animate-fade-up"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: 12,
          animationDelay: "0.05s",
        }}
      >
        {[
          { label: "Total Files", value: files.length },
          { label: "Images", value: files.filter((f) => f.type === "image").length },
          { label: "Videos", value: files.filter((f) => f.type === "video").length },
          { label: "Audio", value: files.filter((f) => f.type === "audio").length },
          { label: "Total Size", value: formatBytes(totalSize) },
        ].map((stat) => (
          <div
            key={stat.label}
            className="card"
            style={{ padding: "16px 20px" }}
          >
            <div style={{ fontSize: 22, fontWeight: 800, color: "var(--accent-2)" }}>
              {stat.value}
            </div>
            <div style={{ fontSize: 11, color: "var(--text-2)", marginTop: 2, letterSpacing: "0.05em", textTransform: "uppercase" }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div
        className="animate-fade-up"
        style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", animationDelay: "0.1s" }}
      >
        <input
          className="input"
          style={{ maxWidth: 280 }}
          type="text"
          placeholder="Search files..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div style={{ display: "flex", gap: 6 }}>
          {["all", "image", "video", "audio", "document"].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              style={{
                padding: "8px 14px",
                borderRadius: 8,
                border: `1px solid ${filterType === t ? "var(--accent)" : "var(--border)"}`,
                background: filterType === t ? "rgba(108,92,231,0.15)" : "transparent",
                color: filterType === t ? "var(--accent-2)" : "var(--text-2)",
                fontSize: 12,
                fontFamily: "var(--font-mono)",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {t}
            </button>
          ))}
        </div>
        <button
          className="btn-ghost"
          style={{ marginLeft: "auto", fontSize: 12 }}
          onClick={refetch}
        >
          ↻ Refresh
        </button>
      </div>

      {/* File grid */}
      {loading ? (
        <div style={{ textAlign: "center", padding: 80, color: "var(--text-2)" }}>
          <div
            style={{
              width: 32,
              height: 32,
              border: "2px solid var(--border)",
              borderTopColor: "var(--accent)",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
              margin: "0 auto 16px",
            }}
          />
          Loading vault...
        </div>
      ) : error ? (
        <div
          className="card"
          style={{
            padding: 40,
            textAlign: "center",
            borderColor: "rgba(225, 112, 85, 0.3)",
          }}
        >
          <p style={{ color: "var(--danger)", marginBottom: 12 }}>⚠ {error}</p>
          <button className="btn-ghost" onClick={refetch}>
            Try again
          </button>
        </div>
      ) : (
        <FileGrid
          files={filteredFiles}
          onSelect={setSelectedFile}
          emptyMessage={
            files.length === 0
              ? "Your vault is empty. Upload your first file!"
              : "No files match your search."
          }
        />
      )}

      {/* Upload modal */}
      {showUpload && (
        <UploadZone
          uploadProgress={uploadProgress}
          onUpload={uploadFile}
          onClose={() => setShowUpload(false)}
        />
      )}

      {/* Preview modal */}
      {selectedFile && (
        <FilePreviewModal
          file={selectedFile}
          onClose={() => setSelectedFile(null)}
        />
      )}
    </div>
  );
}
