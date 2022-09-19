<template>
  <div class="docs-link-data-container">
    <div class="item">
      <div class="info">
        <div class="flex-row" style="gap: 12px">
          <Avatar :size="32">伯昊</Avatar>
          <div class="info-bar">
            <div class="title">因伯昊</div>
            <div class="subtitle">4 小时前</div>
          </div>
        </div>

        <div class="flex-row right">
          <Tooltip title="停留时长：30秒">
            <span>00:30</span>
          </Tooltip>
          <Tooltip title="完读率：30%">
            <Progress :width="24" type="circle" :percent="30" :show-info="false" :stroke-width="18"
              stroke-linecap="square" stroke-color="#333" />
          </Tooltip>
          <img src="https://static.aside.fun/upload/down.svg" class="down">
        </div>
      </div>

      <div class="chat-container" ref="chatRef"></div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { DownOutlined } from '@ant-design/icons-vue'
import Chartist from 'chartist'
import 'chartist/dist/scss/chartist.scss'
import { onMounted, ref } from 'vue'

const chatRef = ref<HTMLDivElement>()

function renderChart() {
  new Chartist.Bar(chatRef.value, {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    series: [
      [800000, 1200000, 1400000, 1300000]
    ]
  }, {
    stackBars: true,
    axisY: {
      labelInterpolationFnc: (value: number) => {
        return (value / 1000) + 'k'
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
  renderChart()
})
</script>
<style lang="scss" scoped>
.chat-container {
  width: 100%;
  height: 300px;
  margin: 16px 0;
}

.down {
  user-select: none;
  cursor: pointer;
}

.docs-link-data-container {
  .item {
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