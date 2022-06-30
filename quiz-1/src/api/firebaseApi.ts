import { initializeApp } from 'firebase/app'
import {
  collection,
  getFirestore,
  setDoc,
  doc,
  updateDoc,
  query,
  getDocs,
  orderBy,
  QueryConstraint,
  limit,
  startAfter,
  getDoc,
  increment,
  arrayUnion,
  arrayRemove,
  where,
} from 'firebase/firestore'
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth'
import type { User as AuthUser } from 'firebase/auth'
import { FilterType } from '../types/user'
import type {
  User,
  UserResult,
  AllCounterResult,
  FavoriteCounterResult,
} from '../types/user'
import firebaseConfig from '../../fireBaseConfig.json'

export const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)

const collections = {
  users: 'users',
  counter: 'counter',
}

const counterTypes = {
  allUser: 'allUser',
  favoriteUser: 'favoriteUser',
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

/**
 * 除了寫入 Firebase Authentication User 資料以外，
 * 還需要寫入 firestore users、增加 counter，讓首頁能夠呈現資料、分頁。
 */
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
  await updateDoc(doc(db, collections.counter, counterTypes.allUser), {
    count: increment(1),
  })

  return userCredential
}

/**
 * counter 分為兩種：
 * 1. 全部 users 的數量，給首頁 all user 頁面的分頁使用。
 * 2. 特定 Authentication User uid 底下的收藏數量，給首頁 favorite 頁面的分頁使用。
 */
const fetchCounter = async (
  filterType: FilterType,
  uid: string
): Promise<number> => {
  if (filterType === FilterType.All) {
    const counterType = counterTypes.allUser
    const docRef = doc(db, collections.counter, counterType)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) return 0
    // 因為自己的資料被過濾掉了，所以 total count 應該要 -1。
    return (docSnap.data() as AllCounterResult).count - 1 || 0
  }

  const counterType = counterTypes.favoriteUser
  const docRef = doc(db, collections.counter, counterType)
  const docSnap = await getDoc(docRef)

  if (!docSnap.exists()) return 0
  return (docSnap.data() as FavoriteCounterResult)[uid] || 0
}

const fetchUsers = async (
  filterType: FilterType,
  pageSize: number,
  reverse: boolean,
  isLastPage: boolean,
  firstDoc?: string | null,
  lastDoc?: string | null
): Promise<UserResult> => {
  const currentUser = await getCurrentUser()
  const totalCount = await fetchCounter(filterType, currentUser?.uid || '')
  if (isLastPage) pageSize = totalCount % pageSize

  const getQueryConstraints = () => {
    const queryConstraints: QueryConstraint[] = [
      orderBy('email', reverse ? 'desc' : 'asc'),
    ]

    if (reverse) {
      if (firstDoc) queryConstraints.push(startAfter(firstDoc))
    } else {
      if (lastDoc) queryConstraints.push(startAfter(lastDoc))
    }

    if (filterType === FilterType.Favorite) {
      queryConstraints.push(
        where('favoriteBy', 'array-contains', currentUser?.uid)
      )
    }

    // 根據討論的需求規格，使用者必須看不到自己。
    queryConstraints.push(where('email', '!=', currentUser?.email))
    // 多取得一比資料，用來偵測是否還有下一頁。
    queryConstraints.push(limit(pageSize + 1))

    return queryConstraints
  }

  const q = query(collection(db, collections.users), ...getQueryConstraints())
  const querySnapshot = await getDocs(q)

  // 需要判斷這個 user 是否有被當前登入使用者收藏
  const processIsCurrentUserFavorite = (user: User) => {
    if (!currentUser) return user
    return { ...user, favorite: user.favoriteBy?.includes(currentUser.uid) }
  }

  const processNormalDirection = () => {
    const hasPrev = Boolean(doc)
    const hasNext = querySnapshot.docs.length === pageSize + 1
    const users = querySnapshot.docs
      .map((doc) => doc.data() as User)
      .map(processIsCurrentUserFavorite)
      .slice(0, pageSize)
    const firstUser = users[0]?.email
    const lastUser = users[users.length - 1]?.email

    return {
      users,
      firstUser,
      lastUser,
      hasNext,
      hasPrev,
      totalCount,
    }
  }

  const processReverseDirection = () => {
    const hasPrev = querySnapshot.docs.length === pageSize + 1
    const hasNext = Boolean(doc)
    const docs = querySnapshot.docs.slice().reverse()
    const users = docs
      .map((doc) => doc.data() as User)
      .map(processIsCurrentUserFavorite)
      .slice(hasPrev ? 1 : 0, querySnapshot.docs.length)
    const firstUser = users[0]?.email
    const lastUser = users[users.length - 1]?.email

    return {
      users,
      firstUser,
      lastUser,
      hasNext,
      hasPrev,
      totalCount,
    }
  }

  return reverse ? processReverseDirection() : processNormalDirection()
}

/**
 * 寫入目前登入使用的 uid 至被收藏 user 的 favoriteBy 底下，
 * 並且新增此 uid 底下的 favorite count。
 */
const favorite = async (targetUser: User) => {
  const currentUser = await getCurrentUser()
  if (!currentUser) return

  const targetUserRef = doc(db, collections.users, targetUser.email)
  const counterRef = doc(db, collections.counter, counterTypes.favoriteUser)

  if (targetUser.favorite) {
    updateDoc(targetUserRef, {
      favoriteBy: arrayRemove(currentUser.uid),
    })
    await updateDoc(counterRef, { [currentUser.uid]: increment(-1) })
  } else {
    updateDoc(targetUserRef, {
      favoriteBy: arrayUnion(currentUser.uid),
    })
    await updateDoc(counterRef, { [currentUser.uid]: increment(1) })
  }
}

const api = {
  getCurrentUser,
  signIn,
  register,
  fetchUsers,
  favorite,
}

export default api
