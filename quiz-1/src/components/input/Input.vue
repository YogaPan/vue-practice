<script setup lang="ts">
defineProps<{
  modelValue: string
  type?: string
  placeholder?: string
}>()
const emit = defineEmits(['update:modelValue'])

const handleInputChange = (event: Event) => {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}
</script>

<template lang="pug">
input(
  class="w-full text-black border-1 rounded-lg border text-lg p-2"
  :value="modelValue"
  @input="handleInputChange"
  :placeholder="placeholder"
  :type="type")
</template>

<style></style>
