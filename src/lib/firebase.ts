import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyC6sETJs2vB_jYTAA8mu4xxMD_-63QtBNs",
  authDomain: "link-8b9e6.firebaseapp.com",
  projectId: "link-8b9e6",
  storageBucket: "link-8b9e6.firebasestorage.app",
  messagingSenderId: "727182203681",
  appId: "1:727182203681:web:e1b833d35cc29d853dfc60"
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app) 