import { getFirestore, collection, getDocs } from "firebase/firestore";
import { app } from "@/lib/firebase/client";

export async function getAllProjects() {
  const db = getFirestore(app);
  const projectCol = collection(db, "projects");
  const userSnapshot = await getDocs(projectCol);
  return userSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}
