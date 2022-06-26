<template lang="pug">
div( class="flex flex-col gap-2")
  div(class="flex flex-row gap-2")
    span(class="") {{ `${keyValue.key}:` }}
    button(@click="handleToggle" class="") {{ `[${open ? '-' : '+'}]` }}
  div(v-if="open" class="pl-4")
    template(v-for="value in keyValue.value")
        KeyStringValue(v-if="typeof(value.value) === 'string'" :key-value="value")
        KeyObjectValue(v-else :key-value="value")
</template>

<script setup lang="ts">
import { ref } from 'vue'
import KeyStringValue from './KeyStringValue.vue'
import type { KeyValue } from '../types/index'

defineProps<{ keyValue: KeyValue }>()

const open = ref(true)

const handleToggle = () => {
  open.value = !open.value
}
</script>

<style scoped></style>
