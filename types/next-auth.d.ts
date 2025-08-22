import { User as PrismaUser } from "@/lib/generated/prisma";

declare module "next-auth" {
  interface User extends PrismaUser {
    emailVerified: Date | null;
    isAdmin: boolean;
    isAuthenticator: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    emailVerified: Date | null;
    isAdmin: boolean;
    isAuthenticator: boolean;
  }
}
