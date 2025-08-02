import { auth } from "@/lib/firebase/client";
import { createUserWithEmailAndPassword } from "firebase/auth";

export async function firebaseSignUp(email: string, password: string) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return { success: true, user: userCredential.user };
  } catch (error: any) {
    let message = "Sign up failed. Please try again.";
    if (error.code === "auth/email-already-in-use")
      message = "Email already in use.";
    else if (error.code === "auth/invalid-email")
      message = "Invalid email address.";
    else if (error.code === "auth/weak-password")
      message = "Password is too weak.";
    return { success: false, message };
  }
}
