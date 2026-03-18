"use client";

import { useState, useCallback } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import UploadModal from "./UploadModal";

function formatBytes(b: number) {
  if (b < 1048576) return (b / 1024).toFixed(1) + " KB";
  if (b < 1073741824) return (b / 1048576).toFixed(1) + " MB";
  return (b / 1073741824).toFixed(1) + " GB";
}

function getFileType(name: string) {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  if (["mp4", "mov", "avi", "webm"].includes(ext)) return "video";
  if (["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(ext)) return "image";
  if (["mp3", "wav", "flac"].includes(ext)) return "audio";
  if (["pdf", "doc", "docx", "txt"].includes(ext)) return "document";
  if (["zip", "tar", "gz"].includes(ext)) return "archive";
  return "file";
}

interface VaultFile {
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
  url: string;
}

export default function VaultDashboard() {
  const { account, connected, connect, disconnect, wallets } = useWallet();
  const [files, setFiles] = useState<VaultFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const fetchFiles = useCallback(async () => {
    if (!connected || !account) return;
    setLoading(true);
    try {
      setFiles([]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [connected, account]);

  const filtered = files.filter((f) => {
    const typeMatch = filter === "all" || f.type === filter;
    const searchMatch = !search || f.name.toLowerCase().includes(search.toLowerCase());
    return typeMatch && searchMatch;
  });

  const totalSize = files.reduce((a, f) => a + f.size, 0);

  if (!connected) {
    return (
      <div className="min-h-screen bg-[#0A0A0C] flex flex-col items-center justify-center gap-6 px-6 text-white">
        <h1 className="font-extrabold text-2xl text-center">
          Connect your wallet to access the Vault
        </h1>
        <p className="text-gray-400 text-sm text-center max-w-sm">
          Your files are tied to your Aptos wallet address.
        </p>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          {wallets && wallets.length > 0 ? (
            wallets.map((wallet) => (
              <button
                key={wallet.name}
                onClick={() => connect(wallet.name)}
                className="w-full bg-[#16161D] border border-white/10 rounded-xl px-5 py-3 hover:border-yellow-400/40 transition text-white text-left"
              >
                {wallet.name}
              </button>
            ))
          ) : (
            <div className="text-center text-sm text-gray-500">
              <p>No Aptos wallets detected.</p>
              
                href="https://petra.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow-400 underline mt-1 inline-block"
              >
                Install Petra Wallet
              </a>
            </div>
          )}
        </div>
        <a href="/" className="text-xs text-gray-600 hover:text-gray-400">
          Back to home
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-white flex">

      <aside className="w-52 bg-[#0F0F13] border-r border-white/10 flex flex-col">
        <div className="flex items-center gap-2 px-4 py-5 border-b border-white/10">
          <div className="w-7 h-7 bg-yellow-400 rounded-lg flex items-center justify-center text-sm font-bold text-black">
            S
          </div>
          <span className="font-bold text-sm">Shelby Vault</span>
        </div>

        <nav className="flex flex-col gap-1 p-2 mt-2">
          <div className="flex items-center justify-between px-3 py-2 rounded-lg text-sm bg-yellow-400/10 text-yellow-400">
            <span>My Vault</span>
            <span className="text-[10px] bg-yellow-400/20 px-1.5 py-0.5 rounded-full">
              {files.length}
            </span>
          </div>
          <div className="px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white cursor-pointer">
            Shared Links
          </div>
          <div className="px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white cursor-pointer">
            Activity
          </div>
        </nav>

        <div className="px-4 mt-4">
          <p className="text-[10px] uppercase tracking-widest text-gray-600 mb-2">
            Storage
          </p>
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>{formatBytes(totalSize)}</span>
            <span className="text-yellow-500">unlimited</span>
          </div>
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full w-[5%] bg-yellow-400 rounded-full" />
          </div>
        </div>

        <div className="mt-auto p-3 border-t border-white/10">
          <div className="bg-[#16161D] border border-white/10 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
              <span className="text-xs text-gray-400">Connected</span>
            </div>
            <p className="font-mono text-[11px] text-gray-500 truncate">
              {account?.address?.slice(0, 6)}...{account?.address?.slice(-4)}
            </p>
            <button
              onClick={disconnect}
              className="mt-2 text-[11px] text-gray-600 hover:text-red-400 transition"
            >
              Disconnect
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">

        <div className="h-14 flex items-center px-6 border-b border-white/10 gap-3">
          <span className="font-bold">My Vault</span>
          <div className="flex items-center gap-2 bg-[#16161D] border border-white/10 rounded-lg px-3 py-1.5 ml-4 flex-1 max-w-xs">
            <input
              className="bg-transparent outline-none text-sm text-white placeholder-gray-600 w-full"
              placeholder="Search files..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={fetchFiles}
              className="bg-[#16161D] border border-white/10 text-gray-400 px-3 py-1.5 rounded-lg text-sm hover:text-white transition"
            >
              Refresh
            </button>
            <button
              onClick={() => setShowUpload(true)}
              className="bg-gradient-to-r from-yellow-500 to-amber-600 text-black font-bold text-sm px-4 py-1.5 rounded-lg hover:opacity-90 transition"
            >
              Upload
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">

          <div className="grid grid-cols-4 gap-3 mb-6">
            <div className="bg-[#16161D] border border-white/10 rounded-xl p-4">
              <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">Total Files</p>
              <p className="font-bold text-2xl text-yellow-400">{files.length}</p>
            </div>
            <div className="bg-[#16161D] border border-white/10 rounded-xl p-4">
              <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">Storage Used</p>
              <p className="font-bold text-2xl">{formatBytes(totalSize)}</p>
            </div>
            <div className="bg-[#16161D] border border-white/10 rounded-xl p-4">
              <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">Videos</p>
              <p className="font-bold text-2xl">
                {files.filter((f) => f.type === "video").length}
              </p>
            </div>
            <div className="bg-[#16161D] border border-white/10 rounded-xl p-4">
              <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">Network</p>
              <p className="font-bold text-xl">Testnet</p>
              <p className="text-[11px] text-green-400 mt-1">Active</p>
            </div>
          </div>

          <div className="flex gap-2 mb-4">
            {["all", "image", "video", "document", "audio"].map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-3 py-1 rounded-full text-xs border transition capitalize ${
                  filter === t
                    ? "bg-yellow-400/15 border-yellow-400/30 text-yellow-400"
                    : "border-white/10 text-gray-400 hover:text-white"
                }`}
              >
                {t === "all" ? "All Files" : t + "s"}
              </button>
            ))}
          </div>

          {loading && (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-2 border-gray-700 border-t-yellow-400 rounded-full animate-spin" />
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="text-gray-400 font-semibold text-lg">
                Your vault is empty
              </p>
              <p className="text-gray-600 text-sm mt-2">
                Click Upload to store your first file on Shelby
              </p>
              <button
                onClick={() => setShowUpload(true)}
                className="mt-6 bg-gradient-to-r from-yellow-500 to-amber-600 text-black font-bold px-6 py-2.5 rounded-xl hover:opacity-90 transition text-sm"
              >
                Upload your first file
              </button>
            </div>
          )}

          {!loading && filtered.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {filtered.map((file) => (
                <div
                  key={file.name}
                  onClick={() => setSelected(selected === file.name ? null : file.name)}
                  className={`bg-[#16161D] border rounded-xl overflow-hidden cursor-pointer transition hover:-translate-y-0.5 ${
                    selected === file.name
                      ? "border-yellow-400"
                      : "border-white/10 hover:border-yellow-400/30"
                  }`}
                >
                  <div className="aspect-[4/3] bg-[#0F0F13] flex items-center justify-center">
                    <span className="text-xs text-gray-600 uppercase">
                      {getFileType(file.name)}
                    </span>
                  </div>
                  <div className="p-2.5">
                    <p className="text-xs font-medium truncate">{file.name}</p>
                    <div className="flex justify-between mt-1">
                      <span className="text-[10px] text-gray-600">{formatBytes(file.size)}</span>
                      <span className="text-[10px] text-yellow-500">stored</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>

      {showUpload && (
        <UploadModal
          onClose={() => setShowUpload(false)}
          onSuccess={fetchFiles}
        />
      )}

    </div>
  );
}