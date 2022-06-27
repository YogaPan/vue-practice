<script setup lang="ts">
defineProps<{
  modelValue: string
  type?: string
  placeholder?: string
  error?: boolean
}>()
const emit = defineEmits(['update:modelValue'])

const handleInputChange = (event: Event) => {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}
</script>

<template lang="pug">
input(
  class="w-full border-1 rounded-lg border p-2 text-lg text-black"
  :class="{ 'border-red-600 border-2': error }"
  :value="modelValue"
  @input="handleInputChange"
  :placeholder="placeholder"
  :type="type")
</template>

<style></style>
