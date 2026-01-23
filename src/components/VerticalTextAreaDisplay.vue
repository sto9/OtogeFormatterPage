<template>
  <!-- Vertical Layout -->
  <div class="space-y-4">
    <div>
      <label for="input-multi-tate" class="block text-lg font-bold text-gray-800 mb-2"
        >修正前</label
      >
      <div class="relative">
        <textarea
          id="input-multi-tate"
          class="block w-full min-h-[100px] px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-lg leading-relaxed resize-none bg-gray-50 transition-all duration-200 hover:border-gray-300"
          :value="inputText"
          @input="(event) => { handleInput(); $emit('update:inputText', (event.target as HTMLTextAreaElement).value); }"
          @compositionstart="handleCompositionStart"
          @compositionend="handleCompositionEnd"
        ></textarea>
        <div
          v-if="showPlaceholder"
          class="absolute top-4 left-5 text-gray-400 text-lg leading-relaxed pointer-events-none bg-transparent z-10 whitespace-pre-line font-mono"
          v-html="placeholderText"
        ></div>
      </div>
    </div>
    <div>
      <label for="output-multi-tate" class="block text-lg font-bold text-gray-800 mb-2"
        >修正後</label
      >
      <textarea
        id="output-multi-tate"
        class="block w-full min-h-[100px] px-4 py-3 border-2 border-emerald-200 rounded-xl shadow-sm bg-emerald-50 font-mono text-lg leading-relaxed resize-none"
        rows="4"
        :value="outputText"
        readonly
      ></textarea>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  inputText: string
  outputText: string
  placeholderText: string
}>()

defineEmits<{
  'update:inputText': [value: string]
}>()

const isComposing = ref(false)

const showPlaceholder = computed(() => props.inputText === '' && !isComposing.value)

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