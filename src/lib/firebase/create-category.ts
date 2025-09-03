import { db } from "@/lib/firebase/client";
import { doc, setDoc, DocumentData } from "firebase/firestore";

export async function createCategory<T extends DocumentData>(projectId: string, categoryId: string, data: T) {
  try {
    const categoryRef = doc(db, "projects", projectId, "categories", categoryId);
    await setDoc(categoryRef, data);
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
}
