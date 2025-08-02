import { db } from "@/lib/firebase/client";
import { doc, setDoc } from "firebase/firestore";

export async function createUserInFirestore(userId: string, data: any) {
  try {
    await setDoc(doc(db, "users", userId), { ...data, userid: userId });
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
}
