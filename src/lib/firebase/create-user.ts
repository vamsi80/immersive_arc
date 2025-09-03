import { db } from "@/lib/firebase/client";
import { doc, DocumentData, setDoc } from "firebase/firestore";

export async function createUserInFirestore<T extends DocumentData>(userId: string, data: T) {
  try {
    await setDoc(doc(db, "users", userId), { ...data, userid: userId });
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
}
