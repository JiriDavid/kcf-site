import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "KCF Fellowship API placeholder", mediaBucket: "Cloudflare R2 placeholder" });
}
