import { db } from "@/lib/firebase/client";
import { doc, setDoc } from "firebase/firestore";

export async function createCategory(projectId: string, categoryId: string, data: any) {
  try {
    const categoryRef = doc(db, "projects", projectId, "categories", categoryId);
    await setDoc(categoryRef, data);
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
}
