import { NextRequest, NextResponse } from "next/server";
import { getShelbyClient } from "@/lib/shelby";
import { getMediaType } from "@/types/vault";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const accountAddress = searchParams.get("account");

    if (!accountAddress) {
      return NextResponse.json(
        { error: "Account address required" },
        { status: 400 }
      );
    }

    const client = getShelbyClient();
    const blobs = await client.listBlobs({ account: accountAddress });

    // Transform blob list into VaultFile shape
    const files = blobs.map((blob: {
      blobName: string;
      size: number;
      mimeType?: string;
      uploadedAt?: string;
      merkleRoot?: string;
    }) => {
      const nameParts = blob.blobName.split("/");
      const fileName = nameParts[nameParts.length - 1];
      const mimeType = blob.mimeType || "application/octet-stream";

      return {
        blobName: blob.blobName,
        name: fileName,
        size: blob.size,
        type: getMediaType(mimeType),
        mimeType,
        uploadedAt: blob.uploadedAt || new Date().toISOString(),
        merkleRoot: blob.merkleRoot,
        accountAddress,
        shareUrl: `/share/${encodeURIComponent(blob.blobName)}`,
      };
    });

    return NextResponse.json({ files });
  } catch (error) {
    console.error("List files error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to fetch files",
      },
      { status: 500 }
    );
  }
}
