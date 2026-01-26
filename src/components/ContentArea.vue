<template>
  <div
    class="min-h-[calc(100vh-120px)] pb-4 transition-all duration-300"
    :class="{
      'bg-gradient-to-r from-amber-50 to-yellow-100': gamemode === GAMEMODE_CHUNITHM,
      'bg-gradient-to-r from-cyan-50 to-pink-100': gamemode === GAMEMODE_SDVX,
    }"
  >
    <div class="w-full px-8 py-4">
      <div class="max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <!-- Format Selection -->
        <FormatSelection
          :formatOptions="formatOptions"
          :selectedFormat="selectedFormat"
          @update:selectedFormat="handleFormatChange"
        />

        <!-- Layout Selection -->
        <LayoutSelection
          :selectedLayout="selectedLayout"
          @update:selectedLayout="handleLayoutChange" />

        <!-- Text Area Display -->
        <VerticalTextAreaDisplay
          v-if="selectedLayout === 'tate'"
          :inputText="inputText"
          :outputText="outputText"
          :outputTypes="outputTypes"
          :placeholderText="placeholderText"
          @update:inputText="$emit('update:inputText', $event)"
        />
        <HorizontalTextAreaDisplay
          v-else
          :inputText="inputText"
          :outputText="outputText"
          :outputTypes="outputTypes"
          :placeholderText="placeholderText"
          @update:inputText="$emit('update:inputText', $event)"
        />

        <!-- Action Buttons -->
        <ActionButtons
          :isLoading="isLoading"
          @processCorrection="$emit('processCorrection')"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const GAMEMODE_CHUNITHM = 0
const GAMEMODE_SDVX = 1
import FormatSelection from './FormatSelection.vue'
import LayoutSelection from './LayoutSelection.vue'
import VerticalTextAreaDisplay from './VerticalTextAreaDisplay.vue'
import HorizontalTextAreaDisplay from './HorizontalTextAreaDisplay.vue'
import ActionButtons from './ActionButtons.vue'

defineProps<{
  gamemode: number
  formatOptions: Array<{ id: string; value: string; label: string }>
  selectedFormat: string
  selectedLayout: string
  inputText: string
  outputText: string
  outputTypes?: string[]
  isLoading: boolean
  placeholderText: string
}>()

const emit = defineEmits<{
  'update:selectedFormat': [value: string]
  'update:selectedLayout': [value: string]
  'update:inputText': [value: string]
  processCorrection: []
}>()

const handleFormatChange = (format: string) => {
  emit('update:selectedFormat', format)
}

const handleLayoutChange = (layout: string) => {
  emit('update:selectedLayout', layout)
}
</script>

<style scoped>
/* Minimal scoped styles - most styling now handled by Tailwind */
</style>
