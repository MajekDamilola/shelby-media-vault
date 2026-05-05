export type MediaType = "image" | "video" | "audio" | "document" | "other";

export interface VaultFile {
  blobName: string;
  name: string;
  size: number;
  type: MediaType;
  mimeType: string;
  uploadedAt: string; // ISO string
  merkleRoot?: string;
  accountAddress: string;
  shareUrl?: string;
}

export interface UploadProgress {
  status: "idle" | "uploading" | "success" | "error";
  progress: number;
  message?: string;
  file?: VaultFile;
  error?: string;
}

export function getMediaType(mimeType: string): MediaType {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("video/")) return "video";
  if (mimeType.startsWith("audio/")) return "audio";
  if (
    mimeType === "application/pdf" ||
    mimeType.includes("document") ||
    mimeType.includes("text/")
  )
    return "document";
  return "other";
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}
