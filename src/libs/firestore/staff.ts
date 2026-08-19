import { firestore } from '../firebase-admin/config'

const db = firestore.collection('staff')

export async function getAllStaff() {
  const query = db.orderBy("order", "asc")
  const snapshot = await query.get()

  if (snapshot.empty) return []

  return snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}))
}

export async function addStaff({ name, link, skills, avatar, order }: { name: string; link: string; skills: string; avatar: string; order: Number }) {
    const docRef = await db.add({ name, link, skills, avatar, order });
    return { id: docRef.id, name, link, skills, avatar, order };
}
  
export async function deleteStaff(id: string) {
    const docRef = db.doc(id);
    await docRef.delete();
    return { success: true };
}

export async function updateStaff(id: string, data: { name?: string; link?: string; skills?: string; avatar?: string; order?: Number }) {
    const docRef = db.doc(id);
    await docRef.update(data);
    return { success: true };
}