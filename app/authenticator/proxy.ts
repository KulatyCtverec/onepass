import { NextResponse } from "next/server";
import { auth } from "@/auth-middleware";

export async function proxy() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.redirect(
      new URL("/auth/signin", process.env.NEXTAUTH_URL ?? "http://localhost:3000")
    );
  }

  if ((session.user as { role?: string }).role !== "AUTHENTICATOR") {
    return NextResponse.redirect(new URL("/", process.env.NEXTAUTH_URL ?? "http://localhost:3000"));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/authenticator/:path*",
};

