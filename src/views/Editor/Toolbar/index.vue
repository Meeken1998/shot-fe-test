<template>
  <div class="tool-bar-container">

    <div v-if="selectedTab" class="toolbar">
      <div class="title">
        <div class="flex-row">
          <img :src="toolsetIconMapper[selectedTab.label]" :draggable="false" />
          <span style="margin-left: 8px">{{ selectedTab.label }}</span>
        </div>
        <Tooltip title="隐藏面板">
          <div class="button" @click="mainStore.setToolbarState(null)">
            <CloseOutlined />
          </div>
        </Tooltip>
      </div>
      <div class="content">
        <component v-if="!selectedTab.disabledTips" :is="currentPanelComponent"></component>
        <div v-else class="tips">{{ selectedTab.disabledTips }}</div>
      </div>
    </div>
  </div>

  <div class="tabs-v2">
    <div class="tab" :class="{ 'active': tab.value === toolbarState }" v-for="tab in currentTabs" :key="tab.value"
      @click="setToolbarState(tab)">
      <img :src="toolsetIconMapper[tab.label]" :draggable="false" />
      <span>{{ tab.label }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore } from '@/store'
import { ToolbarStates } from '@/types/toolbar'

import ElementStylePanel from './ElementStylePanel/index.vue'
import ElementPositionPanel from './ElementPositionPanel.vue'
import ElementAnimationPanel from './ElementAnimationPanel.vue'
import SlideDesignPanel from './SlideDesignPanel.vue'
import SlideAnimationPanel from './SlideAnimationPanel.vue'
import MultiPositionPanel from './MultiPositionPanel.vue'
import SymbolPanel from './SymbolPanel.vue'
import { CloseOutlined } from '@ant-design/icons-vue'

interface ElementTabs {
  label: string
  value: ToolbarStates
  disabledTips?: string
}

const mainStore = useMainStore()
const { activeElementIdList, toolbarState } = storeToRefs(mainStore)

const toolsetIconMapper: Record<string, string> = {
  样式: 'https://static.aside.fun/upload/style.svg',
  切换: 'https://static.aside.fun/upload/switch.svg',
  位置: 'https://static.aside.fun/upload/position.svg',
  设计: 'https://static.aside.fun/upload/skin.svg',
  动画: 'https://static.aside.fun/upload/animation.svg',
  符号: 'https://static.aside.fun/upload/symbol.svg',
  历史: 'https://static.aside.fun/upload/history-v2.svg'
}

const setToolbarState = (tab: ElementTabs) => {
  if (toolbarState.value === tab.value) {
    // 取消选中
    mainStore.setToolbarState(null)
    return
  }
  mainStore.setToolbarState(tab.value)
}

const currentTabs = computed<ElementTabs[]>(() => {
  const totalTabs: ElementTabs[] = [
    { label: '设计', value: ToolbarStates.SLIDE_DESIGN },
    { label: '切换', value: ToolbarStates.SLIDE_ANIMATION },
  ]
  if (!activeElementIdList.value.length) {
    totalTabs.push(
      { label: '样式', value: ToolbarStates.EL_STYLE, disabledTips: '请选中一个元素' },
      { label: '位置', value: ToolbarStates.EL_POSITION, disabledTips: '请选中一个元素' },
      { label: '动画', value: ToolbarStates.EL_ANIMATION, disabledTips: '请选中一个元素' },
      { label: '符号', value: ToolbarStates.SYMBOL, disabledTips: '请选中一个元素' }
    )
  }
  else if (activeElementIdList.value.length > 1) {
    totalTabs.push(
      { label: '样式', value: ToolbarStates.EL_STYLE },
      { label: '位置', value: ToolbarStates.MULTI_POSITION },
      { label: '动画', value: ToolbarStates.EL_ANIMATION, disabledTips: '请选中一个元素' },
      { label: '符号', value: ToolbarStates.SYMBOL, disabledTips: '请选中一个元素' }
    )
  }
  else {
    totalTabs.push(
      { label: '样式', value: ToolbarStates.EL_STYLE },
      { label: '符号', value: ToolbarStates.SYMBOL },
      { label: '位置', value: ToolbarStates.EL_POSITION },
      { label: '动画', value: ToolbarStates.EL_ANIMATION },
    )
  }
  totalTabs.push({
    label: '历史',
    value: ToolbarStates.HISTORY,
    disabledTips: '即将上线，敬请期待'
  })
  return totalTabs
})

