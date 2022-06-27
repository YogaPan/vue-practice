<script setup lang="ts">
import { ref, unref } from 'vue'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'vue-router'
import { FirebaseError } from '@firebase/util'
import AuthForm from './layout/AuthForm.vue'
import Input from './input/Input.vue'
import Button from './button/Button.vue'
import { emailRegex } from '../utils/regex'

const router = useRouter()

const email = ref('')
const password = ref('')
const emailError = ref(false)
const passwordError = ref(false)
const errorMessage = ref('')
const loading = ref(false)

const login = async (e: Event) => {
  e.preventDefault()

  emailError.value = false
  passwordError.value = false
  errorMessage.value = ''

  if (email.value === '') {
    emailError.value = true
    errorMessage.value = '請輸入 email'
    return
  }
  if (!emailRegex.test(email.value)) {
    emailError.value = true
    errorMessage.value = '不合法的 email 格式'
    return
  }
  if (password.value === '') {
    passwordError.value = true
    errorMessage.value = '請輸入密碼'
    return
  }

  const auth = getAuth()
  loading.value = true

  try {
    await signInWithEmailAndPassword(auth, unref(email), unref(password))
    router.push('/')
  } catch (error) {
    if (error instanceof Error) {
      console.error(error)
      emailError.value = true
      passwordError.value = true
      errorMessage.value = error.message
      if (error instanceof FirebaseError) {
        const errorCode = error.code
        console.error(errorCode)
      }
    }
  } finally {
    loading.value = false
  }
}

const gotoRegisterPage = () => router.push('/register')
</script>

<template lang="pug">
AuthForm(@submit="login")
  h1(class="text-2xl font-bold") Login
  Input(v-model="email" placeholder="email" :error="emailError")
  Input(v-model="password" placeholder="password" type="password" :error="passwordError")
  p(v-if="!!errorMessage" class="text-red-500 font-bold") {{ errorMessage }}
  div(class="flex flex-row gap-2 items-center justify-center")
    Button(@click="gotoRegisterPage" type="button" text="Register")
    Button(primary type="submit" text="Login" :loading="loading")
</template>

<style scoped></style>
