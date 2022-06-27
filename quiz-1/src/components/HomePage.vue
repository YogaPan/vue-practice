<script setup lang="ts">
import { computed, ref, onMounted, watch, type Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  doc,
  collection,
  orderBy,
  limit,
  getDoc,
  getDocs,
  query,
  QueryConstraint,
} from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { FilterType, DisplayMode, type UserWithFavorite } from '@/types/user'
import { db, getCurrentUser } from '../initFirebase'
import Navigation from './layout/Navigation.vue'
import FilterBar from './layout/FilterBar.vue'
import UserCardBlock from './user/UserCardBlock.vue'
import UserListBlock from './user/UserListBlock.vue'
import Pagination from './layout/Pagination.vue'
import Loading from './layout/Loading.vue'
import Empty from './layout/Empty.vue'
import type { User, FavoriteDoc } from '@/types/user'

const router = useRouter()
const route = useRoute()

const loading = ref(false)
const users = ref<User[]>([])
const favoriteList = ref<string[]>([])
const pageOption = computed(() => ({
  filterType: Number(route.query.filterType) || FilterType.All,
  pageIndex: Number(route.query.pageIndex) || 1,
  pageSize: Number(route.query.pageSize) || 30,
  displayMode: Number(route.query.displayMode) || DisplayMode.Card,
}))

const usersWithFavorite = computed(() => {
  const auth = getAuth()
  const currentUser = auth.currentUser

  let result: UserWithFavorite[] = users.value
    .filter((user) => user.email !== currentUser?.email)
    .map((user) => ({
      ...user,
      favorite: favoriteList.value.includes(user.email),
    }))

  if (pageOption.value.filterType === FilterType.Favorite)
    result = result.filter((user) => user.favorite)

  return result
})

const paginatedUsers = computed(() => {
  const limit = pageOption.value.pageSize
  const offset = (pageOption.value.pageIndex - 1) * limit
  return usersWithFavorite.value.slice(offset, offset + limit)
})

const fetchUsers = async () => {
  loading.value = true

  try {
    const queryConstraints: QueryConstraint[] = [orderBy('email'), limit(1)]
    const q = query(collection(db, 'users'), ...queryConstraints)
    const querySnapshot = await getDocs(q)
    users.value = querySnapshot.docs.map((doc) => doc.data() as User)
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

const fetchFavorites = async () => {
  const currentUser = await getCurrentUser()
  if (!currentUser) return

  const docRef = doc(db, 'favorites', currentUser.uid)
  const docSnap = await getDoc(docRef)
  if (!docSnap.exists()) return
  favoriteList.value = (docSnap.data() as FavoriteDoc).favorites
}

const changeQuery = (key: string) => (value: string | number) => {
  router.push({ name: 'homePage', query: { ...route.query, [key]: value } })
}

const handleFilterChange = (filterType: FilterType) => {
  router.push({
    name: 'homePage',
    query: { ...route.query, pageIndex: 1, filterType },
  })
}
const handlePageIndexChange = changeQuery('pageIndex')
const handlePageSizeChange = (pageSize: number) => {
  router.push({
    name: 'homePage',
    query: { ...route.query, pageIndex: 1, pageSize },
  })
}
const handleDisplayModeChange = changeQuery('displayMode')

const handleFavoriteSuccess = async (_targetUser: User) => {
  fetchFavorites()
}

onMounted(() => {
  fetchUsers()
  fetchFavorites()
})
</script>

<template lang="pug">
div(class="flex flex-col h-screen")
  Navigation
  div(class="flex-1 flex flex-col")
    FilterBar(
      :filter-type="pageOption.filterType"
      :display-mode="pageOption.displayMode"
      :page-size="pageOption.pageSize"
      @filter-change="handleFilterChange"
      @page-size-change="handlePageSizeChange"
      @display-mode-change="handleDisplayModeChange")
    Loading(v-if="loading")
    div(v-else class="flex-1 bg-slate-100") 
      Empty(v-if="usersWithFavorite.length === 0")
      template(v-else)
        UserCardBlock(
          v-if="pageOption.displayMode === DisplayMode.Card"
          :users="paginatedUsers"
          @favorite-success="handleFavoriteSuccess")
        UserListBlock(
          v-else
          :users="paginatedUsers"
          @favorite-success="handleFavoriteSuccess")
        Pagination(
          :page="pageOption.pageIndex"
          :page-size="pageOption.pageSize"
          :total="usersWithFavorite.length"
          @page-change="handlePageIndexChange")
</template>

<style scoped></style>
