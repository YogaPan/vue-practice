import { ref } from 'vue'
import { updateDoc, doc } from 'firebase/firestore'
import { db } from '../initFirebase'
import type { User } from '@/types/user'

const useFavorite = (user: User) => {
  const loading = ref(false)
  const error = ref<Error>()

  const favorite = async () => {
    loading.value = true
    try {
      const userRef = doc(db, 'users', user.email)
      const favorite = !user.favorite
      await updateDoc(userRef, { favorite })
      error.value = undefined
    } catch (err) {
      if (err instanceof Error) error.value = err
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  return { favorite, loading, error }
}

export default useFavorite
