import { firestore } from '../firebase-admin/config'

export async function getAllProjects(lang: string) {
  const query = firestore.collection('projects_' + lang).orderBy("order", "asc")
  const snapshot = await query.get()

  if (snapshot.empty) return []

  return snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}))
}


export async function getProjectBySlug(slug: string, lang: string) {
    const query = firestore.collection('projects_' + lang).where("slug", "==", slug).limit(1)
    const snapshot = await query.get()
  
    if (snapshot.empty) return null
  
    const doc = snapshot.docs[0]
    return { id: doc.id, ...doc.data() }
}