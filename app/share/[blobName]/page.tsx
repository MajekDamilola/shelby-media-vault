import { Metadata } from "next";

interface SharePageProps {
  params: Promise<{ blobName: string }>;
}

export async function generateMetadata({ params }: SharePageProps): Promise<Metadata> {
  const { blobName } = await params;
  const name = decodeURIComponent(blobName).split("/").pop() || "Shared File";
  return {
    title: `${name} – Shelby Media Vault`,
    description: "A file shared from Shelby Media Vault",
  };
}

export default async function SharePage({ params }: SharePageProps) {
  const { blobName } = await params;
  const decodedBlob = decodeURIComponent(blobName);
  const fileName = decodedBlob.split("/").pop() || decodedBlob;
  const downloadUrl = `/api/download?blob=${encodeURIComponent(decodedBlob)}`;
  const inlineUrl = `/api/download?blob=${encodeURIComponent(decodedBlob)}&inline=true`;

  // Guess media type from extension
  const ext = fileName.split(".").pop()?.toLowerCase() || "";
  const isImage = ["jpg", "jpeg", "png", "gif", "webp", "avif"].includes(ext);
  const isVideo = ["mp4", "webm", "mov", "ogg"].includes(ext);
  const isAudio = ["mp3", "wav", "ogg", "m4a", "flac"].includes(ext);

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 32,
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: "fixed",
          top: "40%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(108,92,231,0.1) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ width: "100%", maxWidth: 640 }}>
        {/* Header */}
        <div style={{ marginBottom: 24, display: "flex", alignItems: "center", gap: 10 }}>
          <span
            style={{
              width: 32,
              height: 32,
              background: "var(--accent)",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
            }}
          >
            ◈
          </span>
          <span style={{ fontWeight: 700, fontSize: 16 }}>Shelby Media Vault</span>
        </div>

        {/* Preview card */}
        <div className="card" style={{ overflow: "hidden" }}>
          {/* Preview */}
          <div
            style={{
              minHeight: 280,
              background: "var(--bg)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderBottom: "1px solid var(--border)",
              padding: 24,
            }}
          >
            {isImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={inlineUrl}
                alt={fileName}
                style={{ maxWidth: "100%", maxHeight: 360, borderRadius: 8, objectFit: "contain" }}
              />
            )}
            {isVideo && (
              <video
                src={inlineUrl}
                controls
                style={{ maxWidth: "100%", maxHeight: 360, borderRadius: 8 }}
              />
            )}
            {isAudio && (
              <div style={{ textAlign: "center", width: "100%" }}>
                <div style={{ fontSize: 64, marginBottom: 20 }}>🎵</div>
                <audio src={inlineUrl} controls style={{ width: "100%" }} />
              </div>
            )}
            {!isImage && !isVideo && !isAudio && (
              <div style={{ textAlign: "center", color: "var(--text-2)" }}>
                <div style={{ fontSize: 64, marginBottom: 12 }}>📄</div>
                <p>{fileName}</p>
              </div>
            )}
          </div>

          {/* Info + download */}
          <div style={{ padding: "20px 24px" }}>
            <h1 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>
              {fileName}
            </h1>
            <p style={{ color: "var(--text-2)", fontSize: 13, marginBottom: 20 }}>
              Shared via Shelby decentralized storage
            </p>
            <a
              href={downloadUrl}
              download={fileName}
              className="btn-primary"
              style={{ display: "inline-block", textDecoration: "none" }}
            >
              ↓ Download File
            </a>
          </div>
        </div>

        <p style={{ textAlign: "center", marginTop: 20, fontSize: 12, color: "var(--text-2)" }}>
          Powered by{" "}
          <a
            href="https://shelby.xyz"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--accent-2)", textDecoration: "none" }}
          >
            Shelby Network
          </a>
        </p>
      </div>
    </main>
  );
}
