<template>
  <div class="tool-bar-container">

    <div v-if="toolbarState" class="toolbar">
      <div class="content">
        <component :is="currentPanelComponent"></component>
      </div>
    </div>
  </div>

  <div class="tabs-v2">
    <div class="tab" :class="{ 'active': tab.value === toolbarState }" v-for="tab in currentTabs" :key="tab.value"
      @click="setToolbarState(tab.value)">
      <img :src="toolsetIconMapper[tab.label]" :draggable="false" />
      <span>{{ tab.label }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, watch } from 'vue'
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

interface ElementTabs {
  label: string
  value: ToolbarStates
}

const mainStore = useMainStore()
const { activeElementIdList, handleElement, toolbarState } = storeToRefs(mainStore)

const elementTabs = computed<ElementTabs[]>(() => {
  if (handleElement.value?.type === 'text') {
    return [
      { label: '样式', value: ToolbarStates.EL_STYLE },
      { label: '符号', value: ToolbarStates.SYMBOL },
      { label: '位置', value: ToolbarStates.EL_POSITION },
      { label: '动画', value: ToolbarStates.EL_ANIMATION },
    ]
  }
  return [
    { label: '样式', value: ToolbarStates.EL_STYLE },
    { label: '位置', value: ToolbarStates.EL_POSITION },
    { label: '动画', value: ToolbarStates.EL_ANIMATION },
  ]
})
const slideTabs = [
  { label: '样式', value: ToolbarStates.SLIDE_DESIGN },
  { label: '切换', value: ToolbarStates.SLIDE_ANIMATION },
  { label: '动画', value: ToolbarStates.EL_ANIMATION },
]
const multiSelectTabs = [
  { label: '样式', value: ToolbarStates.EL_STYLE },
  { label: '位置', value: ToolbarStates.MULTI_POSITION },
]

const toolsetIconMapper: Record<string, string> = {
  样式: 'https://static.aside.fun/upload/style.svg',
  切换: 'https://static.aside.fun/upload/switch.svg',
  位置: 'https://static.aside.fun/upload/position.svg',
  历史: 'https://static.aside.fun/upload/history.svg',
  动画: 'https://static.aside.fun/upload/animation.svg',
  符号: 'https://static.aside.fun/upload/symbol.svg'
}

const setToolbarState = (value: ToolbarStates) => {
  if (toolbarState.value === value) {
    // 取消选中
    mainStore.setToolbarState(null)
    return
  }
  mainStore.setToolbarState(value)
}

const currentTabs = computed(() => {
  if (!activeElementIdList.value.length) return slideTabs
  else if (activeElementIdList.value.length > 1) return multiSelectTabs
  return elementTabs.value
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
}

.toolbar {
  width: 250px;
  border-left: solid 1px $borderColor;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  padding: 8px;
}

.content {
  padding: 12px;
  font-size: 13px;
  overflow-y: overlay;
  overflow-x: hidden;
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