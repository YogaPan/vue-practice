<script setup lang="ts">
import { ref, unref } from 'vue'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'vue-router'
import AuthBlockVue from './layout/AuthBlock.vue'
import InputVue from './input/Input.vue'
import Button from './button/Button.vue'
import { FirebaseError } from '@firebase/util'

const router = useRouter()

const email = ref('')
const password = ref('')
const errorMessage = ref('')

const login = async () => {
  const auth = getAuth()

  try {
    await signInWithEmailAndPassword(auth, unref(email), unref(password))
    router.push('/')
  } catch (error) {
    if (error instanceof Error) {
      console.error(error)
      errorMessage.value = 'Invalid username or password'
      if (error instanceof FirebaseError) {
        const errorCode = error.code
        console.error(errorCode)
      }
    }
  }
}

const gotoRegisterPage = () => router.push('/register')
</script>

<template lang="pug">
AuthBlockVue
  h1(class="color text-lg") Login
  InputVue(v-model="email" placeholder="email")
  InputVue(v-model="password" placeholder="password")
  p(class="text-red-500") {{ errorMessage }}
  div(class="flex flex-row gap-2 items-center justify-center")
    Button(@click="gotoRegisterPage" text="Register" )
    Button(@click="login" primary text="Login")
</template>

<style scoped></style>
