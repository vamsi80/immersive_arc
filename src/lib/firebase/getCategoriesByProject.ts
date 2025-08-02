import { getFirestore, collection, getDocs } from 'firebase/firestore'
import { app } from "@/lib/firebase/client"; // adjust if your firebase app export is elsewhere

export interface Category {
  id: string
  name: string
}

export async function getCategoriesByProject(projectId: string): Promise<Category[]> {
  const db = getFirestore(app)
  const categoriesRef = collection(db, `projects/${projectId}/category`)
  const snapshot = await getDocs(categoriesRef)
  return snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as { name: string }) }))
}
