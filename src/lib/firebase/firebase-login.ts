import { auth } from "@/lib/firebase/client";
import { signInWithEmailAndPassword } from "firebase/auth";

export async function firebaseLogin(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return { success: true, user: userCredential.user };
  } catch (error: any) {
    let message = "Login failed. Please try again.";
    if (error.code === "auth/user-not-found") message = "User not found.";
    else if (error.code === "auth/wrong-password")
      message = "Incorrect password.";
    else if (error.code === "auth/invalid-email")
      message = "Invalid email address.";
    return { success: false, message };
  }
}
