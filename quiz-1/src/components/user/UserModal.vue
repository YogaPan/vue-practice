<script setup lang="ts">
import type { UserWithFavorite } from '../../types/user'
import FavoriteButton from '../button/FavoriteButton.vue'

const props = defineProps<{
  open: boolean
  loading: boolean
  user: UserWithFavorite
}>()
const emit = defineEmits(['close', 'favorite'])
</script>

<template lang="pug">
div(v-if="open" class="w-full h-full fixed top-0 left-0 flex flex-col items-center justify-center z-10 opacity-50 bg-black")
div(v-if="open" class="w-full h-full fixed top-0 left-0 flex flex-col items-center justify-center z-10 rounded" @click="emit('close')")
  div(class="relative w-[300px] bg-slate-200 rounded-lg" @click="e => e.stopPropagation()")
    img(v-if="user.picture.large" :src="user.picture.large" class="w-full self-center")
    img(v-else src="../../assets/default-avatar.png" class="w-full self-center")
    div(class="flex flex-col p-4")
      div(class="flex flex-row justify-between items-center")
        p(class="text-lg") {{ user.name.first }}
        FavoriteButton(
          @click="e => $emit('favorite', e)"
          :favorite="props.user.favorite"
          :size="20"
          class="cursor-pointer")
      p(class="text-lg") {{ user.phone }}
      p(class="text-lg") {{ user.email }}
    img(
      @click="emit('close')"
      src="../../assets/close.svg"
      alt="close icon"
      class="absolute top-3 right-3 cursor-pointer"
      width="20"
      height="20")
</template>

<style scoped></style>
