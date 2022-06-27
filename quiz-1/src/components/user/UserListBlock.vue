<script setup lang="ts">
import UserListItem from './UserListItem.vue'
import type { User } from '../../types/user'

defineProps<{ users: User[] }>()
const emit = defineEmits(['favoriteSuccess'])

const handleFavoriteSuccess = (user: User) => emit('favoriteSuccess', user)
</script>

<template lang="pug">
div(class="flex-1 flex flex-col items-center justify-start gap-4 p-4 bg-slate-100 ")
  UserListItem(
    v-for="user in users"
    :key="user.email"
    :user="user"
    @favorite-success="handleFavoriteSuccess") 
</template>

<style scoped></style>
