import { initializeApp } from 'firebase/app'
import {
  collection,
  getFirestore,
  setDoc,
  doc,
  query,
  getDocs,
  orderBy,
  QueryConstraint,
  limit,
  QueryDocumentSnapshot,
  startAfter,
  getDoc,
  type DocumentData,
} from 'firebase/firestore'
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth'
import type { User as AuthUser } from 'firebase/auth'
import type { User } from './types/user'
import firebaseConfig from '../fireBaseConfig.json'

export const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)

export interface UserResult {
  users: User[]
  firstUserDoc: QueryDocumentSnapshot<DocumentData>
  lastUserDoc: QueryDocumentSnapshot<DocumentData>
  hasNext: boolean
  hasPrev: boolean
  allUserCount: number
  favoriteUserCount: number
}

export interface CounterResult {
  count: number
}

const collections = {
  users: 'users',
  counter: 'counter',
}

export const getCurrentUser = (): Promise<AuthUser | null> => {
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

const signIn = async (email: string, password: string) => {
  const auth = getAuth(app)
  return signInWithEmailAndPassword(auth, email, password)
}

const register = async (email: string, password: string, username: string) => {
  const auth = getAuth(app)
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  )

  await updateProfile(userCredential.user, { displayName: username })
  await setDoc(doc(db, collections.users, email), {
    name: { first: username, last: '' },
    email,
    picture: { large: '', medium: '', thumbnail: '' },
    phone: '',
  })

  return userCredential
}

const fetchCounter = async (counterType: string): Promise<number> => {
  const docRef = doc(db, collections.counter, counterType)
  const docSnap = await getDoc(docRef)

  if (!docSnap.exists()) return 0
  return (docSnap.data() as CounterResult).count
}

const fetchUsers = async (
  pageSize: number,
  reverse: boolean,
  firstDoc?: QueryDocumentSnapshot<DocumentData>,
  lastDoc?: QueryDocumentSnapshot<DocumentData>
): Promise<UserResult> => {
  const allUserCount = await fetchCounter('allUserCounter')
  const favoriteUserCount = await fetchCounter('favoriteUserCounter')

  const queryConstraints: QueryConstraint[] = [
    orderBy('email', reverse ? 'desc' : 'asc'),
    limit(pageSize + 1),
  ]
  if (reverse) {
    if (firstDoc) queryConstraints.push(startAfter(firstDoc))
  } else {
    if (lastDoc) queryConstraints.push(startAfter(lastDoc))
  }

  const q = query(collection(db, collections.users), ...queryConstraints)
  const querySnapshot = await getDocs(q)

  const processNormal = () => {
    const hasPrev = Boolean(doc)
    const hasNext = querySnapshot.docs.length === pageSize + 1
    const firstUserDoc = querySnapshot.docs[0]
    const lastUserDoc = hasNext
      ? querySnapshot.docs[querySnapshot.docs.length - 2]
      : querySnapshot.docs[querySnapshot.docs.length - 1]
    const users = querySnapshot.docs
      .map((doc) => doc.data() as User)
      .slice(0, pageSize)

    return {
      users,
      firstUserDoc,
      lastUserDoc,
      hasNext,
      hasPrev,
      allUserCount,
      favoriteUserCount,
    }
  }

  const processReverse = () => {
    const hasPrev = querySnapshot.docs.length === pageSize + 1
    const hasNext = Boolean(doc)
    const docs = querySnapshot.docs.slice().reverse()
    const firstUserDoc = hasPrev ? docs[1] : docs[0]
    const lastUserDoc = docs[docs.length - 1]
    const users = docs
      .map((doc) => doc.data() as User)
      .slice(hasPrev ? 1 : 0, querySnapshot.docs.length)

    return {
      users,
      firstUserDoc,
      lastUserDoc,
      hasNext,
      hasPrev,
      allUserCount,
      favoriteUserCount,
    }
  }

  return reverse ? processReverse() : processNormal()
}

const api = {
  getCurrentUser,
  signIn,
  register,
  fetchUsers,
}

export default api
