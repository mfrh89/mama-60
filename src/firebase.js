import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: 'mama-60-ab76e.firebaseapp.com',
  projectId: 'mama-60-ab76e',
  storageBucket: 'mama-60-ab76e.firebasestorage.app',
  messagingSenderId: '682913672364',
  appId: '1:682913672364:web:600603285e8800bdeac309',
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const storage = getStorage(app)
