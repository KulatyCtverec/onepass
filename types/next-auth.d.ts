import { User as PrismaUser } from "@/lib/generated/prisma";

declare module "next-auth" {
  interface User extends PrismaUser {
    isAdmin: boolean;
    isAuthenticator: boolean;
  }
}

declare module "next-auth/jwt" {}
