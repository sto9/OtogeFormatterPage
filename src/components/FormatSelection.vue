<template>
  <!-- Format Selection -->
  <div class="mb-6">
    <h3 class="text-2xl font-extrabold mb-4 text-gray-900">フォーマット</h3>
    <div class="grid gap-3">
      <label
        v-for="option in formatOptions"
        :key="option.id"
        class="flex items-center p-4 rounded-xl cursor-pointer transition-colors duration-100 border-2"
        :class="selectedFormat === option.value ? 'bg-blue-100 border-blue-300' : 'border-gray-200 hover:bg-gray-100'"
        :for="option.id"
      >
        <input
          class="sr-only"
          type="radio"
          name="format-example-choice"
          :id="option.id"
          :value="option.value"
          :checked="selectedFormat === option.value"
          @change="handleChange(option.value)"
        />
        <span
          class="font-mono text-base transition-colors duration-100 select-none"
          :class="selectedFormat === option.value ? 'text-blue-700 font-semibold' : 'text-gray-700'"
        >
          {{ option.label }}
        </span>
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  formatOptions: Array<{ id: string; value: string; label: string }>
  selectedFormat?: string
}>()

const emit = defineEmits<{
  'update:selectedFormat': [value: string]
}>()

const selectedFormat = ref(props.selectedFormat || '\\{Title}')

// Watch for prop changes
watch(
  () => props.selectedFormat,
  (newValue) => {
    if (newValue !== undefined) {
      selectedFormat.value = newValue
    }
  },
)


// Update the change handler
const handleChange = (value: string) => {
  selectedFormat.value = value
  emit('update:selectedFormat', value)
}
</script>

<style scoped>
/* Minimal scoped styles - most styling now handled by Tailwind */
</style>
