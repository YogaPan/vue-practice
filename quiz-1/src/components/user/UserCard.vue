<script setup lang="ts">
import { computed, ref } from 'vue'
import type { User } from '../../types/user'
import UserModal from './UserModal.vue'
import Button from '../button/Button.vue'
import useFavorite from '@/composables/useFavorite'

const props = defineProps<{ user: User }>()
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

const buttonText = computed(() => (props.user.favorite ? 'Remove' : 'Favorite'))
</script>

<template lang="pug">
div(
  class="rounded-lg w-[300px] h-[300px] bg-slate-300 p-2 cursor-pointer"
  @click="openUserModal")
  img(:src="user.picture.large" class="self-center w-[128px] h-[128px]")
  p(class="text-lg") {{ user.email }}
  p(class="text-lg") {{ user.name.first }}
  Button(@click="handleFavoriteClick" primary :text="buttonText" :loading="loading")
UserModal(
  :open="modalOpen"
  :user="user"
  @close="closeUserModal"
  @favorite="handleFavoriteClick"
  :loading="loading" )
</template>

<style scoped></style>
