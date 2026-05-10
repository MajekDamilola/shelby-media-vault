# ◈ Shelby Media Vault

> Decentralized media storage and management powered by [Shelby Network](https://shelby.xyz)

Shelby Media Vault is a creator-focused web application that lets users upload, organize, preview, and share media files — images, video, audio, and documents — directly on Shelby's hot storage network. No centralized servers. No middlemen. Just your wallet, your files, and Shelby.

---

## What It Does

**Upload** — Drag and drop any media file into your vault. Choose how long you want it stored (1–365 days). The file is uploaded directly to Shelby's decentralized network and a merkle root is returned as proof of integrity.

**Organize** — Browse your vault with a personal dashboard. Filter by file type (images, video, audio, docs), search by name, and see your total storage usage at a glance.

**Preview** — View images, play video, and listen to audio directly in the browser without downloading. Full in-browser media player for every file type.

**Share** — Every file gets a public shareable URL that anyone can access and download — no account needed to view.

---

## Why Shelby

Most media-heavy applications rely on centralized cloud storage (AWS S3, Google Cloud) which creates single points of failure, vendor lock-in, and data ownership concerns for creators.

Shelby offers hot decentralized storage — fast enough for real-time media retrieval, reliable enough for production applications, and Web3-native so users truly own their data.

This project demonstrates Shelby as a practical backend for creator tools, content platforms, and media-based Web3 applications.

---

## Features

- 🔐 **Wallet-based access** — connect with your Aptos account, your keys control your vault
- ⬆️ **Drag & drop uploads** — upload images, video, audio, and PDF to Shelby with configurable storage duration
- 📁 **Personal vault dashboard** — browse all stored files with search, filter by type, and storage stats
- 👁 **In-browser media preview** — images, video player, audio player built in
- 🔗 **Shareable links** — generate public URLs for any file instantly
- ✅ **Blob integrity** — merkle root displayed for every upload
- 🔔 **Toast notifications** — real-time feedback on uploads, errors, and actions
- ⚡ **Hot storage** — files retrieved via Shelby's fast read infrastructure

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, React 19, TypeScript |
| Styling | TailwindCSS v4, custom design system |
| Storage | `@shelby-protocol/sdk` |
| Wallet | `@aptos-labs/wallet-adapter-react` (Petra, Nightly, Martian) |
| Network | Aptos Testnet via Shelby |
| Fonts | Space Grotesk, JetBrains Mono |

---

## How Shelby Is Used

```typescript
// Upload a file to Shelby
const result = await client.upload({
  blobName: `${accountAddress}/${uuid}/${fileName}`,
  data: buffer,
  storageDuration: days * 24 * 60 * 60,
});

// List all blobs for an account
const blobs = await client.listBlobs({ account: accountAddress });

// Download / stream a blob
const { data, mimeType } = await client.download({ blobName });
```

See `lib/shelby.ts` and `app/api/` for full integration.

---

## Project Structure

```
app/
  page.tsx               ← Landing page with wallet connect
  vault/page.tsx         ← Dashboard (search, filter, file grid)
  api/upload/route.ts    ← Upload file to Shelby
  api/files/route.ts     ← List blobs for account
  api/download/route.ts  ← Stream blob from Shelby
  share/[blobName]/      ← Public share page
components/
  Nav.tsx                ← Navigation
  UploadZone.tsx         ← Drag & drop upload modal
  FileGrid.tsx           ← File card grid
  FilePreviewModal.tsx   ← In-browser media preview
  WalletSelector.tsx     ← Wallet connect modal
  Toast.tsx              ← Notification system
hooks/
  useVault.ts            ← Vault state & upload logic
lib/
  shelby.ts              ← ShelbyClient factory
```

---

## Local Setup

```bash
# 1. Clone the repo
git clone https://github.com/MajekDamilola/shelby-media-vault.git
cd shelby-media-vault

# 2. Install dependencies
npm install --legacy-peer-deps

# 3. Set up environment
cp .env.example .env.local
# Edit .env.local with your SHELBY_RPC_NODE

# 4. Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and connect with your Aptos testnet wallet (Petra recommended).

---

## Roadmap

- [x] Wallet-based vault access
- [x] Media upload to Shelby network
- [x] Personal vault dashboard
- [x] In-browser media preview
- [x] Shareable public links
- [x] Blob integrity proofs (merkle root)
- [ ] Petra / Martian wallet adapter (in progress)
- [ ] Folder and collection organization
- [ ] File tagging and metadata
- [ ] Bulk upload
- [ ] Storage expiry tracking and renewal
- [ ] Mobile responsive layout

---

## About

Built by [@MajekDamilola](https://github.com/MajekDamilola) as part of the Shelby Network early access program.

This project aims to showcase Shelby as a viable storage backend for real-world creator tools and decentralized media platforms.

> *"Built to hold, made to move."* — Shelby Network