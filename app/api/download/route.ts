import { NextRequest, NextResponse } from "next/server";
import { getShelbyClient } from "@/lib/shelby";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const blobName = searchParams.get("blob");
    const inline = searchParams.get("inline") === "true";

    if (!blobName) {
      return NextResponse.json(
        { error: "Blob name required" },
        { status: 400 }
      );
    }

    const client = getShelbyClient();
    const { data, mimeType } = await client.download({ blobName });

    const nameParts = blobName.split("/");
    const fileName = nameParts[nameParts.length - 1];

    return new NextResponse(data, {
      headers: {
        "Content-Type": mimeType || "application/octet-stream",
        "Content-Disposition": inline
          ? `inline; filename="${fileName}"`
          : `attachment; filename="${fileName}"`,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Download failed",
      },
      { status: 500 }
    );
  }
}
