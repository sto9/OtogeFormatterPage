<template>
  <!-- Format Selection -->
  <div class="mb-6">
    <h3 class="text-xl font-bold mb-4 text-gray-800">フォーマット</h3>
    <div class="grid gap-3">
      <label
        v-for="option in formatOptions"
        :key="option.id"
        class="flex items-center p-4 rounded-xl cursor-pointer transition-all duration-300 hover:bg-gray-50 hover:scale-[1.02]"
        :class="{ 'bg-blue-50 shadow-lg shadow-blue-500/20': selectedFormat === option.value }"
        :for="option.id"
      >
        <div class="relative mr-4">
          <input
            class="sr-only"
            type="radio"
            name="format-example-choice"
            :id="option.id"
            :value="option.value"
            :checked="selectedFormat === option.value"
            @change="handleChange(option.value)"
          />
          <div
            class="w-5 h-5 rounded-full border-2 transition-all duration-200 flex items-center justify-center"
            :class="
              selectedFormat === option.value
                ? 'border-blue-500 bg-blue-500'
                : 'border-gray-300 bg-white'
            "
          >
            <div v-if="selectedFormat === option.value" class="w-2 h-2 rounded-full bg-white"></div>
          </div>
        </div>
        <span
          class="font-mono text-base transition-colors duration-200 select-none"
          :class="selectedFormat === option.value ? 'text-blue-700 font-semibold' : 'text-gray-700'"
        >
          {{ option.label }}
        </span>
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'

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

// Emit initial value on mount
onMounted(() => {
  emit('update:selectedFormat', selectedFormat.value)
})

// Update the change handler
const handleChange = (value: string) => {
  selectedFormat.value = value
  emit('update:selectedFormat', value)
}
</script>

<style scoped>
/* Minimal scoped styles - most styling now handled by Tailwind */
</style>
