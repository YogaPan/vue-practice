<script setup lang="ts">
import UserListItem from './UserListItem.vue'
import type { User } from '../../types/user'

defineProps<{ users: User[] }>()
const emit = defineEmits(['favoriteSuccess'])

const handleFavoriteSuccess = (user: User) => emit('favoriteSuccess', user)
</script>

<template lang="pug">
div(class="p-4 bg-white flex flex-col items-center justify-start gap-4")
  UserListItem(
    v-for="user in users"
    :key="user.email"
    :user="user"
    @favorite-success="handleFavoriteSuccess") 
</template>

<style scoped></style>
