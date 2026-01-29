import { NextResponse } from "next/server";
import { deleteBlobFromStorage } from "@/lib/blob";

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get("image_url");

  if (!imageUrl) {
    return NextResponse.json(
      { error: "No image url provided" },
      { status: 400 }
    );
  }

  try {
    await deleteBlobFromStorage(imageUrl);
    return NextResponse.json(
      { message: "Image removed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("[remove-image]", error);
    return NextResponse.json(
      { error: "Failed to remove image" },
      { status: 500 }
    );
  }
}
