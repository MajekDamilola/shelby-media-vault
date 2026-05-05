import { NextRequest, NextResponse } from "next/server";
import { getShelbyClientForAccount } from "@/lib/shelby";
import { getMediaType } from "@/types/vault";
import { v4 as uuidv4 } from "uuid";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const accountAddress = formData.get("accountAddress") as string | null;
    const privateKey = formData.get("privateKey") as string | null;
    const storageDays = parseInt(
      (formData.get("storageDays") as string) || "30"
    );

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!accountAddress || !privateKey) {
      return NextResponse.json(
        { error: "Wallet credentials required" },
        { status: 401 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const client = getShelbyClientForAccount(privateKey);

    // Create a unique blob name: address/uuid/filename
    const blobName = `${accountAddress}/${uuidv4()}/${file.name}`;

    // Upload to Shelby network
    const result = await client.upload({
      blobName,
      data: buffer,
      storageDuration: storageDays * 24 * 60 * 60, // convert days to seconds
    });

    const vaultFile = {
      blobName,
      name: file.name,
      size: file.size,
      type: getMediaType(file.type),
      mimeType: file.type,
      uploadedAt: new Date().toISOString(),
      merkleRoot: result.merkleRoot,
      accountAddress,
      shareUrl: `${process.env.NEXT_PUBLIC_APP_URL || ""}/share/${encodeURIComponent(blobName)}`,
    };

    return NextResponse.json({ success: true, file: vaultFile });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Upload failed",
      },
      { status: 500 }
    );
  }
}
