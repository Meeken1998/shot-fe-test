<template>
  <div class="upload-wrapper" @click="handleUpload()">
    <input type="file" :accept="accept" :id="id" />
    <slot></slot>
  </div>
</template>
<script lang="ts" setup>
import { onMounted } from 'vue'

const props = defineProps({
  teamId: {
    type: String,
    required: true
  },
  accept: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  }
})

const emit = defineEmits<{
  (event: 'file', file: File): void
}>()

onMounted(() => {
  const input = document.getElementById(props.id) as HTMLInputElement
  input.addEventListener('change', (e) => {
    const [file] = (e.target as any).files as File[]
    if (file) emit('file', file)
    input.removeAttribute('files')
  })
})

function handleUpload() {
  const input = document.getElementById(props.id) as HTMLInputElement
  input.click()
}
</script>
<style lang="scss" scoped>
.upload-wrapper input {
  position: fixed;
  top: -100px;
  left: -100px;
}
</style>