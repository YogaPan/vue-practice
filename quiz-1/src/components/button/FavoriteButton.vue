<template lang="pug">
img(v-if="favorite" alt="unfavorite icon" src="../../assets/favorite-fill.svg" :width="size" :height="size")
img(v-else alt="favorite icon" src="../../assets/favorite.svg" :width="size" :height="size")
</template>

<script setup lang="ts">
defineProps<{ favorite?: boolean; size: number }>()
</script>

<style scoped></style>
