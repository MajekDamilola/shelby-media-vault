import { NextRequest, NextResponse } from "next/server";
import { getShelbyClient } from "@/lib/shelby";
import { getMediaType } from "@/types/vault";
import { v4 as uuidv4 } from "uuid";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const accountAddress = formData.get("accountAddress") as string | null;
    const storageDays = parseInt((formData.get("storageDays") as string) || "30");

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!accountAddress) {
      return NextResponse.json({ error: "Account address required" }, { status: 401 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const client = getShelbyClient();
    const blobName = `${accountAddress}/${uuidv4()}/${file.name}`;

    const result = await client.upload({
      blobName,
      data: buffer,
      storageDuration: storageDays * 24 * 60 * 60,
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
      shareUrl: `/share/${encodeURIComponent(blobName)}`,
    };

    return NextResponse.json({ success: true, file: vaultFile });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 500 }
    );
  }
}