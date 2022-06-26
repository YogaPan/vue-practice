<script setup lang="ts">
import { DisplayMode, FilterType } from '@/types/user'

defineProps<{
  filterType: FilterType
  displayMode: DisplayMode
  pageSize: number
}>()
const emit = defineEmits([
  'filterChange',
  'pageSizeChange',
  'displayModeChange',
])

const handleFilterChange = (filterType: FilterType) => () => {
  emit('filterChange', filterType)
}
const handleSetFilterAll = handleFilterChange(FilterType.All)
const handleSetFilterFavorite = handleFilterChange(FilterType.Favorite)

const handlePageSizeChange = (event: Event) => {
  const pageSize = Number((event.target as HTMLInputElement).value)
  emit('pageSizeChange', pageSize)
}

const handleDisplayModeChange = (displayMode: DisplayMode) => () => {
  emit('displayModeChange', displayMode)
}
const handleSetCardDisplay = handleDisplayModeChange(DisplayMode.Card)
const handleSetListDisplay = handleDisplayModeChange(DisplayMode.List)
</script>

<template lang="pug">
div(class="flex flex-row justify-between py-2 px-4")
  div(class="flex flex-row w-40 gap-3")
    button(class="text-lg" :class="{ 'text-purple-600': filterType === FilterType.All}" @click="handleSetFilterAll") ALL
    button(class="text-lg" :class="{ 'text-purple-600': filterType === FilterType.Favorite}" @click="handleSetFilterFavorite") Favorite
  div(class="flex flex-row gap-3")
    select(name="cars" id="cars" :value="pageSize" @input="handlePageSizeChange")
      option(value="10") 10
      option(value="30") 30
      option(value="50") 50
    div(class="flex flex-row w-40 gap-3")
      button(class="text-lg" :class="{ 'text-purple-600': displayMode === DisplayMode.Card}" @click="handleSetCardDisplay") Card
      button(class="text-lg" :class="{ 'text-purple-600': displayMode === DisplayMode.List}" @click="handleSetListDisplay") List
</template>

<style scoped></style>
