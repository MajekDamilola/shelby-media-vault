"use client";

import { VaultFile, formatBytes } from "@/types/vault";

const TYPE_ICONS: Record<string, string> = {
  image: "🖼",
  video: "🎬",
  audio: "🎵",
  document: "📄",
  other: "📦",
};

const TYPE_COLORS: Record<string, string> = {
  image: "rgba(0,206,201,0.12)",
  video: "rgba(108,92,231,0.12)",
  audio: "rgba(253,203,110,0.12)",
  document: "rgba(162,155,254,0.12)",
  other: "rgba(144,144,176,0.08)",
};

interface FileGridProps {
  files: VaultFile[];
  onSelect: (file: VaultFile) => void;
  emptyMessage?: string;
}

export default function FileGrid({ files, onSelect, emptyMessage }: FileGridProps) {
  if (files.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "80px 20px",
          color: "var(--text-2)",
        }}
      >
        <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.3 }}>◈</div>
        <p style={{ fontSize: 15 }}>{emptyMessage || "No files found"}</p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        gap: 12,
      }}
    >
      {files.map((file, i) => (
        <FileCard
          key={file.blobName}
          file={file}
          onSelect={onSelect}
          index={i}
        />
      ))}
    </div>
  );
}

function FileCard({
  file,
  onSelect,
  index,
}: {
  file: VaultFile;
  onSelect: (f: VaultFile) => void;
  index: number;
}) {
  const uploadedDate = new Date(file.uploadedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div
      className="card animate-fade-up"
      onClick={() => onSelect(file)}
      style={{
        cursor: "pointer",
        overflow: "hidden",
        animationDelay: `${index * 0.04}s`,
      }}
    >
      {/* Thumbnail / icon */}
      <div
        style={{
          height: 120,
          background: TYPE_COLORS[file.type] || TYPE_COLORS.other,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 40,
          borderBottom: "1px solid var(--border)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {file.type === "image" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`/api/download?blob=${encodeURIComponent(file.blobName)}&inline=true`}
            alt={file.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <span>{TYPE_ICONS[file.type]}</span>
        )}

        {/* Type badge */}
        <span
          style={{
            position: "absolute",
            bottom: 8,
            right: 8,
            background: "rgba(9,9,15,0.8)",
            border: "1px solid var(--border)",
            borderRadius: 4,
            padding: "2px 6px",
            fontSize: 10,
            fontFamily: "var(--font-mono)",
            color: "var(--text-2)",
            textTransform: "uppercase",
          }}
        >
          {file.type}
        </span>
      </div>

      {/* Info */}
      <div style={{ padding: "12px 14px" }}>
        <p
          style={{
            fontWeight: 600,
            fontSize: 13,
            marginBottom: 4,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          title={file.name}
        >
          {file.name}
        </p>
        <p
          style={{
            color: "var(--text-2)",
            fontFamily: "var(--font-mono)",
            fontSize: 11,
          }}
        >
          {formatBytes(file.size)} · {uploadedDate}
        </p>
      </div>
    </div>
  );
}
