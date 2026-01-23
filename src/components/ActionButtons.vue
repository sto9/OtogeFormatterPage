<template>
  <!-- Action Buttons -->
  <div class="flex flex-col sm:flex-row gap-4 mt-6 mb-4">
    <button
      class="px-10 py-5 font-bold text-xl rounded-2xl transition-all duration-300 border-0 cursor-pointer bg-gradient-to-r from-emerald-600 to-emerald-500 text-white hover:from-emerald-700 hover:to-emerald-600 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/40 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none disabled:opacity-50 w-full sm:w-auto"
      @click="$emit('processCorrection')"
      :disabled="isLoading"
    >
      <span v-if="isLoading" class="flex items-center justify-center gap-2">
        <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
            fill="none"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        処理中...
      </span>
      <span v-else>表示</span>
    </button>
    <button
      class="px-10 py-5 font-bold text-xl rounded-2xl transition-all duration-300 border-0 cursor-pointer bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-700 hover:to-red-600 hover:scale-105 hover:shadow-2xl hover:shadow-red-500/40 w-full sm:w-auto"
      @click="$emit('deleteResult')"
    >
      削除
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  isLoading: boolean
}>()

defineEmits<{
  processCorrection: []
  deleteResult: []
}>()
</script>

<style scoped>
/* Minimal scoped styles - most styling now handled by Tailwind */
</style>
