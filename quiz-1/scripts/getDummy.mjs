import axios from 'axios'
import { initializeApp, applicationDefault } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { splitEvery } from 'ramda'

const MAX_WRITE_PER_REQUEST = 500
const DUMMY_DATA_URL = 'https://randomuser.me/api/?results=3010&seed=foobar'
const DATABASE_URL = 'https://asia-east1.frontier-quiz.appspot.com'

const writeToFirestore = async (users) => {
  initializeApp({
    credential: applicationDefault(),
    databaseURL: DATABASE_URL,
  })

  const usersBatches = splitEvery(MAX_WRITE_PER_REQUEST, users)

  usersBatches.forEach(async (users) => {
    const db = getFirestore()
    const batch = db.batch()

    users.forEach((user) => {
      const userRef = db.collection('users').doc(user.email)
      batch.set(userRef, user)
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
