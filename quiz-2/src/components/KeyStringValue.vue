<template lang="pug">
div(class="flex flex-row gap-2")
  span(class="") {{ `${keyValue.key}:` }}
  p(class="text-blue-600") {{ keyValue.value }}
</template>

<script setup lang="ts">
import type { KeyStringValue } from '../types/index'

defineProps<{ keyValue: KeyStringValue }>()
</script>

<style scoped></style>
