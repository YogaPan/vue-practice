<script setup lang="ts">
const emit = defineEmits(['submit'])
</script>

<template lang="pug">
div(class="bg-slate-100 flex flex-col justify-center min-h-screen items-center")
  form(@submit="e => emit('submit', e)")
    div(class="relative flex flex-col items-center gap-4 w-96 rounded-xl p-4 bg-slate-200")
      <slot></slot>
</template>

<style scoped></style>
