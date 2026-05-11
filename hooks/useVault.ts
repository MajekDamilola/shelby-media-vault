"use client";
import { useState, useEffect, useCallback } from "react";
import { VaultFile, UploadProgress } from "@/types/vault";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

export function useVault() {
  const { account, connected } = useWallet();
  const address = account?.address?.toString();
  const [files, setFiles] = useState<VaultFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({ status: "idle", progress: 0 });

  const fetchFiles = useCallback(async () => {
    if (!address) return;
    setLoading(true); setError(null);
    try {
      const res = await fetch(`/api/files?account=${address}`);
      if (!res.ok) throw new Error(await res.text());
      const { files: fetched } = await res.json();
      setFiles(fetched);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load files");
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => {
    if (connected && address) fetchFiles();
    else setFiles([]);
  }, [connected, address, fetchFiles]);

  const uploadFile = useCallback(async (
    file: File, storageDays = 30,
    onSuccess?: (f: VaultFile) => void,
    onError?: (msg: string) => void,
  ) => {
    if (!address) { onError?.("Wallet not connected"); return null; }
    setUploadProgress({ status: "uploading", progress: 10, message: "Preparing upload…" });
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("accountAddress", address);
      formData.append("storageDays", String(storageDays));
      setUploadProgress({ status: "uploading", progress: 40, message: "Uploading to Shelby network…" });
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) { const { error: e } = await res.json(); throw new Error(e || "Upload failed"); }
      const { file: newFile } = await res.json();
      setUploadProgress({ status: "success", progress: 100, message: "Stored on Shelby!", file: newFile });
      setFiles(prev => [newFile, ...prev]);
      onSuccess?.(newFile);
      return newFile as VaultFile;
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Upload failed";
      setUploadProgress({ status: "error", progress: 0, error: msg });
      onError?.(msg);
      return null;
    }
  }, [address]);

  const resetUpload = useCallback(() => setUploadProgress({ status: "idle", progress: 0 }), []);
  return { files, loading, error, uploadProgress, uploadFile, resetUpload, refetch: fetchFiles };
}