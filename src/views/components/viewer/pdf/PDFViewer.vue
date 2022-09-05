<template>
  <div v-if="url" class="pdf-viewer">
    <div v-if="progressPercent !== 100" class="progress">
      <Progress :percent="progressPercent" :showInfo="false" strokeColor="#469d8f" />
      <div>正在加载文档</div>
    </div>
    <iframe :src="iframeUrl" allowfullscreen width="100%" height="100%" ref="iframe"></iframe>
  </div>
</template>
<script lang="ts" setup>
import { useDocsStore } from '@/store'
import { storeToRefs } from 'pinia'
import { defineProps, computed, onMounted, ref, watch } from 'vue'
const docsStore = useDocsStore()
const { pdfController } = storeToRefs(docsStore)

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
const progressPercent = ref(0)

function handlePdfProgress(loaded: number, total: number) {
  progressPercent.value = loaded / total * 100
}

function handleLoaded() {
  loaded.value = true
}

function getScaleInfo() {
  const scaleSelect = iframe.value?.contentDocument?.querySelector('#scaleSelect') as HTMLSelectElement
  if (!scaleSelect) return
  let value = scaleSelect.value
  const options = Array.from(scaleSelect.querySelectorAll('option'))
  if (value === 'custom') {
    value = `${Number((options.find(o => o.value === 'custom')?.innerText || '').replace('%', '')) / 100}`
  }
  docsStore.updatePdfController({
    scaleMode: value,
    scaleModeList: options.map(o => o.value)
  })
}

watch(() => pdfController.value?.changedMode, (val) => {
  (iframe.value?.contentWindow as any).$pdfview.pdfViewer._setScale(val)
  getScaleInfo()
})

onMounted(() => {
  window.addEventListener('message', e => {
    if (e.origin === iframeOrigin) {
      const { data, type } = e.data
      switch (type) {
        case 'load':
          handlePdfProgress(data.loaded, data.total)
          break
        case 'ui':
          if (!loaded.value) {
            handleLoaded()
          }
          getScaleInfo()
          break
        default:
      }
    }
  })
})


</script>
<style lang="scss" scoped>
.pdf-viewer {
  width: 100%;
  overflow-x: hidden;
  height: calc(100vh - $headerBarHeight - 1px);
  overflow-y: hidden;
}

.progress {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1;
  text-align: center;
  font-size: 16px;
  padding-bottom: 10%;
  color: #666;

  & > div {
    margin-top: 24px;
  }

  * {
    max-width: 400px;
  }
}
</style>