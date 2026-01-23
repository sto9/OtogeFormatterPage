<template>
  <!-- Horizontal Layout with Overlaid Stripes -->
  <div class="space-y-4">
    <!-- Header Row -->
    <div class="grid grid-cols-[2fr_auto_2fr] gap-4 mb-2">
      <div class="text-lg font-bold text-gray-800 text-center">修正前</div>
      <div class="w-16"></div>
      <div class="text-lg font-bold text-gray-800 text-center">修正後</div>
    </div>

    <!-- Main Layout -->
    <div class="grid grid-cols-[2fr_auto_2fr] gap-4 border-2 border-gray-200 rounded-xl bg-white shadow-lg overflow-hidden">
      <!-- Input Section -->
      <div class="relative bg-gray-50">
        <!-- Input Textarea -->
        <textarea
          id="input-multi-yoko"
          class="w-full min-h-[200px] px-4 py-3 border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-lg resize-none bg-transparent relative z-10"
          style="line-height: 1.6; /* 28.8px for 18px font */"
          :value="inputText"
          @input="(event) => { handleInput(); $emit('update:inputText', (event.target as HTMLTextAreaElement).value); }"
          @compositionstart="handleCompositionStart"
          @compositionend="handleCompositionEnd"
        ></textarea>

        <!-- Placeholder -->
        <div
          v-if="showPlaceholder"
          class="absolute top-4 left-5 text-gray-400 text-lg leading-relaxed pointer-events-none bg-transparent z-20 whitespace-pre-line font-mono"
          v-html="placeholderText"
        ></div>

        <!-- Alternating Row Overlay -->
        <div class="absolute inset-0 pointer-events-none z-5">
          <div
            v-for="(line, index) in inputLines"
            :key="`stripe-${index}`"
            class="w-full transition-colors duration-200"
            :class="index % 2 === 1 ? 'bg-green-100 bg-opacity-30' : 'bg-transparent'"
            :style="{
              height: `${lineHeight}px`,
              top: `${getLineTop(index)}px`
            }"
          ></div>
        </div>
      </div>

      <!-- Arrow Section -->
      <div class="w-16 bg-gradient-to-r from-blue-50 to-indigo-50 border-x-2 border-gray-200 relative">
        <!-- Arrow Content -->
        <div class="absolute inset-0 flex flex-col">
          <div
            v-for="(line, index) in Math.max(inputLines.length, outputLines.length, 1)"
            :key="`arrow-${index}`"
            class="flex items-center justify-center text-sm transition-colors duration-200"
            :class="index % 2 === 1 ? 'bg-green-200 bg-opacity-40' : 'bg-transparent'"
            :style="{
              height: `${lineHeight}px`,
              top: `${getLineTop(index)}px`
            }"
            v-html="getArrowForLine(index)"
          ></div>
        </div>
      </div>

      <!-- Output Section -->
      <div class="relative bg-emerald-50">
        <!-- Output Textarea -->
        <textarea
          id="output-multi-yoko"
          class="w-full min-h-[200px] px-4 py-3 border-0 bg-transparent font-mono text-lg resize-none focus:outline-none relative z-10"
          style="line-height: 1.6; /* 28.8px for 18px font */"
          :value="outputText"
          readonly
        ></textarea>

        <!-- Alternating Row Overlay -->
        <div class="absolute inset-0 pointer-events-none z-5">
          <div
            v-for="(line, index) in outputLines"
            :key="`output-stripe-${index}`"
            class="w-full transition-colors duration-200"
            :class="index % 2 === 1 ? 'bg-green-200 bg-opacity-30' : 'bg-transparent'"
            :style="{
              height: `${lineHeight}px`,
              top: `${getLineTop(index)}px`
            }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  inputText: string
  outputText: string
  arrowsContent: string
  placeholderText: string
}>()

defineEmits<{
  'update:inputText': [value: string]
}>()

const isComposing = ref(false)

const showPlaceholder = computed(() => props.inputText === '' && !isComposing.value)

const inputLines = computed(() => {
  return props.inputText ? props.inputText.split('\n') : ['']
})

const outputLines = computed(() => {
  return props.outputText ? props.outputText.split('\n') : []
})

// Line height calculation (based on font-size and line-height)
const lineHeight = computed(() => {
  // text-lg (18px) with line-height 1.6 = 18 * 1.6 = 28.8px ≈ 29px
  return 29
})

const getLineTop = (index: number) => {
  // Fine-tune the starting position to match text baseline
  // Experimentally determined offset for perfect alignment
  return 8 + index * lineHeight.value
}

const getArrowForLine = (index: number) => {
  if (!props.arrowsContent) return '►'

  const arrowLines = props.arrowsContent.split('<br>')
  const arrowLine = arrowLines[index] || '►'
  return arrowLine || '►'
}

const handleInput = () => {
  // Input handling logic if needed
}

const handleCompositionStart = () => {
  isComposing.value = true
}

const handleCompositionEnd = () => {
  isComposing.value = false
}
</script>

<style scoped>
/* Minimal scoped styles - most styling now handled by Tailwind */
</style>