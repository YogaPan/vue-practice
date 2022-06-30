<script setup lang="ts">
import { DisplayMode } from '@/types/user'
import Navigation from './layout/Navigation.vue'
import FilterBar from './layout/FilterBar.vue'
import UserCardBlock from './user/UserCardBlock.vue'
import UserListBlock from './user/UserListBlock.vue'
import Pagination from './layout/Pagination.vue'
import Loading from './layout/Loading.vue'
import Empty from './layout/Empty.vue'
import useFetchUsers from '../composables/useFetchUsers'

const {
  users,
  totalPage,
  loading,
  pageOption,
  handleFirstPage,
  handlePrevPage,
  handleNextPage,
  handleLastPage,
  handleFilterChange,
  handlePageSizeChange,
  handleDisplayModeChange,
  handleFavoriteSuccess,
} = useFetchUsers()
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
    div(v-if="loading" class="flex-1 flex items-center justify-center")
      Loading
    div(v-else class="flex-1 flex flex-col justify-between bg-slate-100") 
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
      :totalPage="totalPage"
      @first-page="handleFirstPage"
      @last-page="handleLastPage"
      @prev-page="handlePrevPage"
      @next-page="handleNextPage")
</template>

<style scoped></style>
