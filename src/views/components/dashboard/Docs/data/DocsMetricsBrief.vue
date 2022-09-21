<template>
  <div class="table-item">
    <div class="title">平均阅读时长</div>
    <div class="table reading-time"></div>
  </div>
  <div class="table-item">
    <div class="title">完读率</div>
    <div class="table reading-percent"></div>
  </div>
</template>
<script lang="ts" setup>
import { getDocsAnalysisBrief } from '@/apis/docs'
import { useDocsStore } from '@/store'
import { onMounted, watch } from 'vue'
import Chartist from 'chartist'
import 'chartist/dist/scss/chartist.scss'
import { getDateDiffV2, msToSecond } from '@/utils/time'

const docsStore = useDocsStore()

async function getData() {
  const docsId = docsStore.docs?._id
  if (!docsId) return
  const res = await getDocsAnalysisBrief(docsId)
  const readingTimeTable = document.querySelector('.reading-time')
  new Chartist.Bar(readingTimeTable, {
    labels: Object.keys(res.pageReadingMsMetrics).map(s => `${s} 页`),
    series: [Object.values(res.pageReadingMsMetrics).map((v) => msToSecond(v as number))] // 
  }, {
    stackBars: true,
    axisY: {
      labelInterpolationFnc: (value: number) => {
        return getDateDiffV2(value * 1000)
      }
    }
  }).on('draw', (ctx: any) => {
    if (ctx.type === 'bar') {
      ctx.element.attr({
        style: 'stroke: #5d9b8f;width: 40px;stroke-width: 20px;'
      })
    }
  })

  const readingPercentTable = document.querySelector('.reading-percent')
  new Chartist.Bar(readingPercentTable, {
    labels: Object.keys(res.pagePercentMetrics).map(s => `${s} 页`),
    series: [Object.values(res.pagePercentMetrics)] // 
  }, {
    stackBars: true,
    axisY: {
      labelInterpolationFnc: (value: number) => {
        return `${value}%`
      }
    }
  }).on('draw', (ctx: any) => {
    if (ctx.type === 'bar') {
      ctx.element.attr({
        style: 'stroke: #5d9b8f;width: 40px;stroke-width: 20px;'
      })
    }
  })
}

onMounted(() => {
  void getData()
})

watch(() => docsStore.docs, val => {
  if (val) {
    void getData()
  }
})

</script>
<style lang="scss" scoped>
.table-item {
  .title {
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 12px;
  }

  .table {
    width: 100%;
    height: 300px;
  }
}
</style>