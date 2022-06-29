import api from '@/initFirebase'
import { FilterType, DisplayMode, type User } from '@/types/user'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const useFetchUsers = () => {
  const route = useRoute()
  const router = useRouter()

  const users = ref<User[]>([])
  const firstUser = ref<string>()
  const lastUser = ref<string>()
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
    firstUser: route.query.firstUser
      ? String(route.query.firstUser)
      : undefined,
    lastUser: route.query.lastUser ? String(route.query.lastUser) : undefined,
    reverse: Boolean(Number(route.query.reverse)) || false,
  }))

  const fetchUsers = async () => {
    loading.value = true
    try {
      console.log(pageOption.value)
      const fetchResult = await api.fetchUsers(
        pageOption.value.pageSize,
        pageOption.value.reverse,
        pageOption.value.firstUser,
        pageOption.value.lastUser
      )

      users.value = fetchResult.users
      firstUser.value = fetchResult.firstUser
      lastUser.value = fetchResult.lastUser
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
    router.push({
      name: 'homePage',
      query: {
        ...route.query,
        pageIndex: 1,
        filterType,
        firstUser: undefined,
        lastUser: undefined,
        reverse: Number(false),
      },
    })
  }

  const handleFirstPage = () => {
    router.push({
      name: 'homePage',
      query: {
        ...route.query,
        pageIndex: 1,
        firstUser: undefined,
        lastUser: undefined,
        reverse: Number(false),
      },
    })
  }

  const handleLastPage = () => {
    router.push({
      name: 'homePage',
      query: {
        ...route.query,
        pageIndex: totalPage.value,
        firstUser: undefined,
        lastUser: undefined,
        reverse: Number(true),
      },
    })
  }

  const handlePrevPage = () => {
    const pageIndex = pageOption.value.pageIndex - 1
    if (pageIndex <= 1) return handleFirstPage()
    changeQuery('pageIndex')(pageIndex)
    router.push({
      name: 'homePage',
      query: {
        ...route.query,
        pageIndex,
        firstUser: firstUser.value,
        lastUser: lastUser.value,
        reverse: Number(true),
      },
    })
  }

  const handleNextPage = () => {
    router.push({
      name: 'homePage',
      query: {
        ...route.query,
        pageIndex: pageOption.value.pageIndex + 1,
        firstUser: firstUser.value,
        lastUser: lastUser.value,
        reverse: Number(false),
      },
    })
  }

  const handlePageSizeChange = (pageSize: number) => {
    router.push({
      name: 'homePage',
      query: {
        ...route.query,
        pageIndex: 1,
        pageSize,
        firstUser: undefined,
        lastUser: undefined,
        reverse: Number(false),
      },
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
