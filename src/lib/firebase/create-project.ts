import { db } from "@/lib/firebase/client";
import { collection, addDoc, doc, setDoc, updateDoc } from "firebase/firestore";

export async function createProjectInFirestore(data: any) {
  try {
    const docRef = await addDoc(collection(db, "projects"), data);
    if (!docRef.id) {
      throw new Error("Failed to create project: No document ID returned.");
    }
    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: false, error };
  }
}
