import { auth } from "@/lib/firebase/client";
import { signOut } from "firebase/auth";

export async function firebaseSignOut() {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
}
