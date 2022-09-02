<template>
  <div v-if="url" class="pdf-viewer">
    <iframe :src="iframeUrl" allowfullscreen width="100%" height="100%" ref="iframe"></iframe>
  </div>
</template>
<script lang="ts" setup>
import { defineProps, computed, onMounted, ref } from 'vue'
import { toJpeg } from 'html-to-image'

const iframeOrigin = location.origin

const props = defineProps({
  url: {
    type: String,
    required: true
  }
})

const loaded = ref(false)

const iframeUrl = computed(() => `${iframeOrigin}/pdf-viewer/viewer.html?file=${props.url}`)
const iframe = ref<HTMLIFrameElement>()

function handlePdfLoad(loaded: number, total: number) {
  console.log(loaded / total)
}

function handleLoaded() {
  loaded.value = true
  void getThumbImages()
}

onMounted(() => {
  window.addEventListener('message', e => {
    if (e.origin === iframeOrigin) {
      console.log(e.data)
      const { data, type } = e.data
      switch (type) {
        case 'load':
          handlePdfLoad(data.loaded, data.total)
          break
        case 'ui':
          if (!loaded.value) {
            handleLoaded()
          }
          break
        default:
      }
    }
  })
})

async function getThumbImages() {
  // const $pdfview: any = iframe.value?.contentWindow
  const pages = iframe.value?.contentDocument?.querySelectorAll('img.')
  if (pages) {
    const els = [...pages.values() as unknown as HTMLElement[]]
    for (const el of els) {
      const jpg = await toJpeg(el)
      console.log(jpg)
    }
  }
}


</script>
<style lang="scss" scoped>
.pdf-viewer {
  width: 100%;
  overflow-x: hidden;
  height: calc(100vh - $headerBarHeight - 1px);
  overflow-y: hidden;
}
</style>