<template>
  <div class="border-b border-gray-200 m-0 p-0 bg-white">
    <div class="flex">
      <button
        class="px-8 py-4 font-semibold text-xl border-0 bg-transparent cursor-pointer transition-all duration-300 border-b-4 border-transparent relative hover:bg-gray-50"
        :class="{
          'bg-amber-100 text-amber-800 border-b-amber-400': modelValue === GAMEMODE_CHUNITHM,
          'text-gray-500': modelValue !== GAMEMODE_CHUNITHM,
        }"
        @click="$emit('update:modelValue', GAMEMODE_CHUNITHM)"
      >
        CHUNITHM
      </button>
      <button
        class="px-8 py-4 font-semibold text-xl border-0 bg-transparent cursor-pointer transition-all duration-300 border-b-4 border-transparent relative hover:bg-gray-50"
        :class="{
          'bg-cyan-100 text-cyan-800 border-b-cyan-500': modelValue === GAMEMODE_SDVX,
          'text-gray-500': modelValue !== GAMEMODE_SDVX,
        }"
        @click="$emit('update:modelValue', GAMEMODE_SDVX)"
      >
        SDVX
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const GAMEMODE_CHUNITHM = 0
const GAMEMODE_SDVX = 1

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
