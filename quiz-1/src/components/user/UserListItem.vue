<script setup lang="ts">
import { ref } from 'vue'
import type { UserWithFavorite } from '../../types/user'
import UserModal from './UserModal.vue'
import FavoriteButton from '../button/FavoriteButton.vue'
import useFavorite from '@/composables/useFavorite'

const props = defineProps<{ user: UserWithFavorite }>()
const emit = defineEmits(['favoriteSuccess'])
const modalOpen = ref(false)

const openUserModal = () => (modalOpen.value = true)
const closeUserModal = () => (modalOpen.value = false)

const { favorite, loading } = useFavorite(props.user)

const handleFavoriteClick = async (e: Event) => {
  e.preventDefault()
  e.stopPropagation()

  await favorite()
  emit('favoriteSuccess', props.user)
}
</script>

<template lang="pug">
div(class="w-full flex flex-row justify-between gap-4 bg-slate-200 p-2 pr-6 cursor-pointer rounded" @click="openUserModal")
  div(class="flex flex-row gap-4")
    img(v-if="user.picture.large" :src="user.picture.large" class="self-center w-[128px] h-[128px] rounded")
    img(v-else src="../../assets/default-avatar.png" class="self-center w-[128px] h-[128px] rounded")
    div(class="flex flex-col items-start justify-center")
      p(class="text-xl") {{ user.name.first }}
      p {{ user.email }}
  FavoriteButton(class="justify-self-end" @click="handleFavoriteClick" :favorite="props.user.favorite" :size="30")
UserModal(
  :open="modalOpen"
  :user="user"
  @close="closeUserModal"
  @favorite="handleFavoriteClick"
  :loading="loading" )
</template>

<style scoped></style>
