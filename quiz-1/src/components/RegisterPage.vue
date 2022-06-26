<script setup lang="ts">
import { ref, unref } from 'vue'
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth'
import { useRouter } from 'vue-router'
import InputVue from './input/Input.vue'
import Button from './button/Button.vue'
import AuthBlockVue from './layout/AuthBlock.vue'
import { FirebaseError } from 'firebase/app'

const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')
const errorMessage = ref('')

const register = async () => {
  const auth = getAuth()

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      unref(email),
      unref(password)
    )
    await updateProfile(userCredential.user, { displayName: unref(name) })
    router.push('/login')
  } catch (error) {
    if (error instanceof Error) {
      console.error(error)
      errorMessage.value = error.message
      if (error instanceof FirebaseError) {
        const errorCode = error.code
        console.error(errorCode)
      }
    }
  }
}

const gotoLoginPage = () => router.push('/login')
</script>

<template lang="pug">
AuthBlockVue
  h1(class="color text-lg") Register
  InputVue(v-model="name" placeholder="name")
  InputVue(v-model="email" placeholder="email")
  InputVue(v-model="password" placeholder="password")
  p(class="text-red-500") {{ errorMessage }}
  div(class="flex flex-row gap-2 items-center justify-center")
    Button(@click="gotoLoginPage" text="Login")
    Button(@click="register" primary text="Register")
</template>

<style scoped></style>
