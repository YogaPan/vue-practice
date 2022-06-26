<script setup lang="ts">
const props = defineProps<{
  primary?: boolean
  loading?: boolean
  text: string
}>()
const emit = defineEmits(['click'])

const handleClick = (e: Event) => {
  if (props.loading) return
  emit('click', e)
}
</script>

<template lang="pug">
button(
  @click="handleClick"
  class="text-purple-800 py-2 px-4 rounded"
  :class="{ 'text-white bg-purple-500': primary }")
    span(v-if="loading") loading
    span(v-else) {{ text }}
</template>

<style></style>
