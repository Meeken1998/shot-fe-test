<template>
  <div v-if="url" class="pdf-viewer">
    <iframe :src="iframeUrl" allowfullscreen width="100%" height="100%" ref="iframe"></iframe>
  </div>
</template>
<script lang="ts" setup>
import { defineProps, computed, onMounted, ref } from 'vue'

const iframeUrlOrigin = 'https://pdf-viewer.aside.fun'

const props = defineProps({
  url: {
    type: String,
    required: true
  }
})

const iframeUrl = computed(() => `${iframeUrlOrigin}/index.html?file=${props.url}`)
const iframe = ref<HTMLIFrameElement>()

onMounted(() => {
  window.addEventListener('message', e => {
    if (e.origin === iframeUrlOrigin) {
      console.log(e.data)
    }
  })
})
</script>
<style lang="scss" scoped>
.pdf-viewer {
  width: 100%;
  overflow-x: hidden;
  height: calc(100vh - $headerBarHeight);
}
</style>