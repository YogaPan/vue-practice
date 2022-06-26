<template lang="pug">
div( class="flex flex-col gap-2")
  div(class="flex flex-row gap-2")
    span(class="") {{ `${keyValue.key}:` }}
    button(@click="handleToggle" class="") {{ `[${open ? '-' : '+'}]` }}
  div(v-if="open" class="pl-4")
    template(v-for="innerKeyValue in keyValue.value")
      //- vue 不支援在 template 中進行 Typescript 轉型，此 VSCode 提示的型別 Error 可以忽略。
      KeyStringValueBlock(v-if="typeof(innerKeyValue.value) === 'string'" :key-value="innerKeyValue")
      KeyObjectValueBlock(v-else :key-value="innerKeyValue")
</template>

<script setup lang="ts">
import { ref } from 'vue'
import KeyStringValueBlock from './KeyStringValueBlock.vue'
import type { KeyValue } from '../types/index'

defineProps<{ keyValue: KeyValue }>()

const open = ref(true)
const handleToggle = () => (open.value = !open.value)
</script>

<style scoped></style>
