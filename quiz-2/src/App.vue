<script setup lang="ts">
import { computed, ref } from 'vue'
import KeyStringValueBlock from './components/KeyStringValueBlock.vue'
import KeyObjectValueBlock from './components/KeyObjectValueBlock.vue'
import type { PathValue, KeyValue, KeyStringValue } from './types'

const idCounter = ref(0)
const genId = () => {
  const id = idCounter.value
  idCounter.value++
  return id
}

const inputRows = ref<PathValue[]>([
  { id: genId(), path: 'nav.header.creator', value: '3D Fabric Creator' },
  { id: genId(), path: 'nav.icon', value: 'Icon name' },
  { id: genId(), path: 'nav.header.product', value: 'Product' },
  { id: genId(), path: 'common.feature.experience', value: 'Try It Now!' },
  { id: genId(), path: 'common.feature.chooseFabric', value: 'Choose Fabric' },
  {
    id: genId(),
    path: 'common.feature.chooseFabric',
    value: 'Choose Fabric V2',
  },
])

const handleAdd = () => {
  inputRows.value.push({ id: genId(), path: '', value: '' })
}

const handleRemove = (id: number) => {
  inputRows.value = inputRows.value.filter(
    (keyValuePair) => keyValuePair.id !== id
  )
}

const result = computed(() => {
  return inputRows.value
    .filter((row) => row.path !== '')
    .reduce<KeyValue[]>((result, row) => {
      const path = row.path
      const keys = path.split('.')

      let current: KeyValue[] = result
      keys.forEach((key, index) => {
        if (index !== keys.length - 1) {
          const target = current.find((p) => p.key === key)
          if (!target) {
            const next: KeyValue[] = []
            current.push({ key, value: next })
            current = next
            return
          }
          const next = target.value as KeyValue[]
          current = next
          return
        }

        if (key === '') return
        const target = current.find((p) => p.key === key)
        if (target) {
          target.value = row.value
          return
        }
        current.push({ key, value: row.value })
      })

      return result
    }, [])
})
</script>

<template lang="pug">
div(class="flex flex-col justify-between gap-2 h-screen p-2 bg-slate-100")
  h1(class="text-2xl") Nested Key-Value Pair Tree Viewer
  div(class="flex flex-row items-stretch justify-between gap-2 h-screen  bg-slate-100")
    div(class="flex-1 flex flex-col items-center gap-4 rounded border-2  border-gray-800 p-4")
      div(class="flex flex-row items-center justify-between w-full")
        h1(class="text-lg") Key-Value Editor
        button(class="w-12 rounded p-2 text-lg bg-slate-600 text-slate-50" @click="handleAdd") +
      div(class="flex flex-col gap-2 w-full")
        div(v-for="keyValue in inputRows" :key="keyValue.id" class="flex flex-row gap-2")
          input(class="flex-1 rounded border-2 border-gray-800 p-2" v-model="keyValue.path")
          input(class="flex-1 rounded border-2 border-gray-800 p-2" v-model="keyValue.value")
          button(class="w-12 rounded bg-slate-600 text-slate-50 text-lg" @click="() => handleRemove(keyValue.id)") -
    div(class="flex-1 flex flex-col gap-2 rounded border-gray-800 border-2 p-4") 
      template(v-for="keyValue in result")
        //- vue 不支援在 template 中進行 Typescript 轉型，此 VSCode 提示的型別 Error 可以忽略。
        KeyStringValueBlock(v-if="typeof(keyValue.value) === 'string'" :key-value="keyValue")
        KeyObjectValueBlock(v-else :key-value="keyValue")
</template>

<style scoped>
@import './assets/base.css';
</style>
