<template>
  <div
    class="fixed top-0 left-0 w-screen h-[50px] z-50 bg-gradient-to-br from-emerald-600 via-emerald-500 to-emerald-400 shadow-lg"
  >
    <div class="flex items-center justify-between h-full px-8">
      <div class="text-white text-3xl font-black" style="font-family: Verdana, Geneva, sans-serif">
        Otoge Formatter
      </div>
      <div class="flex items-center">
        <span class="text-white/90 text-sm mr-4">ver. {{ version }}</span>
        <a
          href="https://github.com/sto9/chunicorrection"
          class="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm transition-all duration-300 text-white no-underline hover:bg-white/20 font-semibold"
        >
          使い方
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getVersionInfo } from '@/utils/version'
import { ref, onMounted } from 'vue'

const version = ref('-')

onMounted(async () => {
  const versionInfo = await getVersionInfo()
  version.value = versionInfo.version
})
</script>

<style scoped></style>
