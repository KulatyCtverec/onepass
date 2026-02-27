import { NextRequest, NextResponse } from "next/server";
import { runTriggers } from "@/lib/triggers/setup/runTriggers";

export async function POST(request: NextRequest) {
  try {
    console.log("🚀 Setting up database triggers...");
    await runTriggers();

    return NextResponse.json({
      success: true,
      message: "Database triggers set up successfully",
    });
  } catch (error) {
    console.error("❌ Error setting up database triggers:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Database setup endpoint - use POST to trigger setup",
  });
}

