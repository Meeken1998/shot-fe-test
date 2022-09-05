<template>
  <div :class="{
    'toolbar-v2': true,
    'small-screen': props.narrowScreen,
    'loaded': pdfController?.loaded
  }">
    <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="1" title="展开 / 收起目录">
      <div :class="{
        'tool-btn': true,
        'active': pdfController?.sidebarOpened
      }" style="margin-right: 12px;" @click="handleEmit('sidebar')">
        <UnorderedListOutlined class="icon" />
        <span>目录</span>
      </div>
    </Tooltip>

    <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="1" title="单页 (幻灯片) 模式查看">
      <div :class="{
        'tool-btn': true,
        'active': pdfController?.isSinglePageMode
      }" style="margin-right: 12px;" @click="handleEmit('singleMode')">
        <FilePptOutlined class="icon" />
        <span>单页</span>
      </div>
    </Tooltip>

    <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="1" title="上一页 (←)">
      <div class="tool-btn" @click="handleEmit('prev')">
        <ArrowLeftOutlined class="icon" />
        <span>上页</span>
      </div>
    </Tooltip>

    <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="1" title="下一页 (→)">
      <div class="tool-btn" @click="handleEmit('next')">
        <ArrowRightOutlined class="icon" />
        <span>下页</span>
      </div>
    </Tooltip>

    <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="1" title="缩小 (-)">
      <div class="tool-btn" @click="handleEmit('decScale')">
        <ZoomOutOutlined class="icon" />
        <span>缩小</span>
      </div>
    </Tooltip>

    <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="1" title="放大 (+)">
      <div class="tool-btn" style="margin-right: 12px;" @click="handleEmit('incScale')">
        <ZoomInOutlined class="icon" />
        <span>放大</span>
      </div>
    </Tooltip>

    <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="1" title="查找文档中的内容 (⌘ + F)">
      <div :class="{
        'tool-btn': true,
        'active': pdfController?.findBarOpened
      }" @click="handleEmit('search')">
        <FileSearchOutlined class="icon" />
        <span>查找</span>
      </div>
    </Tooltip>

    <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="1" title="复制当前位置的分享链接">
      <div class="tool-btn" @click="handleEmit('link')">
        <LinkOutlined class="icon" />
        <span>链接</span>
      </div>
    </Tooltip>
  </div>
</template>
<script lang="ts" setup>
import { defineProps } from 'vue'
import { UnorderedListOutlined, FileSearchOutlined, ArrowLeftOutlined, ArrowRightOutlined, ZoomInOutlined, ZoomOutOutlined, LinkOutlined, FilePptOutlined } from '@ant-design/icons-vue'
import { useDocsStore } from '@/store'
import { storeToRefs } from 'pinia'
const docsStore = useDocsStore()
const { pdfController } = storeToRefs(docsStore)

function handleEmit(type: string, data?: any) {
  docsStore.emitEvent({
    type,
    data,
  })
}

const props = defineProps({
  narrowScreen: {
    type: Boolean,
    required: true,
  }
})
</script>
<style lang="scss" scoped>
.toolbar-v2 {
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;

  &.loaded {
    pointer-events: all;
  }

  .tool-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    font-size: 11px;
    letter-spacing: 1px;
    user-select: none;
    padding: 12px;
    border-radius: $borderRadius;
    transition: all .3s;

    &:hover {
      background-color: #f9f9f9;
    }

    &.active {
      background-color: #eee;
    }

    .icon {
      width: 18px;
      height: 18px;
      font-size: 16px;
      color: #000;
    }
  }

  &.small-screen {
    .tool-btn {
      padding: 12px 8px;
      gap: 6px;
    }

    .icon {
      width: 16px;
      height: 16px;
    }
  }
}
</style>