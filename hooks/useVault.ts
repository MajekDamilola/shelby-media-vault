"use client";

import { useState, useEffect, useCallback } from "react";
import { VaultFile, UploadProgress } from "@/types/vault";
import { useWallet } from "./useWallet";

export function useVault() {
  const { address, privateKey, isConnected } = useWallet();
  const [files, setFiles] = useState<VaultFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    status: "idle",
    progress: 0,
  });

  const fetchFiles = useCallback(async () => {
    if (!address) return;
    setLoading(true);
    setError(null);
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
    if (isConnected && address) {
      fetchFiles();
    } else {
      setFiles([]);
    }
  }, [isConnected, address, fetchFiles]);

  const uploadFile = useCallback(
    async (file: File, storageDays: number = 30) => {
      if (!address || !privateKey) {
        setUploadProgress({
          status: "error",
          progress: 0,
          error: "Wallet not connected",
        });
        return null;
      }

      setUploadProgress({ status: "uploading", progress: 10, message: "Preparing upload..." });

      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("accountAddress", address);
        formData.append("privateKey", privateKey);
        formData.append("storageDays", String(storageDays));

        setUploadProgress({ status: "uploading", progress: 40, message: "Uploading to Shelby network..." });

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const { error: errMsg } = await res.json();
          throw new Error(errMsg || "Upload failed");
        }

        const { file: newFile } = await res.json();

        setUploadProgress({
          status: "success",
          progress: 100,
          message: "File stored on Shelby!",
          file: newFile,
        });

        setFiles((prev) => [newFile, ...prev]);
        return newFile as VaultFile;
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Upload failed";
        setUploadProgress({ status: "error", progress: 0, error: msg });
        return null;
      }
    },
    [address, privateKey]
  );

  const resetUpload = useCallback(() => {
    setUploadProgress({ status: "idle", progress: 0 });
  }, []);

  return {
    files,
    loading,
    error,
    uploadProgress,
    uploadFile,
    resetUpload,
    refetch: fetchFiles,
  };
}
