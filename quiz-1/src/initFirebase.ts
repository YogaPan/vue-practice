import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import type { User } from 'firebase/auth'
import firebaseConfig from '../fireBaseConfig.json'

export const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const getCurrentUser = (): Promise<User | null> => {
  return new Promise((resolve, reject) => {
    const auth = getAuth()
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        unsubscribe()
        resolve(user)
      },
      reject
    )
  })
}
