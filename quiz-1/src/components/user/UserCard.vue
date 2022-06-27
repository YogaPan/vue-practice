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
div(
  class="rounded-lg w-[300px] bg-slate-200 cursor-pointer overflow-hidden"
  @click="openUserModal")
  img(v-if="user.picture.large" :src="user.picture.large" class="w-full self-center")
  img(v-else src="../../assets/default-avatar.png" class="w-full self-center")
  div(class="flex flex-col p-2")
    div(class="flex items-center justify-between")
      p(class="text-lg") {{ user.name.first }}
      FavoriteButton(@click="handleFavoriteClick" :favorite="props.user.favorite" :size="20")
    p(class="text-lg") {{ user.email }}
UserModal(
  :open="modalOpen"
  :user="user"
  @close="closeUserModal"
  @favorite="handleFavoriteClick"
  :loading="loading")
</template>

<style scoped></style>
