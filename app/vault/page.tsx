"use client";

import { useState } from "react";

export default function VaultPage() {
  const [images, setImages] = useState<string[]>([]);

  const handleUpload = (event: any) => {
    const file = event.target.files[0];

    if (!file) return;

    const imageUrl = URL.createObjectURL(file);

    setImages((prev) => [...prev, imageUrl]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0b1120] to-[#020617] text-white p-10">

      <h1 className="text-4xl font-bold mb-8">
        My Media Vault
      </h1>

      {/* Upload Button */}

      <label className="bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-600 text-black px-6 py-3 rounded-xl font-semibold cursor-pointer">
        Upload File
        <input
          type="file"
          className="hidden"
          onChange={handleUpload}
        />
      </label>

      {/* Image Grid */}

      <div className="grid grid-cols-3 gap-6 mt-10">

        {images.map((img, index) => (
          <div
            key={index}
            className="bg-white/5 border border-white/10 rounded-xl overflow-hidden"
          >
            <img
              src={img}
              className="w-full h-[200px] object-cover"
            />
          </div>
        ))}

      </div>

    </div>
  );
}