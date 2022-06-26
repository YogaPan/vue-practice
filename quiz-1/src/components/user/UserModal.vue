<script setup lang="ts">
import { computed } from 'vue'
import type { User } from '../../types/user'
import Button from '../button/Button.vue'

const props = defineProps<{
  open: boolean
  loading: boolean
  user: User
}>()
const emit = defineEmits(['close', 'favorite'])
const buttonText = computed(() => (props.user.favorite ? 'Remove' : 'Favorite'))
</script>

<template lang="pug">
div(v-if="open" class="w-full h-full fixed top-0 left-0 flex flex-col items-center justify-center z-10 opacity-50 bg-black")
div(v-if="open" class="w-full h-full fixed top-0 left-0 flex flex-col items-center justify-center z-10" @click="emit('close')")
  div(class="w-[300px] h-[300px] bg-slate-400 rounded-lg p-6")
    span(@click="emit('close')" class="cursor-pointer") x
    img(:src="user.picture.large" class="self-center w-[128px] h-[128px]")
    p(class="text-lg") {{ user.email }}
    p(class="text-lg") {{ user.name.first }}
    p(class="text-lg") {{ user.name.last }}
    Button(@click="e => $emit('favorite', e)" primary :text="buttonText" :loading="loading")
</template>

<style scoped></style>
