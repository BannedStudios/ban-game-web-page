import { firestore } from '../firebase-admin/config'

// Respuestas de los formularios propios (Contacto y Postúlate), en la colección "form_submissions"
const db = firestore.collection('form_submissions')

export type FormId = 'contact' | 'apply'

export async function addSubmission(form: FormId, data: Record<string, unknown>, lang: string) {
  const doc = await db.add({ form, data, lang, read: false, createdAt: Date.now() })
  return { id: doc.id }
}

export async function listSubmissions(form?: FormId) {
  const query = form ? db.where('form', '==', form) : db
  const snapshot = await query.get()
  return snapshot.docs
    .map((d) => ({ id: d.id, ...(d.data() as { form: FormId; data: Record<string, unknown>; lang: string; read: boolean; createdAt: number }) }))
    .sort((a, b) => b.createdAt - a.createdAt)
}

export async function setRead(id: string, read: boolean) {
  await db.doc(id).update({ read })
  return { success: true }
}

export async function deleteSubmission(id: string) {
  await db.doc(id).delete()
  return { success: true }
}
