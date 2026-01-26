<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import NavBar from './components/NavBar.vue'
import MainContent from './components/MainContent.vue'
import VersionDisplay from './components/VersionDisplay.vue'
import {
  GAMEMODE_CHUNITHM,
  DEFAULT_FORMAT_OPTIONS,
  DEFAULT_FORMAT,
  DEFAULT_LAYOUT,
  getPlaceholderForFormat
} from './utils/constants'
import { updateFormatLabels } from './utils/gameMode'
import { saveSettings, loadSettings } from './utils/settings'
import { processCorrection } from './utils/correction'

const gamemode = ref(GAMEMODE_CHUNITHM)
const selectedFormat = ref(DEFAULT_FORMAT)
const selectedLayout = ref(DEFAULT_LAYOUT)
const inputText = ref('')
const outputText = ref('')
const outputTypes = ref<string[]>([])
const isLoading = ref(false)

const formatOptions = ref([...DEFAULT_FORMAT_OPTIONS])

const placeholderText = computed(() => {
  return getPlaceholderForFormat(selectedFormat.value)
})


const switchGamemode = (newGamemode: number) => {
  gamemode.value = newGamemode
  updateLabels()
  saveCookie()
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
    gamemode.value = settings.gamemode
    if (settings.format) {
      selectedFormat.value = settings.format
    }
    selectedLayout.value = settings.layout
    updateLabels()
  }
}


const processCorrectionHandler = async () => {

  if (!inputText.value.trim()) {
    outputText.value = ''
    outputTypes.value = []
    return
  }

  isLoading.value = true

  try {
    const result = await processCorrection(
      inputText.value,
      gamemode.value,
      selectedFormat.value
    )

    if (result.success) {
      outputText.value = result.correctedText
      outputTypes.value = result.types || []
    } else {
      outputText.value = result.errorMessage || 'エラーが発生しました'
      outputTypes.value = []
    }
  } catch (error) {
    console.error('Unexpected error during correction:', error)
    outputText.value = '予期しないエラーが発生しました'
    outputTypes.value = []
  } finally {
    isLoading.value = false
  }
}


// フォーマットとレイアウトの変更を監視してCookieに保存
watch([selectedFormat, selectedLayout], () => {
  saveCookie()
})

onMounted(() => {
  loadCookie()
  updateLabels()
})
</script>

<template>
  <div
    class="min-h-screen transition-all duration-300"
    :class="{
      'bg-gradient-to-r from-amber-50 to-yellow-100': gamemode === 0,
      'bg-gradient-to-r from-cyan-50 to-pink-100': gamemode === 1,
    }"
  >
    <!-- Header -->
    <NavBar />

    <!-- Main Content -->
    <MainContent
      class="pt-[50px]"
      :gamemode="gamemode"
      :formatOptions="formatOptions"
      :selectedFormat="selectedFormat"
      :selectedLayout="selectedLayout"
      :inputText="inputText"
      :outputText="outputText"
      :outputTypes="outputTypes"
      :isLoading="isLoading"
      :placeholderText="placeholderText"
      @update:gamemode="switchGamemode"
      @update:selectedFormat="selectedFormat = $event"
      @update:selectedLayout="selectedLayout = $event"
      @update:inputText="inputText = $event"
      @processCorrection="processCorrectionHandler"
    />

    <!-- Version Display -->
    <VersionDisplay />
  </div>
</template>

<style scoped>
/* Empty - all styles have been moved to components */
</style>
