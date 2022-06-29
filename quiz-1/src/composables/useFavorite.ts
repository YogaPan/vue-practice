import { ref } from 'vue'
import type { User } from '@/types/user'
import api from '../api/firebaseApi'

const useFavorite = (targetUser: User) => {
  const loading = ref(false)
  const error = ref<Error>()

  const favorite = async () => {
    loading.value = true
    error.value = undefined

    try {
      await api.favorite(targetUser)
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
