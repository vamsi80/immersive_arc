import { auth } from "@/lib/firebase/client";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from "firebase/app"; // ✅ import the error type

export async function firebaseSignUp(email: string, password: string) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return { success: true, user: userCredential.user };
  } catch (error: unknown) {
    let message = "Sign up failed. Please try again.";

    if (error instanceof FirebaseError) {
      switch (error.code) {
        case "auth/email-already-in-use":
          message = "Email already in use.";
          break;
        case "auth/invalid-email":
          message = "Invalid email address.";
          break;
        case "auth/weak-password":
          message = "Password is too weak.";
          break;
        default:
          message = error.message; // fallback to Firebase error message
      }
    }

    return { success: false, message };
  }
}
