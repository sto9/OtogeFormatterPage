<template>
  <div class="min-h-[calc(100vh-50px)] pb-4">
    <div class="w-full px-4 md:px-8 lg:px-12 xl:px-16 py-4">
      <div class="max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-4 md:p-6">
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

        <!-- maimai STD/DX Display Mode -->
        <div v-if="gamemode === GAMEMODE_MAIMAI" class="mb-6">
          <h3 class="text-2xl font-extrabold mb-4 text-gray-900">STD/DX 表示</h3>
          <div class="grid grid-cols-2 gap-4">
            <label
              class="flex items-center p-2 rounded-xl cursor-pointer transition-colors duration-100 border-2"
              :class="maimaiChartTypeMode === 'both-only' ? 'bg-blue-100 border-blue-300' : 'border-gray-200 hover:bg-gray-100'"
              for="chart-type-both-only"
            >
              <input
                class="sr-only"
                type="radio"
                name="chart-type-mode"
                id="chart-type-both-only"
                value="both-only"
                :checked="maimaiChartTypeMode === 'both-only'"
                @change="() => { $emit('update:maimaiChartTypeMode', 'both-only'); }"
              />
              <div class="select-none">
                <span
                  class="font-bold text-lg block transition-colors duration-100"
                  :class="maimaiChartTypeMode === 'both-only' ? 'text-blue-700' : 'text-gray-800'"
                >両方あるときだけ</span>
                <span class="text-sm text-gray-500">STD/DX両方ある曲のみ表示</span>
              </div>
            </label>
            <label
              class="flex items-center p-2 rounded-xl cursor-pointer transition-colors duration-100 border-2"
              :class="maimaiChartTypeMode === 'always' ? 'bg-blue-100 border-blue-300' : 'border-gray-200 hover:bg-gray-100'"
              for="chart-type-always"
            >
              <input
                class="sr-only"
                type="radio"
                name="chart-type-mode"
                id="chart-type-always"
                value="always"
                :checked="maimaiChartTypeMode === 'always'"
                @change="() => { $emit('update:maimaiChartTypeMode', 'always'); }"
              />
              <div class="select-none">
                <span
                  class="font-bold text-lg block transition-colors duration-100"
                  :class="maimaiChartTypeMode === 'always' ? 'text-blue-700' : 'text-gray-800'"
                >常に表示</span>
                <span class="text-sm text-gray-500">全曲にSTD/DXを表示</span>
              </div>
            </label>
          </div>
        </div>

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
import { GAMEMODE_MAIMAI } from '../services/similaritySearch'
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
  maimaiChartTypeMode: string
  inputText: string
  outputText: string
  outputTypes?: string[]
  isLoading: boolean
  placeholderText: string
}>()

const emit = defineEmits<{
  'update:selectedFormat': [value: string]
  'update:selectedLayout': [value: string]
  'update:maimaiChartTypeMode': [value: string]
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
