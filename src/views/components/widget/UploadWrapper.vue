<template>
  <div @click="handleUpload()">
    <input type="file" accept=".ppt,.pptx" id="upload" />
    <slot></slot>
  </div>
</template>
<script lang="ts" setup>
import { onMounted } from 'vue'
import { uploadDocs } from '@/apis/docs'

const props = defineProps({
  teamId: {
    type: String,
    required: true
  }
})

onMounted(() => {
  const input = document.getElementById('upload') as HTMLInputElement
  input.addEventListener('change', async (e) => {
    const [file] = (e.target as any).files as File[]
    const docs = await uploadDocs(props.teamId, file)
    window.open(`/editor/${docs._id}`, '_blank')
  })
})

function handleUpload() {
  const input = document.getElementById('upload') as HTMLInputElement
  input.click()
}
</script>
<style lang="scss" scoped>
#upload {
  position: fixed;
  top: -100px;
  left: -100px;
}
</style>