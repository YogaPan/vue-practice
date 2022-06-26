<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  total: number
  page: number
  pageSize: number
}>()
const maxVisibleButtons = 3
const emit = defineEmits(['pageChange'])

const totalPage = computed(() => {
  return 100
})

const isInFirstPage = computed(() => props.page === 1)
const isInLastPage = computed(() => props.page === totalPage.value)
const startPage = computed(() => {
  if (props.page === 1) return 1
  if (props.page === totalPage.value) totalPage.value - maxVisibleButtons + 1
  return props.page - 1
})
const endPage = computed(() =>
  Math.min(startPage.value + maxVisibleButtons - 1, totalPage.value)
)
const pages = computed(() => {
  const range = []
  for (let i = startPage.value; i <= endPage.value; i += 1) {
    range.push({
      name: i,
      isDisabled: i === props.page,
    })
  }
  return range
})

const gotoFirst = () => emit('pageChange', 1)
const gotoLast = () => emit('pageChange', totalPage)
const gotoPrevious = () => emit('pageChange', props.page - 1)
const gotoNext = () => emit('pageChange', props.page - 1)
const gotoPage = (page: number) => emit('pageChange', page)
const isPageActive = (page: number) => page === props.page
</script>

<template lang="pug">
div(class="flex flex-row justify-between py-2 px-4")
  ul(class="pagination")
    li(class="pagination-item")
      button(
        type="button"
        @click="gotoFirst"
        :disabled="isInFirstPage"
        aria-label="Go to first page"
      ) First
    li(class="pagination-item")
      button(
        type="button"
        @click="gotoPrevious"
        :disabled="isInFirstPage"
        aria-label="Go to previous page"
      ) Previous
    li(:key="page.name" v-for="page in pages" class="pagination-item")
      button(
        type="button"
        @click="gotoPage(page.name)"
        :disabled="page.isDisabled"
        :class="{ active: isPageActive(page.name) }"
        :aria-label="`Go to page number ${page.name}`"
      ) {{ page.name }}
    li(class="pagination-item")
      button(
        type="button"
        @click="gotoNext"
        :disabled="isInLastPage"
        aria-label="Go to next page"
      ) Next
    li(class="pagination-item")
      button(
        type="button"
        @click="gotoLast"
        :disabled="isInLastPage"
        aria-label="Go to last page"
      ) Last
</template>

<style scoped>
.pagination {
  list-style-type: none;
}

.pagination-item {
  display: inline-block;
}

.active {
  background-color: #4aae9b;
  color: #ffffff;
}
</style>
