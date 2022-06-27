<script setup lang="ts">
import { getAuth, signOut } from 'firebase/auth'
import { useRouter } from 'vue-router'
import Button from '../button/Button.vue'

const router = useRouter()
const auth = getAuth()
const currentUser = auth.currentUser
const username = currentUser?.displayName

const logout = async () => {
  const auth = getAuth()
  try {
    await signOut(auth)
    router.push('/login')
  } catch (error) {
    console.error(error)
  }
}
</script>

<template lang="pug">
div(class="flex flex-row justify-between items-center gap-4 py-4 px-6 bg-slate-300")
  h1(class="text-xl font-bold ") Hi, {{ username }}!
  Button(class="" primary @click="logout" text="Logout")
</template>

<style scoped></style>
