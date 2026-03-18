"use client";

export default function LandingPage() {
  return (
    <div className="bg-[#0A0A0C] text-[#F0EDE8] font-sans">

      {/* NAVBAR */}

      <nav className="fixed top-0 left-0 right-0 flex justify-between items-center px-12 py-5 bg-black/70 backdrop-blur border-b border-white/10 z-50">

        <div className="flex items-center gap-3 font-bold text-lg">
          <div className="w-8 h-8 rounded bg-yellow-500 flex items-center justify-center">
            🔐
          </div>
          Shelby Media Vault
        </div>

        <div className="flex gap-8 text-sm text-gray-400 items-center">
          <a href="#">Home</a>
          <a href="#">Docs</a>
          <a href="/vault">Vault</a>

          <button className="bg-gradient-to-r from-yellow-500 to-amber-500 text-black px-4 py-2 rounded-lg font-semibold">
            Connect Wallet
          </button>
        </div>

      </nav>


      {/* HERO */}

      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6">

        <p className="text-yellow-500 text-xs uppercase tracking-widest mb-6">
          Decentralized Storage Infrastructure
        </p>

        <h1 className="text-6xl font-extrabold leading-tight max-w-4xl">

          <span className="block">Your Personal</span>

          <span className="block text-yellow-500">
            Media Vault
          </span>

          <span className="block text-gray-400 text-xl mt-4">
            — On-Chain, Forever Yours
          </span>

        </h1>

        <p className="max-w-xl mt-6 text-gray-400">
          Upload, organize, and manage your images and videos using Shelby
          decentralized infrastructure. Your files, your keys, your ownership.
        </p>


        <div className="flex gap-4 mt-10">

          <a href="/vault">
            <button className="bg-gradient-to-r from-yellow-500 to-amber-500 text-black px-8 py-3 rounded-lg font-bold">
              ⚡ Launch Vault
            </button>
          </a>

          <button className="border border-white/20 px-8 py-3 rounded-lg">
            Connect Wallet →
          </button>

        </div>


        {/* STATS */}

        <div className="flex gap-12 mt-20 border-t border-white/10 pt-10">

          <div>
            <div className="text-yellow-500 text-3xl font-bold">99.9%</div>
            <div className="text-xs text-gray-500 uppercase mt-1">
              Uptime
            </div>
          </div>

          <div>
            <div className="text-yellow-500 text-3xl font-bold">0ms</div>
            <div className="text-xs text-gray-500 uppercase mt-1">
              Censorship
            </div>
          </div>

          <div>
            <div className="text-yellow-500 text-3xl font-bold">∞</div>
            <div className="text-xs text-gray-500 uppercase mt-1">
              Storage
            </div>
          </div>

        </div>

      </section>
      {/* VAULT PREVIEW */}

<div className="max-w-6xl mx-auto px-10 pb-24">

  <div className="bg-[#16161D] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">

    {/* Toolbar */}

    <div className="flex items-center gap-2 px-6 py-4 bg-[#111116] border-b border-white/10">

      <div className="w-3 h-3 rounded-full bg-red-400"></div>
      <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
      <div className="w-3 h-3 rounded-full bg-green-400"></div>

      <div className="mx-auto text-xs text-gray-500">
        shelby://vault/my-collection
      </div>

    </div>


    {/* Vault Grid */}

    <div className="grid grid-cols-4 gap-[1px] bg-white/10">

      <div className="bg-[#16161D] p-4 aspect-square flex flex-col justify-end">
        <div className="text-xl opacity-30 mb-6">🖼️</div>
        <div className="text-sm">hero_artwork.png</div>
        <div className="text-xs text-gray-500">4.2 MB · IPFS</div>
      </div>

      <div className="bg-[#16161D] p-4 aspect-square flex flex-col justify-end">
        <div className="text-xl opacity-30 mb-6">🎬</div>
        <div className="text-sm">campaign_v3.mp4</div>
        <div className="text-xs text-gray-500">128 MB · IPFS</div>
      </div>

      <div className="bg-[#16161D] p-4 aspect-square flex flex-col justify-end">
        <div className="text-xl opacity-30 mb-6">🎨</div>
        <div className="text-sm">genesis_001.svg</div>
        <div className="text-xs text-gray-500">82 KB · Arweave</div>
      </div>

      <div className="bg-[#16161D] p-4 aspect-square flex flex-col justify-end">
        <div className="text-xl opacity-30 mb-6">📁</div>
        <div className="text-sm">brand_assets</div>
        <div className="text-xs text-gray-500">14 files · 340 MB</div>
      </div>

    </div>

  </div>

</div>

    </div>
  );
}