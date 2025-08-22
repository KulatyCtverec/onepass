import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./lib/prisma";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Heslo", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.password) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          emailVerified: user.emailVerified,
          isAdmin: user.isAdmin,
          isAuthenticator: user.isAuthenticator,
        } as any;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/signin",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log("🔐 SignIn callback triggered:", {
        provider: account?.provider,
        email: profile?.email,
        userId: user.id
      });

      // Pro Google OAuth - načíst nebo vytvořit user s custom poli
      if (account?.provider === "google" && profile?.email) {
        try {
          let dbUser = await prisma.user.findUnique({
            where: { email: profile.email },
          });

          console.log("👤 Database user lookup:", {
            email: profile.email,
            found: !!dbUser,
            userId: dbUser?.id,
            isAdmin: dbUser?.isAdmin,
            isAuthenticator: dbUser?.isAuthenticator
          });

          if (!dbUser) {
            // Vytvořit nového uživatele
            console.log("🆕 Creating new user for Google OAuth");
            dbUser = await prisma.user.create({
              data: {
                email: profile.email,
                name: profile.name || profile.email,
                emailVerified: new Date(),
                isAdmin: false,
                isAuthenticator: false,
              },
            });
            console.log("✅ New user created:", dbUser.id);
          } else {
            // Aktualizovat existujícího uživatele (např. jméno z Google)
            console.log("🔄 Updating existing user from Google");
            await prisma.user.update({
              where: { email: profile.email },
              data: {
                name: profile.name || profile.email,
                emailVerified: new Date(),
              },
            });
            console.log("✅ User updated successfully");
          }

          // Aktualizovat user objekt s daty z databáze
          user.id = dbUser.id;
          user.emailVerified = dbUser.emailVerified;
          user.isAdmin = dbUser.isAdmin;
          user.isAuthenticator = dbUser.isAuthenticator;

          console.log("🎯 User object updated with DB data:", {
            id: user.id,
            isAdmin: user.isAdmin,
            isAuthenticator: user.isAuthenticator
          });

        } catch (error) {
          console.error("❌ Error in signIn callback:", error);
          return false;
        }
      }

      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.emailVerified = user.emailVerified;
        token.isAdmin = user.isAdmin;
        token.isAuthenticator = user.isAuthenticator;
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.emailVerified = token.emailVerified as Date | null;
        session.user.isAdmin = token.isAdmin as boolean;
        session.user.isAuthenticator = token.isAuthenticator as boolean;
      }
      return session;
    },
  },
});
