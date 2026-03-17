"use client";

import { useEffect, useState } from "react";
import { useUploadBlobs } from "@shelby-protocol/react";
import { Account, Ed25519PrivateKey } from "@aptos-labs/ts-sdk";

type VaultFile = {
  name: string;
  type: string;
  size: number;
  previewUrl: string;
};

type FilterType = "all" | "image" | "video" | "audio";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [vaultFiles, setVaultFiles] = useState<VaultFile[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");
  const [message, setMessage] = useState("");

  const uploadBlobs = useUploadBlobs({
    onSuccess: () => {
      setMessage("Shelby upload request finished.");
    },
    onError: () => {
      setMessage("Upload failed. Check console.");
    },
  });

  useEffect(() => {
    const savedFiles = localStorage.getItem("vaultFiles");
    if (savedFiles) {
      setVaultFiles(JSON.parse(savedFiles));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("vaultFiles", JSON.stringify(vaultFiles));
  }, [vaultFiles]);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] || null;
    if (!file) return;

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setMessage("");
  }

  async function handleUpload() {
  if (!selectedFile || !previewUrl) {
    alert("Please choose a file first");
    return;
  }

  const newFile: VaultFile = {
    name: selectedFile.name,
    type: selectedFile.type,
    size: selectedFile.size,
    previewUrl,
  };

  setVaultFiles((prev) => [newFile, ...prev]);

  try {
    setMessage("Uploading to Shelby...");

    const privateKey = new Ed25519PrivateKey(
  process.env.NEXT_PUBLIC_APTOS_PRIVATE_KEY!
);
const signer = Account.fromPrivateKey({ privateKey });
    const fileBytes = new Uint8Array(await selectedFile.arrayBuffer());

    uploadBlobs.mutate({
      signer,
      blobs: [
        {
          blobName: selectedFile.name,
          blobData: fileBytes,
        },
      ],
      expirationMicros: Date.now() * 1000 + 86400000000,
    });

    setMessage("Upload request sent to Shelby.");
  } catch (error) {
    console.error(error);
    setMessage("Upload failed.");
  }

  setSelectedFile(null);
  setPreviewUrl(null);
}

  function handleDelete(indexToDelete: number) {
    setVaultFiles((prev) => prev.filter((_, index) => index !== indexToDelete));
  }

  const filteredFiles = vaultFiles.filter((file) => {
    if (filter === "all") return true;
    return file.type.startsWith(filter);
  });

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-purple-950 text-white p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent"></h1><h1 className="text-4xl font-bold mb-2">Shelby Media Vault</h1>
<p className="text-gray-400 mb-8">Upload and store your media files.</p>

        <div className="bg-zinc-900/70 backdrop-blur border border-zinc-800 p-6 rounded-xl mb-6">
          <h2 className="text-xl mb-4">Upload Media</h2>

          <input
            type="file"
            onChange={handleFileChange}
            className="mb-4 block"
          />

          <button
            onClick={handleUpload}
            disabled={uploadBlobs.isPending}
            className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg transition disabled:opacity-50"
          >
            {uploadBlobs.isPending ? "Uploading..." : "Upload"}
          </button>

          {selectedFile && (
            <p className="mt-4 text-sm text-gray-300">
              Selected: {selectedFile.name}
            </p>
          )}

          {message && (
            <p className="mt-3 text-sm text-green-400">{message}</p>
          )}
        </div>

        <div className="bg-zinc-900/80 border border-zinc-800 p-6 rounded-xl hover:border-purple-600 transition">
          <div className="flex flex-col gap-4 mb-6">
            <h2 className="text-xl">My Vault</h2>

            <div className="flex gap-2 flex-wrap">
              <button onClick={() => setFilter("all")} className="bg-zinc-700 px-3 py-1 rounded-lg text-sm">All</button>
              <button onClick={() => setFilter("image")} className="bg-zinc-700 px-3 py-1 rounded-lg text-sm">Images</button>
              <button onClick={() => setFilter("video")} className="bg-zinc-700 px-3 py-1 rounded-lg text-sm">Videos</button>
              <button onClick={() => setFilter("audio")} className="bg-zinc-700 px-3 py-1 rounded-lg text-sm">Audio</button>
            </div>
          </div>

          {filteredFiles.length === 0 ? (
            <p>No files in this section.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {filteredFiles.map((file, index) => (
                <div
                  key={index}
                  className="border border-zinc-700 rounded-xl p-4 bg-zinc-950"
                >
                  <div className="flex items-center justify-between mb-3 gap-3">
                    <p className="font-semibold truncate">{file.name}</p>

                    <button
                      onClick={() => handleDelete(index)}
                      className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm"
                    >
                      Delete
                    </button>
                  </div>

                  <p className="text-sm text-gray-300 mb-1">
                    Type: {file.type || "Unknown"}
                  </p>
                  <p className="text-sm text-gray-300 mb-3">
                    Size: {(file.size / 1024).toFixed(2)} KB
                  </p>

                  {file.type.startsWith("image") && (
                    <img
                      src={file.previewUrl}
                      alt={file.name}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  )}

                  {file.type.startsWith("video") && (
                    <video controls className="w-full rounded-lg">
                      <source src={file.previewUrl} />
                    </video>
                  )}

                  {file.type.startsWith("audio") && (
                    <audio controls className="w-full">
                      <source src={file.previewUrl} />
                    </audio>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}