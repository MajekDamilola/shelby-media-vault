"use client";

import { useState } from "react";
import { VaultFile, formatBytes } from "@/types/vault";

interface FilePreviewModalProps {
  file: VaultFile;
  onClose: () => void;
}

export default function FilePreviewModal({ file, onClose }: FilePreviewModalProps) {
  const [copied, setCopied] = useState(false);
  const downloadUrl = `/api/download?blob=${encodeURIComponent(file.blobName)}`;
  const inlineUrl = `/api/download?blob=${encodeURIComponent(file.blobName)}&inline=true`;

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/share/${encodeURIComponent(file.blobName)}`
      : file.shareUrl || "";

  async function handleCopyLink() {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const uploadedDate = new Date(file.uploadedAt).toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(9,9,15,0.9)",
        backdropFilter: "blur(10px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 300,
        padding: 20,
      }}
    >
      <div
        className="card animate-fade-up"
        style={{
          width: "100%",
          maxWidth: 680,
          maxHeight: "90vh",
          overflow: "auto",
          position: "relative",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <div style={{ minWidth: 0 }}>
            <h2
              style={{
                fontSize: 17,
                fontWeight: 700,
                marginBottom: 2,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {file.name}
            </h2>
            <p style={{ color: "var(--text-2)", fontFamily: "var(--font-mono)", fontSize: 11 }}>
              {formatBytes(file.size)} · {file.mimeType}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--text-2)",
              fontSize: 20,
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            ✕
          </button>
        </div>

        {/* Preview area */}
        <div
          style={{
            padding: 24,
            minHeight: 240,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "var(--bg)",
          }}
        >
          {file.type === "image" && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={inlineUrl}
              alt={file.name}
              style={{ maxWidth: "100%", maxHeight: 400, borderRadius: 8, objectFit: "contain" }}
            />
          )}
          {file.type === "video" && (
            <video
              src={inlineUrl}
              controls
              style={{ maxWidth: "100%", maxHeight: 400, borderRadius: 8 }}
            />
          )}
          {file.type === "audio" && (
            <div style={{ width: "100%", textAlign: "center" }}>
              <div style={{ fontSize: 64, marginBottom: 20 }}>🎵</div>
              <audio src={inlineUrl} controls style={{ width: "100%" }} />
            </div>
          )}
          {(file.type === "document" || file.type === "other") && (
            <div style={{ textAlign: "center", color: "var(--text-2)" }}>
              <div style={{ fontSize: 64, marginBottom: 12 }}>
                {file.type === "document" ? "📄" : "📦"}
              </div>
              <p style={{ fontSize: 14 }}>Preview not available</p>
            </div>
          )}
        </div>

        {/* Metadata */}
        <div
          style={{
            padding: "16px 24px",
            borderTop: "1px solid var(--border)",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
          }}
        >
          {[
            { label: "Uploaded", value: uploadedDate },
            { label: "Size", value: formatBytes(file.size) },
            ...(file.merkleRoot
              ? [{ label: "Merkle Root", value: `${file.merkleRoot.slice(0, 16)}...` }]
              : []),
            { label: "Blob Name", value: file.blobName.split("/").pop() || file.blobName },
          ].map((item) => (
            <div key={item.label}>
              <p style={{ fontSize: 10, color: "var(--text-2)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 2 }}>
                {item.label}
              </p>
              <p style={{ fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--text)" }}>
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div
          style={{
            padding: "16px 24px",
            borderTop: "1px solid var(--border)",
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <a
            href={downloadUrl}
            download={file.name}
            className="btn-primary"
            style={{ textDecoration: "none", display: "inline-block" }}
          >
            ↓ Download
          </a>
          <button className="btn-ghost" onClick={handleCopyLink}>
            {copied ? "✓ Copied!" : "⎘ Copy Share Link"}
          </button>
        </div>
      </div>
    </div>
  );
}
