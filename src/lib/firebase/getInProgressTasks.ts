import { db } from "@/lib/firebase/client";
import { collection, getDocs } from "firebase/firestore";
import type { Task } from "@/types/task";

export async function getInProgressTasks(userId: string): Promise<Task[]> {
  const tasksRef = collection(db, `users/${userId}/inProgressTasks`);
  const snapshot = await getDocs(tasksRef);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  } as Task));
}
