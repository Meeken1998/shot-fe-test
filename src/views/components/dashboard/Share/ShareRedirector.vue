<template>
  <div class="login-page">
    跳转中，请稍后...
  </div>
</template>
<script lang="ts" setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getShareLink } from '@/apis/shareLink'
import { getDocs } from '@/apis/docs'
import { useDocsStore } from '@/store'
const docsStore = useDocsStore()

const route = useRoute()
const router = useRouter()
const linkId = route.params.shareLink as string

async function getData() {
  const link = await getShareLink(linkId)
  docsStore.setShareLink(link)
  const docsId = link.typeId
  const docs = await getDocs(docsId)
  let path = ''
  if (docs.type === 'pdf') {
    path = `/viewer/${docsId}`
  }
  if (docs.type === 'ppt') {
    path = `/editor/${docsId}`
  }
  if (link.configs?.autoplay) {
    path += '?autoplay=1'
  }
  router.replace(path)
}

onMounted(() => {
  void getData()
})
</script>
<style lang="scss" scoped>
.login-page {
  width: 100vw;
  height: 100vh;
  display: grid;
  place-items: center;
}
</style>