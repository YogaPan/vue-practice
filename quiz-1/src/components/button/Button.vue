<script setup lang="ts">
import Loading from './Loading.vue'

const props = defineProps<{
  primary?: boolean
  loading?: boolean
  type?: 'submit' | 'button' | 'reset'
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
  class="flex flex-row items-center justify-center w-[100px] h-[40px] rounded py-2 px-4 text-purple-800"
  :class="{ 'text-white bg-purple-500 font-bold': primary }"
  :type="type")
    Loading(v-if="loading")
    span(v-else) {{ text }}
</template>

<style></style>
