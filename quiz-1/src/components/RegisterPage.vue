<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { emailRegex } from '../utils/regex'
import api from '../initFirebase'
import InputVue from './input/Input.vue'
import Button from './button/Button.vue'
import AuthForm from './layout/AuthForm.vue'
import { FirebaseError } from 'firebase/app'

const router = useRouter()

const email = ref('')
const name = ref('')
const password = ref('')
const nameError = ref(false)
const emailError = ref(false)
const passwordError = ref(false)
const errorMessage = ref('')
const loading = ref(false)

const register = async (e: Event) => {
  e.preventDefault()

  emailError.value = false
  nameError.value = false
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
  if (name.value === '') {
    nameError.value = true
    errorMessage.value = '請輸入姓名'
    return
  }
  if (password.value === '') {
    passwordError.value = true
    errorMessage.value = '請輸入密碼'
    return
  }

  loading.value = true

  try {
    await api.register(email.value, password.value, name.value)
    router.push('/login')
  } catch (error) {
    if (error instanceof Error) {
      console.error(error)
      emailError.value = true
      nameError.value = true
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

const gotoLoginPage = () => router.push('/login')
</script>

<template lang="pug">
AuthForm(@submit="register")
  h1(class="text-2xl font-bold") Register
  InputVue(v-model="email" placeholder="email" :error="emailError")
  InputVue(v-model="name" placeholder="name" :error="nameError")
  InputVue(v-model="password" placeholder="password" type="password" :error="passwordError")
  p(v-if="!!errorMessage" class="text-red-500 font-bold") {{ errorMessage }}
  div(class="flex flex-row gap-2 items-center justify-center")
    Button(@click="gotoLoginPage" type="button" text="Login")
    Button(primary type="submit" text="Register" :loading="loading")
</template>

<style scoped></style>