// const currentTabs = ref([
//   { label: '设计', value: ToolbarStates.SLIDE_DESIGN },
//   { label: '切换', value: ToolbarStates.SLIDE_ANIMATION },
//   { label: '样式', value: ToolbarStates.EL_STYLE },
//   { label: '位置', value: ToolbarStates.EL_POSITION },
//   { label: '动画', value: ToolbarStates.EL_ANIMATION },
//   { label: '符号', value: ToolbarStates.SYMBOL },
// ])

const selectedTab = computed<ElementTabs | undefined>(() => {
  const tab = currentTabs.value.find(c => c.value === toolbarState.value)
  return tab
})

watch(currentTabs, () => {
  if (!toolbarState.value) {
    return
  }
  const currentTabsValue: ToolbarStates[] = currentTabs.value.map(tab => tab.value)
  if (!currentTabsValue.includes(toolbarState.value)) {
    mainStore.setToolbarState(currentTabsValue[0])
  }
})

const currentPanelComponent = computed(() => {
  if (!toolbarState.value) return null
  const panelMap = {
    [ToolbarStates.EL_STYLE]: ElementStylePanel,
    [ToolbarStates.EL_POSITION]: ElementPositionPanel,
    [ToolbarStates.EL_ANIMATION]: ElementAnimationPanel,
    [ToolbarStates.SLIDE_DESIGN]: SlideDesignPanel,
    [ToolbarStates.SLIDE_ANIMATION]: SlideAnimationPanel,
    [ToolbarStates.MULTI_POSITION]: MultiPositionPanel,
    [ToolbarStates.SYMBOL]: SymbolPanel,
  }
  return panelMap[toolbarState.value]
})
</script>

<style lang="scss" scoped>
.tool-bar-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background: #f9f9f9;
}

.toolbar {
  width: calc(280px - 16px);
  height: calc(100vh - 72px - 16px - 2 * 16px);
  border: 1px solid $borderColor;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  padding-bottom: 8px;
  margin: 16px;
  margin-right: 0;
  border-radius: $borderRadius;
  overflow: hidden;

  .title {
    width: 100%;
    padding: 16px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    font-weight: bold;
    border-bottom: 1px solid $borderColor;
    user-select: none;

    img {
      width: 16px;
      height: 16px;
    }

    .button {
      padding: 8px;
      font-size: 12px;
      transition: all .3s;
      border-radius: 4px;

      &:hover {
        background-color: #f7f7f7;
      }
    }
  }
}

.content {
  padding: 16px;
  font-size: 13px;
  overflow-y: overlay;
  overflow-x: hidden;
}

.tips {
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-style: italic;
}

.tabs-v2 {
  flex-shrink: 0;
  padding: 12px;
  // padding-left: 0;
  background-color: #f9f9f9;

  .tab {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    user-select: none;
    gap: 4px;
    font-size: 12px;
    width: 53px;
    height: 53px;
    border-radius: 50%;
    background-color: #fff;
    transition: background-color 0.3s;
    letter-spacing: 0.5px;
    border: 1px solid #eee;

    img {
      width: 16px;
      height: 16px;
    }

    &:hover {
      background-color: #fafafa;
    }

    &.active {
      background-color: #eee;
    }

    &:not(:first-child) {
      margin-top: 16px;
    }
  }
}
</style>