<script setup lang="ts">
import { getAuth, signOut } from 'firebase/auth'
import { useRouter } from 'vue-router'

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
div(class="flex flex-row justify-between py-4 px-6 bg-slate-300")
  p(class="text-lg") Hi, {{ username }}!
  button(class="text-lg text-purple-700 underline" @click="logout") logout
</template>

<style scoped></style>
