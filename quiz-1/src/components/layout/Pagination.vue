<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  page: number
  pageSize: number
  totalPage: number
}>()
const emit = defineEmits(['firstPage', 'prevPage', 'nextPage', 'lastPage'])
const gotoFirst = () => emit('firstPage')
const gotoLast = () => emit('lastPage')
const gotoPrevious = () => emit('prevPage')
const gotoNext = () => emit('nextPage')

const maxVisibleButtons = 3

const isInFirstPage = computed(() => props.page === 1)
const isInLastPage = computed(() => props.page === props.totalPage)
const showJumpToFirstPage = computed(() => props.page >= maxVisibleButtons)
const showLeftEllipsis = computed(() => props.page >= maxVisibleButtons + 1)
const showRightEllipsis = computed(
  () => props.page <= props.totalPage - maxVisibleButtons
)
const showJumpToLastPage = computed(
  () => props.page <= props.totalPage - (maxVisibleButtons + 1)
)

const centerPages = computed(() => {
  const range = []
  // prev page
  if (props.page !== 1) {
    range.push({
      name: props.page - 1,
      isDisabled: false,
      onclick: gotoPrevious,
    })
  }
  // current page
  range.push({
    name: props.page,
    isDisabled: true,
  })
  // next page
  if (props.page !== props.totalPage) {
    range.push({
      name: props.page + 1,
      isDisabled: false,
      onclick: gotoNext,
    })
  }

  return range
})

const isPageActive = (page: number) => page === props.page
</script>

<template lang="pug">
div(class="flex flex-row justify-center py-8 px-4")
  ul(class="list-none flex flex-row items-center gap-2")
    li(class="inline-block")
      button(
        type="button"
        class="flex items-center cursor-pointer"
        @click="gotoPrevious"
        :disabled="isInFirstPage"
        :class="{ 'text-slate-300 cursor-not-allowed opacity-25': isInFirstPage }"
      )
        img(src="/chevron-left.svg" class="w-full self-center")
    li(v-if="showJumpToFirstPage" class="inline-block px-2 py-1 border-slate-800 border-2 rounded")
      button(
        type="button"
        @click="gotoFirst"
        :disabled="isInFirstPage"
      ) 1
    li(v-if="showLeftEllipsis" class="inline-block")
      img(src="/ellipsis.svg" class="w-[32px] self-center")

    li(
      v-for="page in centerPages"
      :key="page.name"
      @click="page.onclick"
      class="inline-block px-2 py-1 border-slate-800 border-2 rounded"
      :class="{ 'text-white bg-slate-800': isPageActive(page.name) }")
      button(
        type="button"
        :disabled="page.isDisabled"
      ) {{ page.name }}

    li(v-if="showRightEllipsis" class="inline-block")
      img(src="/ellipsis.svg" class="w-[32px] self-center")
    li(v-if="showJumpToLastPage" class="inline-block px-2 py-1 border-slate-800 border-2 rounded")
      button(
        type="button"
        @click="gotoLast"
        :disabled="isInLastPage"
      ) {{ totalPage }}
    li(class="inline-block")
      button(
        type="button"
        class="flex items-center cursor-pointer"
        @click="gotoNext"
        :disabled="isInLastPage"
        :class="{ 'text-slate-300 cursor-not-allowed opacity-25': isInLastPage }"
      )
        img(src="/chevron-right.svg" class="w-full self-center")
</template>

<style scoped></style>
