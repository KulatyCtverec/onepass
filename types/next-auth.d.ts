import { User as PrismaUser } from "@/lib/generated/prisma";
import { Role } from "@/lib/generated/prisma";
declare module "next-auth" {
  interface User extends PrismaUser {
    emailVerified: Date | null;
    role: Role;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    emailVerified: Date | null;
    role: Role;
  }
}
