import { auth } from "@/lib/firebase/client";
import { signInWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from "firebase/app";

export async function firebaseLogin(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return { success: true, user: userCredential.user };
  } catch (error: unknown) {
    let message = "Login failed. Please try again.";

    if (error instanceof FirebaseError) {
      switch (error.code) {
        case "auth/user-not-found":
          message = "User not found.";
          break;
        case "auth/wrong-password":
          message = "Incorrect password.";
          break;
        case "auth/invalid-email":
          message = "Invalid email address.";
          break;
        default:
          message = error.message; // still show Firebase’s message if available
      }
    }

    return { success: false, message };
  }
}
