<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  total: number
  page: number
  pageSize: number
}>()
const maxVisibleButtons = 5
const emit = defineEmits(['pageChange'])

const totalPage = computed(() => Math.ceil(props.total / props.pageSize))

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
const gotoLast = () => emit('pageChange', totalPage.value)
const gotoPrevious = () => emit('pageChange', props.page - 1)
const gotoNext = () => emit('pageChange', props.page + 1)
const gotoPage = (page: number) => emit('pageChange', page)
const isPageActive = (page: number) => page === props.page
</script>

<template lang="pug">
div(class="flex flex-row justify-center py-2 px-4")
  ul(class="list-none flex flex-row items-center gap-2")
    li(class="inline-block px-2 py-1 border-slate-800 border-2 rounded")
      button(
        type="button"
        @click="gotoFirst"
        :disabled="isInFirstPage"
        :class="{ 'text-slate-300': isInFirstPage }"
      ) 1
    li(class="inline-block px-2 py-1 border-slate-800 border-2 rounded")
      button(
        type="button"
        @click="gotoPrevious"
        :disabled="isInFirstPage"
        :class="{ 'text-slate-300': isInFirstPage }"
      ) Previous
    li(
      :key="page.name"
      v-for="page in pages"
      class="inline-block px-2 py-1 border-slate-800 border-2 rounded"
      :class="{ 'text-white bg-slate-800': isPageActive(page.name) }")
      button(
        type="button"
        @click="gotoPage(page.name)"
        :disabled="page.isDisabled"
      ) {{ page.name }}
    li(class="inline-block px-2 py-1 border-slate-800 border-2 rounded")
      button(
        type="button"
        @click="gotoNext"
        :disabled="isInLastPage"
        :class="{ 'text-slate-300': isInLastPage }"
      ) Next
    li(class="inline-block px-2 py-1 border-slate-800 border-2 rounded")
      button(
        type="button"
        @click="gotoLast"
        :disabled="isInLastPage"
        :class="{ 'text-slate-300': isInLastPage }"
      ) {{ totalPage}}
</template>

<style scoped></style>
