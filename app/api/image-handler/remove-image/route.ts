//Remove image from blob storage
import { del } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get("filename");

  if (!filename) {
    return NextResponse.json({ error: "No image provided" }, { status: 400 });
  }

  if (!filename) {
    return NextResponse.json(
      { error: "No filename provided" },
      { status: 400 }
    );
  }

  const result = await del(filename).then(() => {
    return NextResponse.json({ message: "Image removed successfully" }, { status: 200 });
  }).catch((error) => {
    return NextResponse.json({ error: error }, { status: 500 });
  });

  return result;
}
