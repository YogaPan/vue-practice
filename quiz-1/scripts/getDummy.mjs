import axios from 'axios'
import { initializeApp, applicationDefault } from 'firebase-admin/app'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'
import { splitEvery } from 'ramda'

const COUNT = 3010
const DUMMY_DATA_URL = `https://randomuser.me/api/?results=${COUNT}&seed=foobar`
const DATABASE_URL = 'https://asia-east1.frontier-quiz.appspot.com'
const TARGET_COLLECTION = 'users'
const COUNTER_COLLECTION = 'counter'
// Firestore 單次最大寫入比數上限
const MAX_WRITE_PER_REQUEST = 500

const writeToFirestore = async (users) => {
  initializeApp({
    credential: applicationDefault(),
    databaseURL: DATABASE_URL,
  })

  const db = getFirestore()
  const allUserCounterRef = db.collection(COUNTER_COLLECTION).doc('allUser')

  allUserCounterRef.set({ count: 0 })

  // 因為寫入 counter 也要計算在內，必須扣掉 1
  const usersBatches = splitEvery(MAX_WRITE_PER_REQUEST - 1, users)
  usersBatches.forEach(async (users) => {
    const batch = db.batch()

    users.forEach((user) => {
      const userRef = db.collection(TARGET_COLLECTION).doc(user.email)
      batch.set(userRef, user)
    })

    // 因為 firestore 沒 total count
    // 這裡使用 distributed counter，作為計算分頁數量用。
    // Ref: https://firebase.google.com/docs/firestore/solutions/counters
    batch.update(allUserCounterRef, {
      count: FieldValue.increment(users.length),
    })

    await batch.commit()
  })
}

const main = async () => {
  const res = await axios.get(DUMMY_DATA_URL)
  const body = res.data
  const users = body.results
  await writeToFirestore(users)
}

main()
