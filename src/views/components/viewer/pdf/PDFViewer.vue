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
// eslint-disable @typescript-eslint/no-explicit-any
import { useDocsStore } from '@/store'
import { storeToRefs } from 'pinia'
import { defineProps, computed, onMounted, ref, watch, onUnmounted } from 'vue'
import { copyText } from '@/utils/clipboard'
import { message } from 'ant-design-vue'
import { KEYS } from '@/configs/hotkey'
import { useRoute } from 'vue-router'
import { reportDocsViewEvent, DocsUserViewEvent } from '@/apis/docs'
import { debounce } from 'lodash'

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

const iframeUrl = computed(() => `${iframeOrigin}/pdf-viewer/viewer.html?file=${props.url}${location.hash || ''}`)
const iframe = ref<HTMLIFrameElement>()
const progressPercent = ref(0)
const route = useRoute()

function registerHotKey(e: KeyboardEvent) {
  const key = e.key.toUpperCase()
  if (key === KEYS.F5) {
    docsStore.emitEvent({ type: 'screening' })
  }
}

function handlePdfProgress(loaded: number, total: number) {
  progressPercent.value = loaded / total * 100
}

function handleLoaded() {
  loaded.value = true
  docsStore.updatePdfController({
    loaded: true
  })
  // TODO: use a better method
  setTimeout(() => checkAutoplay(), 2000)
}

function checkAutoplay() {
  if (route?.query?.autoplay) {
    docsStore.emitEvent({
      type: 'screening'
    })
  }
}

function handleUiChanged() {
  getScaleInfo()
  getSearchBarStatus()
  getSidebarStatus()
  getScrollMode()
  getCurrentSlideIndex()
}

const reportDocsEvent = debounce(async (event: DocsUserViewEvent) => {
  await reportDocsViewEvent(docsStore.docs!._id, docsStore.currentSlideIndex, event)
})

function getCurrentSlideIndex() {
  const index = (iframe.value?.contentWindow as any).$pdfview.page as number
  // 埋点
  if (docsStore.currentSlideIndex !== index) {
    const isFirstOpened = docsStore.currentSlideIndex === 0
    docsStore.setCurrentSlideIndex(index)
    void reportDocsEvent(isFirstOpened ? DocsUserViewEvent.OPEN : DocsUserViewEvent.SWITCH_SLIDE)
  }
}


function getSearchBarStatus() {
  const opened = !!(iframe.value?.contentWindow as any).$pdfview.findBar.opened
  docsStore.updatePdfController({
    findBarOpened: opened
  })
}

function getSidebarStatus() {
  const opened = !!(iframe.value?.contentWindow as any).$pdfview.pdfSidebar.isOpen
  docsStore.updatePdfController({
    sidebarOpened: opened
  })
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

function getScrollMode() {
  const isSinglePageMode = (iframe.value?.contentWindow as any)?.$pdfview?.pdfViewer?.scrollMode === 3
  docsStore.updatePdfController({
    isSinglePageMode
  })
}

function copyLink() {
  const href = (iframe.value?.contentDocument?.querySelector('#viewBookmark') as HTMLLinkElement)?.href || ''
  const hash = href.split('#')?.[1] || ''
  copyText(`${location.origin}${location.pathname}#${hash}`)
  void message.success('已复制当前位置的链接')
}

watch(() => pdfController.value?.eventBus, (ev) => {
  if (ev?.type === 'scale') {
    (iframe.value?.contentWindow as any).$pdfview.pdfViewer._setScale(ev.data)
    getScaleInfo()
  }
  if (ev?.type === 'search') {
    (iframe.value?.contentWindow as any).$pdfview.findBar.toggleButton.click()
    getSearchBarStatus()
  }
  if (ev?.type === 'sidebar') {
    (iframe.value?.contentWindow as any).$pdfview.pdfSidebar.toggleButton.click()
    getSidebarStatus()
  }
  if (ev?.type === 'link') {
    copyLink()
  }
  if (ev?.type === 'prev') {
    (iframe.value?.contentWindow as any).$pdfview.pdfViewer.previousPage()
  }
  if (ev?.type === 'next') {
    (iframe.value?.contentWindow as any).$pdfview.pdfViewer.nextPage()
  }
  if (ev?.type === 'incScale') {
    (iframe.value?.contentWindow as any).$pdfview.pdfViewer.increaseScale()
  }
  if (ev?.type === 'decScale') {
    (iframe.value?.contentWindow as any).$pdfview.pdfViewer.decreaseScale()
  }
  if (ev?.type === 'screening') {
    (iframe.value?.contentDocument?.querySelector('#presentationMode') as HTMLButtonElement)?.click()
  }
  if (ev?.type === 'singleMode') {
    (iframe.value!.contentWindow as any).$pdfview.pdfViewer.scrollMode = docsStore.pdfController?.isSinglePageMode ? 0 : 3
    docsStore.emitEvent({
      type: 'scale',
      data: docsStore.pdfController?.isSinglePageMode ? 'auto' : 'page-fit'
    })
    getScrollMode()
  }
})

onMounted(() => {
  document.addEventListener('keydown', registerHotKey)
  console.log(docsStore.shareLink, 'link~')
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
          handleUiChanged()
          break
        default:
      }
    }
  })

  window.addEventListener('blur', () => void reportDocsEvent(DocsUserViewEvent.BLUR))
  window.addEventListener('focus', () => void reportDocsEvent(DocsUserViewEvent.FOCUS))
})

onUnmounted(() => {
  document.removeEventListener('keydown', registerHotKey)
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

  &>div {
    margin-top: 24px;
  }

  * {
    max-width: 400px;
  }
}
</style>