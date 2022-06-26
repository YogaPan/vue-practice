<script setup lang="ts">
import UserCard from './UserCard.vue'
import type { User } from '@/types/user'
defineProps<{ users: User[] }>()
const emit = defineEmits(['favoriteSuccess'])

const handleFavoriteSuccess = (user: User) => emit('favoriteSuccess', user)
</script>

<template lang="pug">
div(class="flex flex-row flex-wrap gap-3 p-4 bg-slate-100")
  UserCard(
    v-for="user in users"
    :key="user.email"
    :user="user"
    @favorite-success="handleFavoriteSuccess")
</template>

<style scoped></style>
