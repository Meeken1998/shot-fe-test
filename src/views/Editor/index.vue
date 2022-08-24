<template>
  <div v-if="loaded" class="pptist-editor">
    <EditorHeader class="layout-header" />
    <div class="layout-content">
      <Thumbnails class="layout-content-left" />
      <div class="layout-content-center">
        <CanvasTool class="center-top" />
        <Canvas class="center-body" :style="{ height: `calc(100% - ${remarkHeight + 40}px)` }" />
        <Remark class="center-bottom" v-model:height="remarkHeight" :style="{ height: `${remarkHeight}px` }" />
      </div>
      <Toolbar class="layout-content-right" />
    </div>
  </div>

  <Modal :visible="!!dialogForExport" :footer="null" centered :closable="false" :width="680" destroyOnClose
    @cancel="closeExportDialog()">
    <ExportDialog />
  </Modal>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore, useSlidesStore } from '@/store'
import useGlobalHotkey from '@/hooks/useGlobalHotkey'
import usePasteEvent from '@/hooks/usePasteEvent'

import EditorHeader from './EditorHeader/index.vue'
import Canvas from './Canvas/index.vue'
import CanvasTool from './CanvasTool/index.vue'
import Thumbnails from './Thumbnails/index.vue'
import Toolbar from './Toolbar/index.vue'
import Remark from './Remark/index.vue'
import ExportDialog from './ExportDialog/index.vue'
import { useRoute } from 'vue-router'
import { getDocs } from '@/apis/docs'
import { WS_SERVICE_ENDPOINT } from '@/hooks/useRequest'

const mainStore = useMainStore()
const slidesStore = useSlidesStore()
const { dialogForExport, handleElementId } = storeToRefs(mainStore)
const { docsId } = storeToRefs(slidesStore)

const loaded = ref(false)
const route = useRoute()

const closeExportDialog = () => mainStore.setDialogForExport('')

const remarkHeight = ref(40)

useGlobalHotkey()
usePasteEvent()

async function handleGetSlides(docsId: string) {
  const docs = await getDocs(docsId)
  slidesStore.setSlides(JSON.parse(docs.json))
  loaded.value = true
}

onMounted(() => {
  const id = route.params.id as string
  docsId.value = id
  void handleGetSlides(id)
  document.title = WS_SERVICE_ENDPOINT
  slidesStore.connectWebsocket()
})

onUnmounted(() => {
  slidesStore.closeWebsocket()
})

watch(() => handleElementId.value, (val, last) => {
  if (last && !val) {
    nextTick(() => {
      slidesStore._sync(docsId.value, slidesStore.slides.slice())
      // slidesStore._snapshoot()
    })
  }
})
</script>

<style lang="scss" scoped>
.pptist-editor {
  height: 100%;
}

.layout-header {
  height: 40px;
}

.layout-content {
  height: calc(100% - 40px);
  display: flex;
}

.layout-content-left {
  width: 160px;
  height: 100%;
  flex-shrink: 0;
}

.layout-content-center {
  width: calc(100% - 160px - 260px);

  .center-top {
    height: 40px;
  }
}

.layout-content-right {
  width: 260px;
  height: 100%;
}
</style>
