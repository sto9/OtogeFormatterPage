<template>
  <!-- Layout Selection -->
  <div class="mb-6">
    <h3 class="text-xl font-bold mb-4 text-gray-800">レイアウト</h3>
    <div class="grid grid-cols-2 gap-4">
      <label
        class="flex items-center p-3 rounded-lg cursor-pointer transition-all duration-300 hover:bg-gray-50 hover:scale-[1.02]"
        :class="{ 'bg-blue-50 shadow-lg shadow-blue-500/20': selectedLayout === 'tate' }"
        for="layout-tate"
      >
        <div class="relative mr-4">
          <input
            class="sr-only"
            type="radio"
            name="layout-choice"
            id="layout-tate"
            value="tate"
            :checked="selectedLayout === 'tate'"
            @change="() => { selectedLayout = 'tate'; $emit('update:selectedLayout', 'tate'); }"
          />
          <div
            class="w-5 h-5 rounded-full border-2 transition-all duration-200 flex items-center justify-center"
            :class="
              selectedLayout === 'tate' ? 'border-blue-500 bg-blue-500' : 'border-gray-300 bg-white'
            "
          >
            <div v-if="selectedLayout === 'tate'" class="w-2 h-2 rounded-full bg-white"></div>
          </div>
        </div>
        <div class="select-none">
          <span
            class="font-bold text-lg block transition-colors duration-200"
            :class="selectedLayout === 'tate' ? 'text-blue-700' : 'text-gray-800'"
            >上下</span
          >
          <span class="text-sm text-gray-500">スマホ推奨</span>
        </div>
      </label>
      <label
        class="flex items-center p-3 rounded-lg cursor-pointer transition-all duration-300 hover:bg-gray-50 hover:scale-[1.02]"
        :class="{ 'bg-blue-50 shadow-lg shadow-blue-500/20': selectedLayout === 'yoko' }"
        for="layout-yoko"
      >
        <div class="relative mr-4">
          <input
            class="sr-only"
            type="radio"
            name="layout-choice"
            id="layout-yoko"
            value="yoko"
            :checked="selectedLayout === 'yoko'"
            @change="() => { selectedLayout = 'yoko'; $emit('update:selectedLayout', 'yoko'); }"
          />
          <div
            class="w-5 h-5 rounded-full border-2 transition-all duration-200 flex items-center justify-center"
            :class="
              selectedLayout === 'yoko' ? 'border-blue-500 bg-blue-500' : 'border-gray-300 bg-white'
            "
          >
            <div v-if="selectedLayout === 'yoko'" class="w-2 h-2 rounded-full bg-white"></div>
          </div>
        </div>
        <div class="select-none">
          <span
            class="font-bold text-lg block transition-colors duration-200"
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
