/**
 * lib/shelby.ts
 * Shelby SDK wrapper — handles the 3-step upload flow:
 *   1. Encode  → generateCommitments()
 *   2. Register → on-chain Aptos transaction
 *   3. Upload  → shelbyClient.rpc.putBlob()
 *
 * Also handles listing blobs for an account.
 */

import {
  ShelbyClient,
  ShelbyBlobClient,
  generateCommitments,
  createDefaultErasureCodingProvider,
  expectedTotalChunksets,
  type BlobCommitments,
} from "@shelby-protocol/sdk/browser";
import { Network } from "@aptos-labs/ts-sdk";
import { aptosClient, network } from "./aptosClient";

// ── Shelby client singleton ───────────────────────────────────────────────────
export const shelbyClient = new ShelbyClient({
  network,
  apiKey: process.env.NEXT_PUBLIC_SHELBY_API_KEY,
});

// ── Types ─────────────────────────────────────────────────────────────────────
export type UploadStep =
  | "idle"
  | "encoding"
  | "registering"
  | "uploading"
  | "done"
  | "error";

export interface UploadProgress {
  step: UploadStep;
  stepLabel: string;
  percent: number;
  error?: string;
}

export interface ShelbyBlob {
  name: string;
  size: number;
  uploadedAt: string;
  expiresAt: string;
  blobMerkleRoot: string;
  status: "stored" | "pending" | "expired";
  url: string;
}

// ── Step 1: Encode ────────────────────────────────────────────────────────────
export async function encodeFile(file: File): Promise<BlobCommitments> {
  const data = Buffer.from(await file.arrayBuffer());
  const provider = await createDefaultErasureCodingProvider();
  return generateCommitments(provider, data);
}

// ── Step 2: Build registration payload ───────────────────────────────────────
export function buildRegisterPayload(
  accountAddress: string,
  file: File,
  commitments: BlobCommitments
) {
  const THIRTY_DAYS_MS = 1000 * 60 * 60 * 24 * 30;
  return ShelbyBlobClient.createRegisterBlobPayload({
    account: accountAddress,
    blobName: file.name,
    blobMerkleRoot: commitments.blob_merkle_root,
    numChunksets: expectedTotalChunksets(commitments.raw_data_size),
    expirationMicros: (Date.now() + THIRTY_DAYS_MS) * 1000,
    blobSize: commitments.raw_data_size,
  });
}

// ── Step 3: RPC Upload ────────────────────────────────────────────────────────
export async function uploadToRpc(
  accountAddress: string,
  file: File
): Promise<void> {
  await shelbyClient.rpc.putBlob({
    account: accountAddress,
    blobName: file.name,
    blobData: new Uint8Array(await file.arrayBuffer()),
  });
}

// ── List blobs for an account ─────────────────────────────────────────────────
export async function getAccountBlobs(
  accountAddress: string
): Promise<ShelbyBlob[]> {
  const raw = await shelbyClient.coordination.getAccountBlobs({
    account: accountAddress,
  });

  const baseUrl =
    network === Network.TESTNET
      ? "https://api.testnet.shelby.xyz/shelby/v1/blobs"
      : "https://api.shelby.xyz/shelby/v1/blobs";

  return raw.map((blob: any) => ({
    name: blob.name,
    size: blob.size ?? 0,
    uploadedAt: blob.created_at ?? new Date().toISOString(),
    expiresAt: blob.expiration ?? "",
    blobMerkleRoot: blob.blob_merkle_root ?? "",
    status: "stored" as const,
    url: `${baseUrl}/${accountAddress}/${blob.name}`,
  }));
}

// ── Direct download URL ───────────────────────────────────────────────────────
export function getBlobUrl(accountAddress: string, fileName: string): string {
  const base =
    network === Network.TESTNET
      ? "https://api.testnet.shelby.xyz/shelby/v1/blobs"
      : "https://api.shelby.xyz/shelby/v1/blobs";
  return `${base}/${accountAddress}/${fileName}`;
}