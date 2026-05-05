# ◈ Shelby Media Vault

A decentralized media storage and management tool built on [Shelby](https://shelby.xyz). Upload, organize, preview, and share media files — images, video, audio, and documents — directly on Shelby's decentralized storage network.

## Features

- **Wallet-based access** — connect with your Aptos devnet account
- **Drag & drop uploads** — upload any media file to Shelby with configurable storage duration
- **Personal vault dashboard** — browse all your stored files with search and filter
- **Media preview** — in-browser preview for images, video, and audio
- **Shareable links** — generate public share URLs for any file
- **Blob integrity** — merkle root displayed for each upload

## Tech Stack

- **Next.js 16** with App Router
- **TypeScript** + **TailwindCSS v4**
- **@shelby-protocol/sdk** — Shelby storage client
- **@aptos-labs/ts-sdk** — Aptos account/transaction signing
- **@tanstack/react-query** — data fetching

## Project Structure

```
app/
  page.tsx              ← Landing + wallet connect
  layout.tsx            ← Root layout with providers
  globals.css           ← Design system & CSS variables
  vault/
    layout.tsx          ← Protected vault layout with Nav
    page.tsx            ← Main dashboard (search, filter, grid)
  api/
    upload/route.ts     ← POST: upload file to Shelby
    files/route.ts      ← GET: list blobs for an account
    download/route.ts   ← GET: stream blob from Shelby
  share/[blobName]/
    page.tsx            ← Public share page
components/
  Nav.tsx               ← Navigation bar
  UploadZone.tsx        ← Drag & drop upload modal
  FileGrid.tsx          ← File card grid
  FilePreviewModal.tsx  ← Full-screen file preview
hooks/
  useWallet.tsx         ← Wallet context (address, key)
  useVault.ts           ← Vault file state & upload logic
lib/
  shelby.ts             ← ShelbyClient factory
types/
  vault.ts              ← VaultFile types & helpers
```

## Setup

### Prerequisites

- Node.js v22+
- Shelby CLI installed — follow the [Shelby CLI Getting Started](https://docs.shelby.xyz/tools/cli)
- Aptos devnet account funded via [ShelbyUSD faucet](https://docs.shelby.xyz/apis/faucet/shelbyusd)

### Installation

```bash
# Clone / enter the project
cd shelby-vault

# Install dependencies
npm install

# Copy environment config
cp .env.example .env.local
# Edit .env.local with your SHELBY_RPC_NODE

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and connect with your Aptos devnet address and private key.

> ⚠️ **Never use mainnet private keys** in this app during development. Use Aptos devnet credentials only.

### Getting Testnet Funds

After generating your devnet account with the Shelby CLI (`npm run config` in shelby-quickstart):

1. Visit the [ShelbyUSD faucet](https://docs.shelby.xyz/apis/faucet/shelbyusd)
2. Visit the [Aptos faucet](https://docs.shelby.xyz/apis/faucet/aptos)
3. Paste your account address and fund it

## Roadmap

- [ ] Aptos wallet adapter integration (Petra, Martian) — replace raw private key input
- [ ] Folder/collection organization
- [ ] File tagging and metadata
- [ ] Bulk upload
- [ ] Storage expiry tracking
- [ ] IPFS gateway fallback

## Built With Shelby

This project demonstrates Shelby as a backend for media-heavy applications:
- **Upload** — `client.upload({ blobName, data, storageDuration })`
- **List** — `client.listBlobs({ account })`
- **Download** — `client.download({ blobName })`

See `lib/shelby.ts` and `app/api/` routes for integration details.
