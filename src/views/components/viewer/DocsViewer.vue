<template>
  <div class="page">
    <MobileVisitTips />
    <EditorHeaderV2 />
    <PDFViewer v-if="docs" :url="docs?.url"></PDFViewer>
  </div>
</template>
<script lang="ts" setup>
import { getDocs } from '@/apis/docs'
import { getShareLink, ShareLink } from '@/apis/shareLink'
import EditorHeaderV2 from '@/views/Editor/EditorHeader/EditorHeaderV2.vue'
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useDocsStore } from '@/store'
import { storeToRefs } from 'pinia'
import { getTeamDetail } from '@/apis/team'
import PDFViewer from './pdf/PDFViewer.vue'
import { setTitle } from '@/utils/title'
import router from '@/views/router'
import MobileVisitTips from '../widget/MobileVisitTips.vue'

const docsStore = useDocsStore()
const { docs } = storeToRefs(docsStore)

const route = useRoute()
const docsId = route.params.docsId as string
const shareLinkId = route.params.shareLink as string

async function getData() {
  let link: ShareLink | undefined = undefined
  if (shareLinkId) {
    link = await getShareLink(shareLinkId)
    if (!link?._id) {
      localStorage.setItem('shareLinkId', shareLinkId)
      router.replace({ name: 'login' })
      return
    }
    docsStore.setShareLink(link)
  }
  const docs = await getDocs(link?.typeId || docsId)
  docsStore.setDocs(docs)
  const team = await getTeamDetail(docs.teamId)
  docsStore.team = team
  setTitle(`${docs.name} - ${team.name}`)
}

onMounted(() => {
  void getData()
})
</script>
<style lang="scss" scoped>
.page {
  width: 100vw;
  height: 100vh;
  overflow: auto;
}
</style>