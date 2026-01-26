<template>
  <div>
    <!-- Game Mode Tabs -->
    <GameModeTabs :modelValue="gamemode" @update:modelValue="$emit('update:gamemode', $event)" />

    <!-- Content Area -->
    <ContentArea
      :gamemode="gamemode"
      :formatOptions="formatOptions"
      :selectedFormat="selectedFormat"
      :selectedLayout="selectedLayout"
      :inputText="inputText"
      :outputText="outputText"
      :outputTypes="outputTypes"
      :isLoading="isLoading"
      :placeholderText="placeholderText"
      @update:selectedFormat="$emit('update:selectedFormat', $event)"
      @update:selectedLayout="$emit('update:selectedLayout', $event)"
      @update:inputText="$emit('update:inputText', $event)"
      @processCorrection="$emit('processCorrection')"
    />
  </div>
</template>

<script setup lang="ts">
import GameModeTabs from './GameModeTabs.vue'
import ContentArea from './ContentArea.vue'

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

defineEmits<{
  'update:gamemode': [value: number]
  'update:selectedFormat': [value: string]
  'update:selectedLayout': [value: string]
  'update:inputText': [value: string]
  processCorrection: []
}>()
</script>

<style scoped>
/* Minimal scoped styles - most styling now handled by Tailwind */
</style>
