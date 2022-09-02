<template>
  <div  class="page">
    <EditorHeaderV2 />
    <PDFViewer v-if="docs" :url="docs?.url"></PDFViewer>
  </div>
</template>
<script lang="ts" setup>
import { getDocs } from '@/apis/docs'
import EditorHeaderV2 from '@/views/Editor/EditorHeader/EditorHeaderV2.vue'
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useDocsStore } from '@/store'
import { storeToRefs } from 'pinia'
import { getTeamDetail } from '@/apis/team'
import PDFViewer from './pdf/PDFViewer.vue'
import { setTitle } from '@/utils/title'

const docsStore = useDocsStore()
const { docs } = storeToRefs(docsStore)

const route = useRoute()
const docsId = route.params.docsId as string

async function getData() {
  const docs = await getDocs(docsId)
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