<template>
  <div v-if="!loaded">
    <Skeleton width="70%" height="20px"></Skeleton>
    <div style="margin-top: 12px">
      <Skeleton width="40%" height="16px"></Skeleton>
    </div>
    <div style="margin-top: 4px">
      <Skeleton width="40%" height="16px"></Skeleton>
    </div>
  </div>
  <div v-else class="docs-link-data-container">
    <div :class="{
      item: true,
      ['item_' + item.visitStartTimestamp]: true
    }" v-for="item in data" :key="item.visitStartTimestamp">
      <div class="info" @click="handleSwitchChartVisible('item_' + item.visitStartTimestamp)">
        <div class="flex-row" style="gap: 12px">
          <Avatar :size="32" :src="item.userInfo.photo!"></Avatar>
          <div class="info-bar">
            <div class="title">{{ getName(item.userInfo) }}</div>
            <div class="subtitle">{{ getDateDiff(item.visitStartTimestamp) }}</div>
          </div>
        </div>

        <div class="flex-row right">
          <Tooltip :title="`停留时长：${msToSecond(item.keepMs)}秒`">
            <span>{{ msToSecond(item.keepMs) }}秒</span>
          </Tooltip>
          <Tooltip :title="`完读率：${item.readPercent}%`">
            <Progress :width="24" type="circle" :percent="item.readPercent" :show-info="false" :stroke-width="18"
              stroke-linecap="square" stroke-color="#333" />
          </Tooltip>
          <img src="https://static.aside.fun/upload/down.svg" :class="{
            down: true,
            rotate: activeKeys.includes('item_' + item.visitStartTimestamp)
          }">
        </div>
      </div>

      <div v-if="activeKeys.includes('item_' + item.visitStartTimestamp)" class="chat-container"></div>
    </div>
  </div>
  <Empty v-if="loaded && !data.length" style="margin-top: 160px"></Empty>

</template>
<script lang="ts" setup>
import Chartist from 'chartist'
import 'chartist/dist/scss/chartist.scss'
import { nextTick, onMounted, ref, watch } from 'vue'
import { DocsAnalysisInfo, getDocsUserAnalysis } from '@/apis/docs'
import { useDocsStore } from '@/store'
import { getName } from '@/utils/authing'
import { getDateDiff, msToSecond, getDateDiffV2 } from '@/utils/time'

const data = ref<DocsAnalysisInfo[]>([])
const activeKeys = ref<string[]>([])
const docsStore = useDocsStore()
const loaded = ref(false)

function renderChart() {
  const activeKeysSet = new Set(activeKeys.value)
  nextTick(() => {
    data.value.forEach(d => {
      const _d = JSON.parse(JSON.stringify(d))
      const key = 'item_' + d.visitStartTimestamp
      if (!activeKeysSet.has(key)) return
      const node = document.querySelector(`.${key} .chat-container`)
      new Chartist.Bar(node, {
        labels: Object.keys(_d.visits).map(s => `${s} 页`),
        series: [Object.values(_d.visits).map((v) => msToSecond(v as number))] // 
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
    })
  })
}

function handleSwitchChartVisible(key: string) {
  if (activeKeys.value.includes(key)) {
    activeKeys.value = activeKeys.value.filter(a => a !== key)
  }
  else {
    activeKeys.value = [...activeKeys.value, key]
  }
  renderChart()
}

async function getData() {
  loaded.value = false
  const docsId = docsStore.docs?._id
  if (!docsId) return
  const res = await getDocsUserAnalysis(docsId)
  data.value = res
  loaded.value = true
}

onMounted(() => {
  renderChart()
  void getData()
})

watch(() => docsStore.docs, val => {
  if (val) {
    void getData()
  }
})
</script>
<style lang="scss" scoped>
.chat-container {
  width: 100%;
  height: 300px;
  margin: 16px 0;
  overflow: hidden;
}

.down {
  user-select: none;
  cursor: pointer;
  animation-fill-mode: forwards;
  transform: rotate(-90deg);

  &.rotate {
    transform: rotate(0deg);
  }
}

.docs-link-data-container {
  display: flex;
  flex-direction: column;
  gap: 16px;

  .item {
    user-select: none;
    cursor: pointer;

    .right {
      font-size: 14px;
      color: #888;
      gap: 16px;
    }
  }

  .info {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .info-bar {
    line-height: 1.5;

    .title {
      font-size: 14px;
      font-weight: bold;
    }

    .subtitle {
      font-size: 12px;
      color: #888;
    }
  }
}
</style>