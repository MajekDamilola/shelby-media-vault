"use client";

/**
 * components/UploadModal.tsx
 *
 * Implements the full Shelby 3-step upload:
 *   Step 1 — Encode: generateCommitments()
 *   Step 2 — Register: on-chain Aptos transaction via wallet
 *   Step 3 — Upload: shelbyClient.rpc.putBlob()
 */

import { useState, useRef } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { aptosClient } from ""../../lib/aptosClient";
import {
  encodeFile,
  buildRegisterPayload,
  uploadToRpc,
  type UploadStep,
} from "../../lib/shelby";

interface Props {
  onClose: () => void;
  onSuccess: () => void; // parent refreshes file list
}

interface FileState {
  file: File;
  step: UploadStep;
  error?: string;
}

const STEP_LABELS: Record<UploadStep, string> = {
  idle: "Waiting",
  encoding: "Encoding file…",
  registering: "Registering on-chain…",
  uploading: "Uploading to Shelby…",
  done: "Stored ✓",
  error: "Failed",
};

const STEP_ORDER: UploadStep[] = [
  "idle",
  "encoding",
  "registering",
  "uploading",
  "done",
];

function stepIndex(s: UploadStep) {
  return STEP_ORDER.indexOf(s);
}

function getFileType(name: string): string {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  if (["mp4", "mov", "avi", "webm"].includes(ext)) return "video";
  if (["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(ext)) return "image";
  if (["mp3", "wav", "flac"].includes(ext)) return "audio";
  if (["pdf", "doc", "docx", "txt"].includes(ext)) return "document";
  if (["zip", "tar", "gz"].includes(ext)) return "archive";
  return "file";
}

function getIcon(name: string) {
  const t = getFileType(name);
  return { video: "🎬", image: "🖼️", audio: "🎵", document: "📄", archive: "📦", file: "📁" }[t];
}

function formatBytes(b: number) {
  if (b < 1048576) return (b / 1024).toFixed(1) + " KB";
  if (b < 1073741824) return (b / 1048576).toFixed(1) + " MB";
  return (b / 1073741824).toFixed(1) + " GB";
}

export default function UploadModal({ onClose, onSuccess }: Props) {
  const { account, signAndSubmitTransaction, connected } = useWallet();
  const [files, setFiles] = useState<FileState[]>([]);
  const [isDrag, setIsDrag] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const expiryDays = 30;
  const costEst = files.length;

  function addFiles(incoming: File[]) {
    const mapped: FileState[] = incoming.map((f) => ({ file: f, step: "idle" }));
    setFiles((prev) => [...prev, ...mapped]);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDrag(false);
    addFiles(Array.from(e.dataTransfer.files));
  }

  function updateFileStep(index: number, step: UploadStep, error?: string) {
    setFiles((prev) =>
      prev.map((f, i) => (i === index ? { ...f, step, error } : f))
    );
  }

  async function runUpload() {
    if (!connected || !account) {
      setGlobalError("Please connect your Aptos wallet first.");
      return;
    }
    if (files.length === 0) return;

    setIsRunning(true);
    setGlobalError(null);
    let anyFailed = false;

    for (let i = 0; i < files.length; i++) {
      const { file } = files[i];
      try {
        // ── Step 1: Encode ──────────────────────────────────────────────────
        updateFileStep(i, "encoding");
        const commitments = await encodeFile(file);

        // ── Step 2: Register on-chain ───────────────────────────────────────
        updateFileStep(i, "registering");
        const payload = buildRegisterPayload(account.address, file, commitments);
        const tx = await signAndSubmitTransaction({ data: payload });
        await aptosClient.waitForTransaction({ transactionHash: tx.hash });

        // ── Step 3: RPC Upload ──────────────────────────────────────────────
        updateFileStep(i, "uploading");
        await uploadToRpc(account.address, file);

        updateFileStep(i, "done");
      } catch (err: any) {
        updateFileStep(i, "error", err?.message ?? "Unknown error");
        anyFailed = true;
      }
    }

    setIsRunning(false);
    if (!anyFailed) {
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1200);
    }
  }

  const allDone = files.length > 0 && files.every((f) => f.step === "done");
  const canUpload = files.length > 0 && !isRunning && !allDone;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && !isRunning && onClose()}
    >
      <div className="bg-[#14141A] border border-white/10 rounded-2xl p-7 w-[480px] max-w-[95vw] shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-lg">⬆ Upload to Shelby</h2>
          {!isRunning && (
            <button onClick={onClose} className="text-gray-500 hover:text-white text-xl leading-none">
              ×
            </button>
          )}
        </div>

        {/* Step progress dots */}
        <div className="flex gap-2 mb-5">
          {(["encoding", "registering", "uploading", "done"] as UploadStep[]).map((s) => {
            const currentMax = files.length
              ? Math.max(...files.map((f) => stepIndex(f.step)))
              : -1;
            const done = currentMax >= stepIndex(s);
            const active = files.some((f) => f.step === s);
            return (
              <div
                key={s}
                title={STEP_LABELS[s]}
                className={`flex-1 h-1 rounded-full transition-all duration-500 ${
                  done
                    ? "bg-green-400"
                    : active
                    ? "bg-yellow-400"
                    : "bg-white/10"
                }`}
              />
            );
          })}
        </div>

        {/* Drop zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDrag(true); }}
          onDragLeave={() => setIsDrag(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
            isDrag
              ? "border-yellow-400 bg-yellow-400/10"
              : "border-white/15 hover:border-yellow-400/40 hover:bg-yellow-400/5"
          }`}
        >
          <div className="text-4xl mb-3">📂</div>
          <p className="text-gray-400 text-sm">Drop files here or click to browse</p>
          <p className="text-gray-600 text-xs mt-1">Images, videos, docs — any format</p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => addFiles(Array.from(e.target.files ?? []))}
          />
        </div>

        {/* File list */}
        {files.length > 0 && (
          <div className="mt-4 flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
            {files.map((f, i) => (
              <div
                key={i}
                className="flex items-center gap-3 bg-[#1C1C24] border border-white/8 rounded-lg px-3 py-2"
              >
                <span className="text-xl">{getIcon(f.file.name)}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{f.file.name}</p>
                  <p className="text-xs text-gray-500">{formatBytes(f.file.size)}</p>
                  {/* progress bar when active */}
                  {f.step !== "idle" && f.step !== "done" && f.step !== "error" && (
                    <div className="h-0.5 bg-white/10 rounded mt-1 overflow-hidden">
                      <div
                        className="h-full bg-yellow-400 rounded transition-all duration-700"
                        style={{ width: `${(stepIndex(f.step) / 3) * 100}%` }}
                      />
                    </div>
                  )}
                </div>
                <span
                  className={`text-xs font-mono shrink-0 ${
                    f.step === "done"
                      ? "text-green-400"
                      : f.step === "error"
                      ? "text-red-400"
                      : f.step === "idle"
                      ? "text-gray-600"
                      : "text-yellow-400"
                  }`}
                >
                  {f.step === "error" ? "✗ Failed" : STEP_LABELS[f.step]}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Upload options */}
        <div className="mt-4 border-t border-white/8 pt-4 flex flex-col gap-2">
          {[
            ["Network", "Testnet"],
            ["Expiry", `${expiryDays} days`],
            ["Estimated cost", `${costEst} ShelbyUSD`],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between text-xs">
              <span className="text-gray-500">{k}</span>
              <span className="font-mono text-yellow-400">{v}</span>
            </div>
          ))}
        </div>

        {/* Global error */}
        {globalError && (
          <p className="mt-3 text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
            ⚠ {globalError}
          </p>
        )}

        {/* Actions */}
        <div className="flex gap-3 mt-5">
          <button
            onClick={onClose}
            disabled={isRunning}
            className="flex-1 py-2.5 rounded-lg border border-white/10 text-gray-400 text-sm hover:text-white hover:border-white/20 transition disabled:opacity-40"
          >
            {allDone ? "Close" : "Cancel"}
          </button>
          <button
            onClick={runUpload}
            disabled={!canUpload}
            className="flex-[2] py-2.5 rounded-lg bg-gradient-to-r from-yellow-500 to-amber-600 text-black font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isRunning ? (
              <>
                <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                Uploading…
              </>
            ) : allDone ? (
              "✓ All done!"
            ) : (
              `Upload ${files.length} file${files.length !== 1 ? "s" : ""}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
