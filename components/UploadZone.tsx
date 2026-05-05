"use client";

import { useState, useRef, useCallback } from "react";
import { UploadProgress, VaultFile } from "@/types/vault";
import { formatBytes } from "@/types/vault";

interface UploadZoneProps {
  uploadProgress: UploadProgress;
  onUpload: (file: File, storageDays: number) => Promise<VaultFile | null>;
  onClose: () => void;
}

export default function UploadZone({ uploadProgress, onUpload, onClose }: UploadZoneProps) {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [storageDays, setStorageDays] = useState(30);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) setSelectedFile(f);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setSelectedFile(f);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    await onUpload(selectedFile, storageDays);
  };

  const isUploading = uploadProgress.status === "uploading";
  const isDone = uploadProgress.status === "success";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(9,9,15,0.85)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 200,
        padding: 20,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !isUploading) onClose();
      }}
    >
      <div
        className="card animate-fade-up"
        style={{
          width: "100%",
          maxWidth: 520,
          padding: 32,
          position: "relative",
        }}
      >
        {/* Close */}
        {!isUploading && (
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: 16,
              right: 16,
              background: "transparent",
              border: "none",
              color: "var(--text-2)",
              fontSize: 20,
              cursor: "pointer",
              lineHeight: 1,
            }}
          >
            ✕
          </button>
        )}

        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>
          Upload to Shelby
        </h2>

        {/* Success state */}
        {isDone && uploadProgress.file && (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>✓</div>
            <p style={{ color: "var(--success)", fontWeight: 600, marginBottom: 8 }}>
              File stored on Shelby!
            </p>
            <p style={{ color: "var(--text-2)", fontFamily: "var(--font-mono)", fontSize: 12, marginBottom: 4 }}>
              {uploadProgress.file.name}
            </p>
            {uploadProgress.file.merkleRoot && (
              <p style={{ color: "var(--text-2)", fontFamily: "var(--font-mono)", fontSize: 11, wordBreak: "break-all" }}>
                Merkle root: {uploadProgress.file.merkleRoot.slice(0, 20)}...
              </p>
            )}
            <button
              className="btn-primary"
              style={{ marginTop: 20 }}
              onClick={onClose}
            >
              Back to Vault
            </button>
          </div>
        )}

        {/* Upload form */}
        {!isDone && (
          <>
            {/* Drop zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => !selectedFile && inputRef.current?.click()}
              style={{
                border: `2px dashed ${dragOver ? "var(--accent)" : selectedFile ? "var(--success)" : "var(--border)"}`,
                borderRadius: 12,
                padding: 40,
                textAlign: "center",
                cursor: selectedFile ? "default" : "pointer",
                transition: "all 0.2s",
                background: dragOver ? "rgba(108,92,231,0.05)" : "transparent",
                marginBottom: 20,
              }}
            >
              <input
                ref={inputRef}
                type="file"
                onChange={handleFileChange}
                style={{ display: "none" }}
                accept="image/*,video/*,audio/*,application/pdf"
              />
              {selectedFile ? (
                <div>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>
                    {selectedFile.type.startsWith("image/") ? "🖼" :
                     selectedFile.type.startsWith("video/") ? "🎬" :
                     selectedFile.type.startsWith("audio/") ? "🎵" : "📄"}
                  </div>
                  <p style={{ fontWeight: 600, marginBottom: 4 }}>{selectedFile.name}</p>
                  <p style={{ color: "var(--text-2)", fontFamily: "var(--font-mono)", fontSize: 12 }}>
                    {formatBytes(selectedFile.size)} · {selectedFile.type}
                  </p>
                  <button
                    onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}
                    style={{ marginTop: 12, fontSize: 12, color: "var(--danger)", background: "none", border: "none", cursor: "pointer" }}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.4 }}>↑</div>
                  <p style={{ fontWeight: 600, marginBottom: 6 }}>Drop file here</p>
                  <p style={{ color: "var(--text-2)", fontSize: 13 }}>
                    or click to browse · Images, video, audio, PDF
                  </p>
                </div>
              )}
            </div>

            {/* Storage duration */}
            <div style={{ marginBottom: 20 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "var(--text-2)",
                  marginBottom: 8,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                Storage Duration: {storageDays} days
              </label>
              <input
                type="range"
                min={1}
                max={365}
                value={storageDays}
                onChange={(e) => setStorageDays(Number(e.target.value))}
                style={{ width: "100%", accentColor: "var(--accent)" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text-2)", fontFamily: "var(--font-mono)", marginTop: 4 }}>
                <span>1 day</span>
                <span>365 days</span>
              </div>
            </div>

            {/* Upload progress */}
            {isUploading && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--text-2)", marginBottom: 6 }}>
                  <span>{uploadProgress.message}</span>
                  <span>{uploadProgress.progress}%</span>
                </div>
                <div
                  style={{
                    height: 4,
                    background: "var(--bg-3)",
                    borderRadius: 2,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${uploadProgress.progress}%`,
                      background: "var(--accent)",
                      borderRadius: 2,
                      transition: "width 0.3s ease",
                    }}
                  />
                </div>
              </div>
            )}

            {/* Error */}
            {uploadProgress.status === "error" && (
              <p style={{ color: "var(--danger)", fontSize: 13, fontFamily: "var(--font-mono)", marginBottom: 12 }}>
                ✗ {uploadProgress.error}
              </p>
            )}

            <button
              className="btn-primary"
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              style={{ width: "100%" }}
            >
              {isUploading ? "Uploading to Shelby..." : "Upload to Shelby Network"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
