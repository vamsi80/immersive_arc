import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase/client";

export async function firebaseForgotPassword(email: string) {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}
