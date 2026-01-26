<template>
  <div class="text-right pr-4 pb-4 text-gray-500 text-sm">
    ver. {{ version }}
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