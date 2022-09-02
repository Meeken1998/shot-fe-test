<template>
  <div v-if="url" class="pdf-viewer">
    <iframe :src="iframeUrl" allowfullscreen width="100%" height="100%"></iframe>
  </div>
</template>
<script lang="ts" setup>
import { defineProps, computed } from 'vue'

const iframeUrlPrefix = 'https://pdf-viewer.aside.fun/index.html'

const props = defineProps({
  url: {
    type: String,
    required: true
  }
})

const iframeUrl = computed(() => `${iframeUrlPrefix}?file=${props.url}`)
</script>
<style lang="scss" scoped>
.pdf-viewer {
  width: 100%;
  height: calc(100vh - $headerBarHeight);
}
</style>