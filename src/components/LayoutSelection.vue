<template>
  <!-- Layout Selection -->
  <div class="mb-6">
    <h3 class="text-2xl font-extrabold mb-4 text-gray-900">レイアウト</h3>
    <div class="grid grid-cols-2 gap-4">
      <label
        class="flex items-center p-3 rounded-xl cursor-pointer transition-colors duration-100 border-2"
        :class="selectedLayout === 'tate' ? 'bg-blue-100 border-blue-300' : 'border-gray-200 hover:bg-gray-100'"
        for="layout-tate"
      >
        <input
          class="sr-only"
          type="radio"
          name="layout-choice"
          id="layout-tate"
          value="tate"
          :checked="selectedLayout === 'tate'"
          @change="() => { selectedLayout = 'tate'; $emit('update:selectedLayout', 'tate'); }"
        />
        <div class="select-none">
          <span
            class="font-bold text-lg block transition-colors duration-100"
            :class="selectedLayout === 'tate' ? 'text-blue-700' : 'text-gray-800'"
            >上下</span
          >
          <span class="text-sm text-gray-500">スマホ推奨</span>
        </div>
      </label>
      <label
        class="flex items-center p-3 rounded-xl cursor-pointer transition-colors duration-100 border-2"
        :class="selectedLayout === 'yoko' ? 'bg-blue-100 border-blue-300' : 'border-gray-200 hover:bg-gray-100'"
        for="layout-yoko"
      >
        <input
          class="sr-only"
          type="radio"
          name="layout-choice"
          id="layout-yoko"
          value="yoko"
          :checked="selectedLayout === 'yoko'"
          @change="() => { selectedLayout = 'yoko'; $emit('update:selectedLayout', 'yoko'); }"
        />
        <div class="select-none">
          <span
            class="font-bold text-lg block transition-colors duration-100"
            :class="selectedLayout === 'yoko' ? 'text-blue-700' : 'text-gray-800'"
            >左右</span
          >
          <span class="text-sm text-gray-500">PC推奨、修正有無を表示</span>
        </div>
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineEmits<{
  'update:selectedLayout': [value: string]
}>()

const selectedLayout = ref('tate')
</script>

<style scoped>
/* Minimal scoped styles - most styling now handled by Tailwind */
</style>
