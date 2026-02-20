<template>
  <div class="border-b border-gray-200 m-0 p-0 bg-white overflow-x-auto">
    <div class="flex min-w-max">
      <button
        class="px-8 py-4 font-semibold text-xl border-0 bg-transparent cursor-pointer transition-all duration-300 border-b-4 border-transparent relative hover:bg-gray-50 whitespace-nowrap"
        :class="{
          'bg-amber-100 text-amber-800 border-b-amber-400': modelValue === GAMEMODE_CHUNITHM,
          'text-gray-500': modelValue !== GAMEMODE_CHUNITHM,
        }"
        @click="$emit('update:modelValue', GAMEMODE_CHUNITHM)"
      >
        CHUNITHM
      </button>
      <button
        class="px-8 py-4 font-semibold text-xl border-0 bg-transparent cursor-pointer transition-all duration-300 border-b-4 border-transparent relative hover:bg-gray-50 whitespace-nowrap"
        :class="{
          'bg-cyan-100 text-cyan-800 border-b-cyan-500': modelValue === GAMEMODE_SDVX,
          'text-gray-500': modelValue !== GAMEMODE_SDVX,
        }"
        @click="$emit('update:modelValue', GAMEMODE_SDVX)"
      >
        SDVX
      </button>
      <button
        class="px-8 py-4 font-semibold text-xl border-0 bg-transparent cursor-pointer transition-all duration-300 border-b-4 border-transparent relative hover:bg-gray-50 whitespace-nowrap"
        :class="{
          'bg-pink-100 text-pink-800 border-b-pink-400': modelValue === GAMEMODE_MAIMAI,
          'text-gray-500': modelValue !== GAMEMODE_MAIMAI,
        }"
        @click="$emit('update:modelValue', GAMEMODE_MAIMAI)"
      >
        maimai
      </button>
      <button
        class="px-8 py-4 font-semibold text-xl border-0 bg-transparent cursor-pointer transition-all duration-300 border-b-4 border-transparent relative hover:bg-gray-50 whitespace-nowrap"
        :class="{
          'bg-lime-100 text-green-800 border-b-lime-500': modelValue === GAMEMODE_ONGEKI,
          'text-gray-500': modelValue !== GAMEMODE_ONGEKI,
        }"
        @click="$emit('update:modelValue', GAMEMODE_ONGEKI)"
      >
        オンゲキ
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const GAMEMODE_CHUNITHM = 0
const GAMEMODE_SDVX = 1
const GAMEMODE_MAIMAI = 2
const GAMEMODE_ONGEKI = 3

defineProps<{
  modelValue: number
}>()

defineEmits<{
  'update:modelValue': [value: number]
}>()
</script>

<style scoped>
/* All styles converted to Tailwind classes */
</style>
