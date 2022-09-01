<template>
  <div class="page">
    <canvas id="pdf"></canvas>
  </div>
</template>
<script lang="ts" setup>
import * as pdfjs from 'pdfjs-dist'
import { onMounted } from 'vue'


async function getData() {
  const pdf = await pdfjs.getDocument({
    url: 'https://static.aside.fun/upload/resume.pdf'
  }).promise
  const page = await pdf.getPage(1)
  const viewport = page.getViewport(2)
  page.getTextContent().then(res => {
    console.log(res.items[0].transform)
  })

  // Prepare canvas using PDF page dimensions
  const canvas = document.getElementById('pdf') as HTMLCanvasElement
  const context = canvas.getContext('2d')!
  canvas.height = viewport.height
  canvas.width = viewport.width

  // Render PDF page into canvas context
  const renderTask = page.render({
    canvasContext: context,
    viewport: viewport
  })
  await renderTask.promise
}

onMounted(() => {
  getData()
})
</script>
<style lang="scss" scoped>
.page {
  width: 100vw;
  height: 100vh;
  overflow: auto;
}
</style>