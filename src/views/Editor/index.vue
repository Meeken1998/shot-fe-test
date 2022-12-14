<template>
  <div v-if="loaded" class="pptist-editor">
    <EditorHeader class="layout-header" />
    <div class="layout-content">
      <Thumbnails class="layout-content-left" />
      <div v-if="mode === SlidesDisplayMode.PPT" class="layout-content-center">
        <Canvas class="center-body" :style="{ height: `100%` }" />
      </div>
      <Toolbar v-if="mode === SlidesDisplayMode.PPT" class="layout-content-right"></Toolbar>
      <ShotEditor v-if="mode === SlidesDisplayMode.STORYBOARD" />
    </div>
  </div>

  <Modal
    :visible="!!dialogForExport"
    :footer="null"
    centered
    :closable="false"
    :width="680"
    destroyOnClose
    @cancel="closeExportDialog()"
  >
    <ExportDialog />
  </Modal>

  <MobileVisitTips />
</template>

<script lang="ts" setup>
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useDocsStore, useMainStore, useSlidesStore } from '@/store'
import useGlobalHotkey from '@/hooks/useGlobalHotkey'
import usePasteEvent from '@/hooks/usePasteEvent'

import EditorHeader from './EditorHeader/EditorHeaderV2.vue'
import Canvas from './Canvas/index.vue'
import Thumbnails from './Thumbnails/index.vue'
import Toolbar from './Toolbar/index.vue'
import ExportDialog from './ExportDialog/index.vue'
import { useRoute } from 'vue-router'
import { getDocs } from '@/apis/docs'
import { getTeamDetail } from '@/apis/team'
import { setTitle } from '@/utils/title'
import { DEFAULT_SLIDES, SlidesDisplayMode } from '@/types/slides'
import MobileVisitTips from '../components/widget/MobileVisitTips.vue'
import ShotEditor from '../../views/components/shot/ShotEditor.vue'

const mainStore = useMainStore()
const slidesStore = useSlidesStore()
const docsStore = useDocsStore()
const { dialogForExport, handleElementId } = storeToRefs(mainStore)
const { docsId, mode } = storeToRefs(slidesStore)

const loaded = ref(false)
const route = useRoute()

const closeExportDialog = () => mainStore.setDialogForExport('')

useGlobalHotkey()
usePasteEvent()

async function handleGetData(docsId: string) {
  const docs = await getDocs(docsId)
  slidesStore.setSlides(docs.json ? JSON.parse(docs.json) : DEFAULT_SLIDES)
  docsStore.setDocs(docs)
  loaded.value = true
  const team = await getTeamDetail(docs.teamId)
  docsStore.setTeam(team)
  setTitle(`${docs.name} - ${team.name}`)
  handleSyncPreviewImage()
}

function handleSyncPreviewImage() {
  nextTick(() => {
    void slidesStore.syncPreviewImage(docsId.value)
  })
}

onMounted(() => {
  const id = route.params.id as string
  docsId.value = id
  void handleGetData(id)
  slidesStore.connectWebsocket()
})

onUnmounted(() => {
  slidesStore.closeWebsocket()
})

watch(
  () => handleElementId.value,
  (val, last) => {
    if (last && !val) {
      nextTick(() => {
        slidesStore._sync(docsId.value, slidesStore.slides.slice())
      })
    }
  }
)
</script>

<style lang="scss" scoped>
.pptist-editor {
  height: 100%;
}

.layout-content {
  height: calc(100% - 40px);
  display: flex;
}

.layout-content-left {
  width: 240px;
  height: calc(100vh - 45px);
  flex-shrink: 0;
}

.layout-content-center {
  flex: 1;

  .center-top {
    height: 40px;
  }
}

.layout-content-right {
  height: 100%;
  flex-shrink: 0;
}
</style>
