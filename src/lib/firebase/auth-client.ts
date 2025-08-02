import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { User } from "firebase/auth";

export async function loginAndSetCookie(email: string, password: string) {
  const userCred = await signInWithEmailAndPassword(auth, email, password);
  const token = await userCred.user.getIdToken();

  const res = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });

  if (!res.ok) throw new Error("Login failed");
  return await res.json();
}

export function getCurrentUser(): User | null {
  return auth.currentUser;
}
