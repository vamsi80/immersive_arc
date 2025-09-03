import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { FirebaseError } from "firebase/app";

export async function firebaseForgotPassword(email: string) {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error: unknown) {
   if (error instanceof FirebaseError) {
      return { success: false, message: error.message, code: error.code };
    }
    return { success: false, message: "Unknown error occurred" };
  }
}
