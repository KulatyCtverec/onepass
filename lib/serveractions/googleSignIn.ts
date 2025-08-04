"use server";
import { signIn, signOut } from "@/auth";

export async function logInWithGoogle() {
  await signIn("google");
}

export async function logOut() {
  await signOut();
}
