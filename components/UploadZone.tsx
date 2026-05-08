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
      <div className="anim-scale-in" style={{
        width:"100%", maxWidth:520, padding:36,
        background:"rgba(12,11,8,0.97)", backdropFilter:"blur(28px)",
        border:"1px solid rgba(255,140,0,0.15)", borderRadius:20,
        position:"relative", overflow:"hidden",
        boxShadow:"0 32px 80px rgba(0,0,0,0.7)",
      }}>
        {/* Top amber accent line */}
        <div style={{ position:"absolute", top:0, left:"20%", right:"20%", height:1, background:"linear-gradient(90deg,transparent,#ffaa00,transparent)" }}/>

        {/* Corner hex decoration */}
        <div style={{ position:"absolute", bottom:-20, right:-20, opacity:0.08 }}>
          {[60,42,28].map((r,i) => (
            <svg key={i} style={{ position:"absolute", bottom:0, right:0 }} width={r*2} height={r*2} viewBox={`0 0 ${r*2} ${r*2}`}>
              <polygon points={Array.from({length:6},(_,j)=>{
                const a=(Math.PI/3)*j-Math.PI/6;
                return `${r+r*0.9*Math.cos(a)},${r+r*0.9*Math.sin(a)}`;
              }).join(" ")} fill="none" stroke="#ffaa00" strokeWidth="1"/>
            </svg>
          ))}
        </div>

        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:28 }}>
          <div>
            <h3 style={{ fontSize:19, fontWeight:800, color:"#fff", letterSpacing:"-0.02em", marginBottom:4 }}>Upload to Shelby</h3>
            <p style={{ fontSize:13, color:"rgba(255,255,255,0.35)" }}>Store media on the decentralized network</p>
          </div>
          {!isUploading && (
            <button onClick={onClose} style={{
              width:32, height:32, borderRadius:8, background:"rgba(255,255,255,0.04)",
              border:"1px solid rgba(255,255,255,0.07)", color:"rgba(255,255,255,0.3)",
              fontSize:16, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.15s",
            }}
              onMouseEnter={e=>{e.currentTarget.style.color="#ff5757"; e.currentTarget.style.borderColor="rgba(255,87,87,0.3)";}}
              onMouseLeave={e=>{e.currentTarget.style.color="rgba(255,255,255,0.3)"; e.currentTarget.style.borderColor="rgba(255,255,255,0.07)";}}>
              ✕
            </button>
          )}
        </div>

        {/* SUCCESS */}
        {isDone && uploadProgress.file && (
          <div style={{ textAlign:"center", padding:"16px 0 8px" }}>
            <div style={{
              width:68, height:68, borderRadius:18, margin:"0 auto 20px",
              background:"rgba(0,229,176,0.08)", border:"1px solid rgba(0,229,176,0.2)",
              display:"flex", alignItems:"center", justifyContent:"center", fontSize:30,
            }}>✓</div>
            <h4 style={{ color:"#00e5b0", fontWeight:800, marginBottom:6, fontSize:17 }}>Stored on Shelby!</h4>
            <p style={{ fontSize:13, color:"rgba(255,255,255,0.4)", marginBottom:8 }}>{uploadProgress.file.name}</p>
            {uploadProgress.file.merkleRoot && (
              <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,140,0,0.1)", borderRadius:8, padding:"8px 14px", marginBottom:20 }}>
                <span style={{ fontFamily:"var(--mono)", fontSize:11, color:"rgba(255,255,255,0.25)" }}>
                  merkle: {uploadProgress.file.merkleRoot.slice(0,28)}…
                </span>
              </div>
            )}
            <button onClick={onClose} style={{
              width:"100%", padding:"13px 24px", border:"none", borderRadius:10, cursor:"pointer",
              background:"linear-gradient(135deg,#ffcc00,#ff8800)", color:"#080806",
              fontSize:15, fontWeight:800, fontFamily:"var(--font)",
            }}>
              Back to Vault
            </button>
          </div>
        )}

        {/* FORM */}
        {!isDone && (<>
          {/* Drop zone */}
          <div
            onDragOver={e=>{e.preventDefault(); setDragOver(true);}}
            onDragLeave={()=>setDragOver(false)}
            onDrop={handleDrop}
            onClick={()=>!file && inputRef.current?.click()}
            style={{
              border:`2px dashed ${dragOver ? "#ffaa00" : file ? "#00e5b0" : "rgba(255,140,0,0.2)"}`,
              borderRadius:14, padding:"28px 24px", textAlign:"center",
              cursor:file?"default":"pointer", transition:"all 0.2s",
              background:dragOver ? "rgba(255,170,0,0.04)" : file ? "rgba(0,229,176,0.03)" : "rgba(255,255,255,0.02)",
              marginBottom:20,
            }}>
            <input ref={inputRef} type="file"
              onChange={e=>{const f=e.target.files?.[0]; if(f) setFile(f);}}
              style={{display:"none"}} accept="image/*,video/*,audio/*,application/pdf"/>
            {file ? (
              <div>
                <div style={{ fontSize:38, marginBottom:10 }}>{getIcon(file)}</div>
                <p style={{ fontWeight:700, fontSize:14, color:"rgba(255,255,255,0.85)", marginBottom:4 }}>{file.name}</p>
                <p style={{ fontSize:12, fontFamily:"var(--mono)", color:"rgba(255,255,255,0.3)", marginBottom:12 }}>
                  {formatBytes(file.size)} · {file.type}
                </p>
                <button onClick={e=>{e.stopPropagation(); setFile(null);}}
                  style={{ background:"transparent", border:"none", fontSize:12, color:"#ff5757", cursor:"pointer", fontFamily:"var(--font)", fontWeight:700 }}>
                  ✕ Remove
                </button>
              </div>
            ) : (
              <div>
                <div style={{
                  width:52, height:52, borderRadius:13,
                  background:"rgba(255,140,0,0.06)", border:"1px solid rgba(255,140,0,0.15)",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  margin:"0 auto 14px", fontSize:20, color:"rgba(255,170,0,0.6)",
                }}>↑</div>
                <p style={{ fontWeight:700, fontSize:14, color:"rgba(255,255,255,0.7)", marginBottom:6 }}>Drop file here</p>
                <p style={{ fontSize:12, color:"rgba(255,255,255,0.25)" }}>or click to browse · Images, video, audio, PDF</p>
              </div>
            )}
          </div>

          {/* Storage slider */}
          <div style={{ marginBottom:22 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
              <label style={{ fontSize:11, fontWeight:700, letterSpacing:"0.09em", textTransform:"uppercase", color:"rgba(255,255,255,0.3)" }}>Storage Duration</label>
              <span style={{ fontFamily:"var(--mono)", fontSize:13, color:"#ffaa00", fontWeight:700 }}>{days} days</span>
            </div>
            <input type="range" min={1} max={365} value={days} onChange={e=>setDays(Number(e.target.value))}/>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:"rgba(255,255,255,0.2)", fontFamily:"var(--mono)", marginTop:5 }}>
              <span>1 day</span><span>365 days</span>
            </div>
          </div>

          {/* Progress */}
          {isUploading && (
            <div style={{ marginBottom:16 }}>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:"rgba(255,255,255,0.4)", marginBottom:8 }}>
                <span>{uploadProgress.message}</span>
                <span style={{ fontFamily:"var(--mono)", color:"#ffaa00", fontWeight:700 }}>{uploadProgress.progress}%</span>
              </div>
              <div style={{ height:3, background:"rgba(255,255,255,0.06)", borderRadius:100, overflow:"hidden" }}>
                <div style={{ height:"100%", width:`${uploadProgress.progress}%`, background:"linear-gradient(90deg,#ff8800,#ffcc00)", borderRadius:100, transition:"width 0.4s ease" }}/>
              </div>
            </div>
          )}

          {/* Error */}
          {uploadProgress.status === "error" && (
            <div style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 14px", background:"rgba(255,87,87,0.08)", border:"1px solid rgba(255,87,87,0.2)", borderRadius:9, marginBottom:14, fontSize:13, color:"#ff5757" }}>
              ✕ {uploadProgress.error}
            </div>
          )}

          <button onClick={()=>file && onUpload(file,days)} disabled={!file||isUploading}
            style={{
              width:"100%", padding:"13px 24px", border:"none", borderRadius:10, cursor:"pointer",
              background: (!file||isUploading) ? "rgba(255,255,255,0.06)" : "linear-gradient(135deg,#ffcc00,#ff8800)",
              color: (!file||isUploading) ? "rgba(255,255,255,0.3)" : "#080806",
              fontSize:15, fontWeight:800, fontFamily:"var(--font)",
              transition:"all 0.18s", display:"flex", alignItems:"center", justifyContent:"center", gap:8,
            }}>
            {isUploading ? (
              <><span className="spinner" style={{width:16,height:16,borderWidth:2,borderTopColor:"#ffaa00"}}/> Uploading to Shelby…</>
            ) : "Upload to Shelby Network"}
          </button>
        </>)}
      </div>
    </div>
  );
}
