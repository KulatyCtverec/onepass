import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { Role } from "@/lib/generated/prisma";

export async function middleware() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.redirect(
      new URL("/auth/signin", process.env.NEXTAUTH_URL)
    );
  }

  if (session.user.role !== Role.AUTHENTICATOR) {
    return NextResponse.redirect(new URL("/", process.env.NEXTAUTH_URL));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/authenticator/:path*",
};
