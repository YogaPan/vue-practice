<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  collection,
  orderBy,
  limit,
  where,
  getDocs,
  query,
  QueryConstraint,
} from 'firebase/firestore'
import { FilterType, DisplayMode } from '@/types/user'
import type { User } from '@/types/user'
import { db } from '../initFirebase'
import Navigation from './layout/Navigation.vue'
import FilterBar from './layout/FilterBar.vue'
import UserCardBlock from './user/UserCardBlock.vue'
import UserListBlock from './user/UserListBlock.vue'
import Pagination from './layout/Pagination.vue'
import Loading from './layout/Loading.vue'
import Empty from './layout/Empty.vue'

const router = useRouter()
const route = useRoute()

const loading = ref(false)
const users = ref<User[]>([])
const totalCount = ref<number>(0)
const pageOption = computed(() => ({
  filterType: Number(route.query.filterType) || FilterType.All,
  pageIndex: Number(route.query.pageIndex) || 1,
  pageSize: Number(route.query.pageSize) || 30,
  displayMode: Number(route.query.displayMode) || DisplayMode.Card,
}))

// TODO: Firestore Pagination
const fetchUsers = async () => {
  loading.value = true

  try {
    const queryConstraints: QueryConstraint[] = [
      orderBy('name'),
      limit(pageOption.value.pageSize),
    ]
    if (pageOption.value.filterType === FilterType.Favorite)
      queryConstraints.push(where('favorite', '==', true))
    const q = query(collection(db, 'users'), ...queryConstraints)
    const querySnapshot = await getDocs(q)
    users.value = querySnapshot.docs.map((doc) => doc.data() as User)
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
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

const handleFavoriteSuccess = async (targetUser: User) => {
  if (pageOption.value.filterType === FilterType.All) {
    users.value.forEach((user) => {
      if (user.email === targetUser.email) user.favorite = !user.favorite
    })
  }
  if (pageOption.value.filterType === FilterType.Favorite) {
    users.value = users.value.filter((user) => user.email !== targetUser.email)
  }
}

watch(() => pageOption.value.filterType, fetchUsers)
watch(() => pageOption.value.pageIndex, fetchUsers)
watch(() => pageOption.value.pageSize, fetchUsers)

onMounted(fetchUsers)
</script>

<template lang="pug">
div
  Navigation
  FilterBar(
    :filter-type="pageOption.filterType"
    :display-mode="pageOption.displayMode"
    :page-size="pageOption.pageSize"
    @filter-change="handleFilterChange"
    @page-size-change="handlePageSizeChange"
    @display-mode-change="handleDisplayModeChange")
  Loading(v-if="loading")
  template(v-else) 
    Empty(v-if="users.length === 0")
    template(v-else)
      UserCardBlock(
        v-if="pageOption.displayMode === DisplayMode.Card"
        :users="users"
        @favorite-success="handleFavoriteSuccess")
      UserListBlock(
        v-else
        :users="users"
        @favorite-success="handleFavoriteSuccess")
      Pagination(
        :page="pageOption.pageIndex"
        :page-size="pageOption.pageSize"
        :total="totalCount"
        @page-change="handlePageIndexChange")
</template>

<style scoped></style>
