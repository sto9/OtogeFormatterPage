<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import NavBar from './components/NavBar.vue'
import MainContent from './components/MainContent.vue'
import {
  GAMEMODE_CHUNITHM,
  DEFAULT_FORMAT_OPTIONS,
  DEFAULT_FORMAT,
  DEFAULT_LAYOUT,
  DEFAULT_PLACEHOLDER_TEXT
} from './utils/constants'
import { updateFormatLabels } from './utils/gameMode'
import { saveSettings, loadSettings } from './utils/settings'
import { generateArrowsHtml, getEmptyResultsHtml } from './utils/uiUtils'
import { processCorrection } from './utils/correction'

const gamemode = ref(GAMEMODE_CHUNITHM)
const selectedFormat = ref(DEFAULT_FORMAT)
const selectedLayout = ref(DEFAULT_LAYOUT)
const inputText = ref('')
const outputText = ref('')
const isLoading = ref(false)
const arrowsContent = ref('')

const formatOptions = ref([...DEFAULT_FORMAT_OPTIONS])

const placeholderText = computed(() => {
  return DEFAULT_PLACEHOLDER_TEXT
})


const switchGamemode = (newGamemode: number) => {
  gamemode.value = newGamemode
  updateLabels()
}

const updateLabels = () => {
  updateFormatLabels(formatOptions.value, gamemode.value)
}

const saveCookie = () => {
  saveSettings(gamemode.value, selectedFormat.value, selectedLayout.value)
}

const loadCookie = () => {
  const settings = loadSettings()
  if (settings) {
    switchGamemode(settings.gamemode)
    selectedLayout.value = settings.layoutId
  }
}

const setArrowHtml = (sentences: string[], results: string[]) => {
  arrowsContent.value = generateArrowsHtml(sentences, results)
}

const processCorrectionHandler = async () => {
  saveCookie()

  if (!inputText.value.trim()) {
    outputText.value = ''
    arrowsContent.value = getEmptyResultsHtml()
    return
  }

  isLoading.value = true
  outputText.value = '<Loading...>'

  try {
    const result = await processCorrection(
      inputText.value,
      gamemode.value,
      selectedFormat.value
    )

    if (result.success) {
      outputText.value = result.correctedText
      const originalLines = result.originalText.split('\n')
      const correctedLines = result.correctedText.split('\n')
      setArrowHtml(originalLines, correctedLines)
    } else {
      outputText.value = result.errorMessage || 'エラーが発生しました'
      arrowsContent.value = getEmptyResultsHtml()
    }
  } catch (error) {
    console.error('Unexpected error during correction:', error)
    outputText.value = '予期しないエラーが発生しました'
    arrowsContent.value = getEmptyResultsHtml()
  } finally {
    isLoading.value = false
  }
}

const deleteResult = () => {
  outputText.value = ''
  arrowsContent.value = getEmptyResultsHtml()
}

onMounted(() => {
  updateLabels()
  loadCookie()
})
</script>

<template>
  <div>
    <!-- Header -->
    <NavBar />

    <!-- Main Content -->
    <MainContent
      class="pt-[50px]"
      :gamemode="gamemode"
      :formatOptions="formatOptions"
      :inputText="inputText"
      :outputText="outputText"
      :isLoading="isLoading"
      :arrowsContent="arrowsContent"
      :placeholderText="placeholderText"
      @update:gamemode="switchGamemode"
      @update:selectedFormat="selectedFormat = $event"
      @update:selectedLayout="selectedLayout = $event"
      @update:inputText="inputText = $event"
      @processCorrection="processCorrectionHandler"
      @deleteResult="deleteResult"
    />
  </div>
</template>

<style scoped>
/* Empty - all styles have been moved to components */
</style>
