import { collection, addDoc, getDoc, doc, Timestamp } from "firebase/firestore"
import { db } from "./firebase"

export interface LinkList {
  id?: string
  name: string
  urls: { url: string; comment?: string }[]
  createdAt: string
}

export async function createLinkList(data: Omit<LinkList, "id" | "createdAt">) {
  // Ensure all URLs start with http:// or https://
  const formattedUrls = data.urls.map(({ url, comment }) => ({
    url: url.startsWith('http') ? url : `https://${url}`,
    comment: comment || ''
  }))

  const docRef = await addDoc(collection(db, "lists"), {
    name: data.name,
    urls: formattedUrls,
    createdAt: Timestamp.now()
  })
  return docRef.id
}

export async function getLinkList(id: string) {
  const docRef = doc(db, "lists", id)
  const docSnap = await getDoc(docRef)
  
  if (!docSnap.exists()) {
    throw new Error("List not found")
  }

  const data = docSnap.data()
  return {
    id: docSnap.id,
    name: data.name,
    urls: data.urls,
    createdAt: (data.createdAt as Timestamp).toDate().toISOString()
  } as LinkList
} 