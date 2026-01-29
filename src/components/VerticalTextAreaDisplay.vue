<template>
  <!-- Vertical Layout -->
  <div class="space-y-4">
    <div>
      <label for="input-multi-tate" class="block text-2xl font-extrabold text-gray-900 mb-2 whitespace-nowrap"
        >修正前</label
      >
      <div class="relative">
        <textarea
          id="input-multi-tate"
          class="block w-full px-3 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-lg leading-relaxed resize-none bg-gray-50 hover:border-gray-300 overflow-x-auto"
          wrap="off"
          :style="{ height: dynamicHeight }"
          :value="inputText"
          @input="(event) => { $emit('update:inputText', (event.target as HTMLTextAreaElement).value); }"
          @compositionstart="handleCompositionStart"
          @compositionend="handleCompositionEnd"
        ></textarea>
        <div
          v-if="showPlaceholder"
          class="absolute top-2 left-3 text-gray-400 text-lg leading-relaxed pointer-events-none bg-transparent z-10 whitespace-pre font-mono"
          v-html="placeholderText"
        ></div>
      </div>
    </div>
    <div>
      <div class="flex items-end gap-2 mb-2">
        <label for="output-multi-tate" class="text-2xl font-extrabold text-gray-900 whitespace-nowrap"
          >修正後</label
        >
        <button
          v-if="outputText"
          @click="copyToClipboard"
          class="px-2 pt-0 pb-0.5 text-sm font-semibold rounded bg-emerald-200 hover:bg-emerald-300 text-emerald-900 transition-colors min-w-16 text-center"
        >
          {{ copyButtonText }}
        </button>
      </div>
      <div
        class="block w-full px-3 py-2 border-2 border-emerald-200 rounded-xl bg-emerald-50 font-mono text-lg leading-relaxed overflow-x-auto"
        :style="{ minHeight: dynamicHeight }"
      >
        <div
          v-for="(line, index) in outputLines"
          :key="index"
          :class="[getLineClass(line.type), 'whitespace-pre']"
        >
          {{ line.text }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface OutputLine {
  text: string
  type: 'normal' | 'bold' | 'red'
}

const props = defineProps<{
  inputText: string
  outputText: string
  outputTypes?: string[] // テキストタイプの配列
  placeholderText: string
}>()

defineEmits<{
  'update:inputText': [value: string]
}>()

const isComposing = ref(false)
const copyButtonText = ref('Copy')

const showPlaceholder = computed(() => props.inputText === '' && !isComposing.value)

const copyToClipboard = async () => {
  if (!props.outputText) return
  try {
    await navigator.clipboard.writeText(props.outputText)
    copyButtonText.value = 'Copied!'
    setTimeout(() => {
      copyButtonText.value = 'Copy'
    }, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

// 行数を計算する関数
const calculateLines = (text: string): number => {
  if (!text) return 2 // 最低行数
  const lines = text.split('\n').length
  return Math.max(2, lines) // 最低2行
}

// 動的な高さを計算（入力テキストまたは出力テキストの多い方に合わせる）
const dynamicHeight = computed(() => {
  const inputLines = calculateLines(props.inputText || props.placeholderText)
  const outputLineCount = calculateLines(props.outputText)
  const maxLines = Math.max(inputLines, outputLineCount)
  return `${maxLines * 2.5 + 2}rem` // 行の高さ + パディング
})

// 出力行とタイプを組み合わせる
const outputLines = computed(() => {
  const lines = props.outputText ? props.outputText.split('\n') : []
  const types = props.outputTypes || []

  return lines.map((text, index): OutputLine => ({
    text,
    type: (types[index] as 'normal' | 'bold' | 'red') || 'normal'
  }))
})

// ラインのCSSクラスを取得
const getLineClass = (type: string) => {
  switch (type) {
    case 'bold':
      return 'font-bold text-gray-900'
    case 'red':
      return 'font-bold text-red-600'
    default:
      return 'text-gray-700'
  }
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