import { ref } from 'vue'
import { setDoc, updateDoc, doc, getDoc } from 'firebase/firestore'
import { db, getCurrentUser } from '../initFirebase'
import type { FavoriteDoc, User } from '@/types/user'

const useFavorite = (targetUser: User) => {
  const loading = ref(false)
  const error = ref<Error>()

  const favorite = async () => {
    loading.value = true
    error.value = undefined

    try {
      const currentUser = await getCurrentUser()
      if (!currentUser) return

      const docRef = doc(db, 'favorites', currentUser.uid)
      const docSnap = await getDoc(docRef)
      if (!docSnap.exists()) {
        await setDoc(doc(db, 'favorites', currentUser.uid), {
          favorites: [targetUser.email],
        })
        return
      }

      const currentUserFavorites = (docSnap.data() as FavoriteDoc).favorites
      currentUserFavorites
      if (currentUserFavorites.find((email) => email === targetUser.email)) {
        await updateDoc(doc(db, 'favorites', currentUser.uid), {
          favorites: currentUserFavorites.filter(
            (email) => email !== targetUser.email
          ),
        })
      } else {
        await updateDoc(doc(db, 'favorites', currentUser.uid), {
          favorites: [...currentUserFavorites, targetUser.email],
        })
      }
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
