<template>
  <div></div>
</template>
<script lang="ts" setup>
import { onMounted } from 'vue'
import { createDocs } from '@/apis/docs'
import router from '../router'
import { useRoute } from 'vue-router'

const route = useRoute()

async function handleCreateDocs(teamId: string) {
  const docs = await createDocs(teamId)
  router.push({
    path: `/editor/${docs._id}`
  })
}

onMounted(() => {
  const teamId = route.query?.teamId as string
  if (teamId) {
    void handleCreateDocs(teamId)
  }

})
</script>
<style lang="scss" scoped>
</style>