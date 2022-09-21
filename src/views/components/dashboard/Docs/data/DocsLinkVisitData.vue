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
    <div class="link" v-for="item in data" :key="item.shareLinkId">
      <div class="link-info">
        <div class="link-title flex-row">
          <span>{{ item.shareLinkInfo.name }}</span>
          <LinkOutlined />
        </div>
        <div class="link-href">
          aside.fun/share/{{ item.shareLinkId }}
        </div>
      </div>
      <div v-for="visit in item.visitors" :key="visit.visitStartTimestamp" class="item" @click="handleSwitchChartVisible(visit._id)" :data-id="visit._id">
        <div class="info">
          <div class="flex-row" style="gap: 12px">
            <Avatar :size="32" :src="visit.userInfo.photo!"></Avatar>
            <div class="info-bar">
              <div class="title">{{ getName(visit.userInfo) }}</div>
              <div class="subtitle">{{ getDateDiff(visit.visitStartTimestamp) }}</div>
            </div>
          </div>

          <div class="flex-row right">
            <Tooltip :title="`停留时长：${msToSecond(visit.keepMs)}秒`">
              <span>{{ getTimeGap(visit.keepMs) }}</span>
            </Tooltip>
            <Tooltip :title="`完读率：${visit.readPercent}%`">
              <Progress :width="24" type="circle" :percent="visit.readPercent" :show-info="false" :stroke-width="18"
                stroke-linecap="square" stroke-color="#333" />
            </Tooltip>
            <img src="https://static.aside.fun/upload/down.svg" :class="{
              down: true,
              rotate: activeKeys.includes(visit._id)
            }">
          </div>
        </div>

        <div v-if="activeKeys.includes(visit._id)" class="chat-container">
        </div>
      </div>
    </div>
  </div>
  <Empty v-if="loaded && !data.length" style="margin-top: 160px"></Empty>

</template>
<script lang="ts" setup>
import Chartist from 'chartist'
import 'chartist/dist/scss/chartist.scss'
import { nextTick, onMounted, ref, watch } from 'vue'
import { DocsLinkAnalysisInfo, getDocsLinkAnalysis } from '@/apis/docs'
import { useDocsStore } from '@/store'
import { getName } from '@/utils/authing'
import { getDateDiff, msToSecond, getDateDiffV2, getTimeGap } from '@/utils/time'
import { LinkOutlined } from '@ant-design/icons-vue'

const data = ref<DocsLinkAnalysisInfo[]>([])
const activeKeys = ref<string[]>([])
const docsStore = useDocsStore()
const loaded = ref(false)

function renderChart() {
  const activeKeysSet = new Set(activeKeys.value)
  nextTick(() => {
    data.value.forEach(d => {
      d.visitors.forEach(v => {
        const _d = JSON.parse(JSON.stringify(v))
        const key = v._id.toString()
        if (!activeKeysSet.has(key)) return
        const node = document.querySelector(`[data-id="${key}"] .chat-container`)
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
  const res = await getDocsLinkAnalysis(docsId)
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
.link-info {

  .link-title {
    font-size: 15px;
    font-weight: bold;
    gap: 8px;
  }

  .link-href {
    color: #888;
    font-size: 13px;
  }
}

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

.link {
  display: flex;
  flex-direction: column;
  gap: 16px;
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