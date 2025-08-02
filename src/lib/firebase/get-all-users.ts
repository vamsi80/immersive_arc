import { getFirestore, collection, getDocs } from "firebase/firestore";
import { app } from "@/lib/firebase/client";

export async function getAllUsers() {
  const db = getFirestore(app);
  const usersCol = collection(db, "users");
  const userSnapshot = await getDocs(usersCol);
  return userSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}
