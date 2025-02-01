import { collection, addDoc, getDoc, doc, Timestamp, query, where, getDocs, deleteDoc, updateDoc } from "firebase/firestore"
import { db } from "./firebase"

export interface LinkList {
  id?: string
  name: string
  urls: { url: string; comment?: string }[]
  createdAt: string
  userId?: string
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
    createdAt: Timestamp.now(),
    userId: data.userId || null
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
    createdAt: (data.createdAt as Timestamp).toDate().toISOString(),
    userId: data.userId || null
  } as LinkList
}

export async function getUserLists(userId: string) {
  const q = query(collection(db, "lists"), where("userId", "==", userId))
  const querySnapshot = await getDocs(q)
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    name: doc.data().name,
    urls: doc.data().urls,
    createdAt: (doc.data().createdAt as Timestamp).toDate().toISOString(),
    userId: doc.data().userId
  })) as LinkList[]
}

export async function deleteList(id: string, userId: string) {
  const docRef = doc(db, "lists", id)
  const docSnap = await getDoc(docRef)
  
  if (!docSnap.exists()) {
    throw new Error("List not found")
  }
  
  if (docSnap.data().userId !== userId) {
    throw new Error("Unauthorized")
  }
  
  await deleteDoc(docRef)
}

export async function updateList(id: string, userId: string, data: Partial<Omit<LinkList, "id" | "createdAt" | "userId">>) {
  const docRef = doc(db, "lists", id)
  const docSnap = await getDoc(docRef)
  
  if (!docSnap.exists()) {
    throw new Error("List not found")
  }
  
  if (docSnap.data().userId !== userId) {
    throw new Error("Unauthorized")
  }
  
  if (data.urls) {
    data.urls = data.urls.map(({ url, comment }) => ({
      url: url.startsWith('http') ? url : `https://${url}`,
      comment: comment || ''
    }))
  }
  
  await updateDoc(docRef, data)
}