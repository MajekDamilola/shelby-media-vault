"use client";
import { useState, useRef, useCallback } from "react";
import { UploadProgress, VaultFile, formatBytes } from "@/types/vault";

interface Props {
  uploadProgress: UploadProgress;
  onUpload: (file: File, days: number) => Promise<VaultFile | null>;
  onClose: () => void;
}

export default function UploadZone({ uploadProgress, onUpload, onClose }: Props) {
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [days, setDays] = useState(30);
  const inputRef = useRef<HTMLInputElement>(null);
  const isUploading = uploadProgress.status === "uploading";
  const isDone = uploadProgress.status === "success";

  const getIcon = (f: File) => {
    if (f.type.startsWith("image/")) return "🖼";
    if (f.type.startsWith("video/")) return "🎬";
    if (f.type.startsWith("audio/")) return "🎵";
    return "📄";
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) setFile(f);
  }, []);

  return (
    <div className="modal-backdrop" onClick={e => { if (e.target === e.currentTarget && !isUploading) onClose(); }}>
      <div className="glass anim-scale-in" style={{ width:"100%", maxWidth:520, padding:36, position:"relative", overflow:"hidden" }}>

        {/* Decorative accent */}
        <div style={{ position:"absolute", top:-80, right:-80, width:220, height:220, borderRadius:"50%", background:"radial-gradient(circle, rgba(124,101,255,0.12), transparent 70%)", pointerEvents:"none" }} />

        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:28 }}>
          <div>
            <h3 style={{ marginBottom:4 }}>Upload to Shelby</h3>
            <p style={{ fontSize:13, color:"var(--text-3)" }}>Store media on the decentralized network</p>
          </div>
          {!isUploading && (
            <button className="btn btn-ghost btn-icon" onClick={onClose} style={{ fontSize:18, color:"var(--text-3)" }}>✕</button>
          )}
        </div>

        {/* SUCCESS STATE */}
        {isDone && uploadProgress.file && (
          <div style={{ textAlign:"center", padding:"20px 0" }}>
            <div style={{
              width:72, height:72, borderRadius:"var(--radius-xl)",
              background:"var(--success-soft)", border:"1px solid rgba(0,229,176,0.25)",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:32, margin:"0 auto 20px",
            }}>✓</div>
            <h4 style={{ marginBottom:6, color:"var(--success)" }}>Stored on Shelby!</h4>
            <p style={{ fontSize:13, color:"var(--text-2)", marginBottom:6 }}>{uploadProgress.file.name}</p>
            {uploadProgress.file.merkleRoot && (
              <div style={{ background:"var(--surface-2)", border:"1px solid var(--border-faint)", borderRadius:"var(--radius-md)", padding:"8px 14px", marginBottom:20 }}>
                <span style={{ fontFamily:"var(--mono)", fontSize:11, color:"var(--text-3)" }}>
                  {uploadProgress.file.merkleRoot.slice(0,32)}…
                </span>
              </div>
            )}
            <button className="btn btn-primary" onClick={onClose} style={{ width:"100%", justifyContent:"center" }}>
              Back to Vault
            </button>
          </div>
        )}

        {/* UPLOAD FORM */}
        {!isDone && (<>

          {/* Drop zone */}
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => !file && inputRef.current?.click()}
            style={{
              border:`2px dashed ${dragOver ? "var(--accent)" : file ? "var(--success)" : "var(--border-default)"}`,
              borderRadius:"var(--radius-lg)", padding:"32px 24px", textAlign:"center",
              cursor: file ? "default" : "pointer",
              transition:"all 0.2s ease",
              background: dragOver ? "var(--accent-soft)" : file ? "var(--success-soft)" : "var(--surface-2)",
              marginBottom:20,
            }}>
            <input ref={inputRef} type="file" onChange={e => { const f = e.target.files?.[0]; if (f) setFile(f); }} style={{ display:"none" }}
              accept="image/*,video/*,audio/*,application/pdf" />

            {file ? (
              <div>
                <div style={{ fontSize:40, marginBottom:12 }}>{getIcon(file)}</div>
                <p style={{ fontWeight:600, fontSize:14, color:"var(--text-1)", marginBottom:4 }}>{file.name}</p>
                <p style={{ fontSize:12, fontFamily:"var(--mono)", color:"var(--text-3)", marginBottom:12 }}>{formatBytes(file.size)} · {file.type}</p>
                <button onClick={e => { e.stopPropagation(); setFile(null); }}
                  style={{ background:"transparent", border:"none", fontSize:12, color:"var(--danger)", cursor:"pointer", fontFamily:"var(--font)", fontWeight:600 }}>
                  ✕ Remove
                </button>
              </div>
            ) : (
              <div>
                <div style={{ width:56, height:56, borderRadius:"var(--radius-lg)", background:"var(--surface-3)", border:"1px solid var(--border-default)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px", fontSize:22, color:"var(--text-3)" }}>↑</div>
                <p style={{ fontWeight:600, fontSize:14, color:"var(--text-1)", marginBottom:6 }}>Drop file here</p>
                <p style={{ fontSize:12, color:"var(--text-3)" }}>or click to browse · Images, video, audio, PDF</p>
              </div>
            )}
          </div>

          {/* Storage duration */}
          <div style={{ marginBottom:20 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
              <label className="label" style={{ marginBottom:0 }}>Storage Duration</label>
              <span style={{ fontFamily:"var(--mono)", fontSize:13, color:"var(--accent)", fontWeight:600 }}>{days} days</span>
            </div>
            <input type="range" min={1} max={365} value={days} onChange={e => setDays(Number(e.target.value))} />
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:"var(--text-4)", fontFamily:"var(--mono)", marginTop:6 }}>
              <span>1 day</span><span>365 days</span>
            </div>
          </div>

          {/* Progress */}
          {isUploading && (
            <div style={{ marginBottom:16 }}>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:"var(--text-2)", marginBottom:8 }}>
                <span>{uploadProgress.message}</span>
                <span style={{ fontFamily:"var(--mono)", color:"var(--accent)" }}>{uploadProgress.progress}%</span>
              </div>
              <div className="progress-track"><div className="progress-fill" style={{ width:`${uploadProgress.progress}%` }} /></div>
            </div>
          )}

          {/* Error */}
          {uploadProgress.status === "error" && (
            <div style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 14px", background:"var(--danger-soft)", border:"1px solid rgba(255,87,87,0.2)", borderRadius:"var(--radius-md)", marginBottom:14, fontSize:13, color:"var(--danger)" }}>
              <span>✕</span> {uploadProgress.error}
            </div>
          )}

          <button className="btn btn-primary" onClick={() => file && onUpload(file, days)}
            disabled={!file || isUploading} style={{ width:"100%", justifyContent:"center" }}>
            {isUploading
              ? <><span className="spinner" style={{ width:16, height:16, borderWidth:2 }} /> Uploading to Shelby…</>
              : "Upload to Shelby Network"
            }
          </button>
        </>)}
      </div>
    </div>
  );
}
