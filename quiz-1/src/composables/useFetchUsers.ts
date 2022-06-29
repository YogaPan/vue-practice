import api from '@/initFirebase'
import { FilterType, DisplayMode, type User } from '@/types/user'
import type { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const useFetchUsers = () => {
  const route = useRoute()
  const router = useRouter()

  const reverse = ref(false)
  const users = ref<User[]>([])
  const firstUserDoc = ref<QueryDocumentSnapshot<DocumentData>>()
  const lastUserDoc = ref<QueryDocumentSnapshot<DocumentData>>()
  const totalCount = ref(0)
  const totalPage = computed(() =>
    Math.ceil(totalCount.value / pageOption.value.pageSize)
  )
  const loading = ref(false)
  const pageOption = computed(() => ({
    filterType: Number(route.query.filterType) || FilterType.All,
    pageIndex: Number(route.query.pageIndex) || 1,
    pageSize: Number(route.query.pageSize) || 4,
    displayMode: Number(route.query.displayMode) || DisplayMode.Card,
  }))

  const fetchUsers = async () => {
    loading.value = true
    try {
      const fetchResult = await api.fetchUsers(
        pageOption.value.pageSize,
        reverse.value,
        firstUserDoc.value,
        lastUserDoc.value
      )
      users.value = fetchResult.users
      firstUserDoc.value = fetchResult.firstUserDoc
      lastUserDoc.value = fetchResult.lastUserDoc
      totalCount.value = fetchResult.allUserCount
    } catch (err) {
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  onMounted(fetchUsers)
  watch(() => pageOption.value.filterType, fetchUsers)
  watch(() => pageOption.value.pageIndex, fetchUsers)
  watch(() => pageOption.value.pageSize, fetchUsers)

  const changeQuery = (key: string) => (value: string | number) => {
    router.push({ name: 'homePage', query: { ...route.query, [key]: value } })
  }

  const handleFilterChange = (filterType: FilterType) => {
    reverse.value = false
    firstUserDoc.value = undefined
    lastUserDoc.value = undefined
    router.push({
      name: 'homePage',
      query: { ...route.query, pageIndex: 1, filterType },
    })
  }

  const handleFirstPage = () => {
    changeQuery('pageIndex')(1)
    reverse.value = false
    firstUserDoc.value = undefined
    lastUserDoc.value = undefined
  }

  const handleLastPage = () => {
    changeQuery('pageIndex')(totalPage.value)
    reverse.value = true
    firstUserDoc.value = undefined
    lastUserDoc.value = undefined
  }

  const handlePrevPage = () => {
    reverse.value = true
    const pageIndex = pageOption.value.pageIndex - 1
    changeQuery('pageIndex')(pageIndex)
    if (pageIndex <= 1) {
      reverse.value = false
      firstUserDoc.value = undefined
      lastUserDoc.value = undefined
    }
  }

  const handleNextPage = () => {
    reverse.value = false
    changeQuery('pageIndex')(pageOption.value.pageIndex + 1)
  }

  const handlePageSizeChange = (pageSize: number) => {
    firstUserDoc.value = undefined
    lastUserDoc.value = undefined
    reverse.value = false
    router.push({
      name: 'homePage',
      query: { ...route.query, pageIndex: 1, pageSize },
    })
  }
  const handleDisplayModeChange = changeQuery('displayMode')
  const handleFavoriteSuccess = async (targetUser: User) => {
    if (pageOption.value.filterType === FilterType.All) {
      users.value.forEach((user) => {
        if (user.email === targetUser.email) user.favorite = !user.favorite
      })
    }
    if (pageOption.value.filterType === FilterType.Favorite)
      users.value = users.value.filter(
        (user) => user.email !== targetUser.email
      )
  }

  return {
    fetchUsers,
    pageOption,
    totalCount,
    users,
    loading,
    handleFilterChange,
    handleFirstPage,
    handleLastPage,
    handlePrevPage,
    handleNextPage,
    handlePageSizeChange,
    handleDisplayModeChange,
    handleFavoriteSuccess,
  }
}

export default useFetchUsers
