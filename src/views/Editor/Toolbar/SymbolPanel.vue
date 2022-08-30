<template>
  <div class="symbol-panel">
    <PanelItemContainer v-for="item in SYMBOL_LIST" :title="`插入${item.label}`" :key="item.key"
      @onexpand="handleTabClick(item.key)" :expand="item.key === selectedSymbolKey">
      <div class="pool">
        <div class="symbol-item" v-for="(symbol, index) in SYMBOL_MAPPER[item.key]" :key="index" @click="selectSymbol(symbol)">
          <div class="symbol">{{ symbol }}</div>
        </div>
      </div>
    </PanelItemContainer>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { SYMBOL_MAPPER, SYMBOL_LIST } from '@/configs/symbol'
import emitter, { EmitterEvents } from '@/utils/emitter'
import PanelItemContainer from './PanelItemContainer.vue'

const selectedSymbolKey = ref('')

const selectSymbol = (value: string) => {
  emitter.emit(EmitterEvents.RICH_TEXT_COMMAND, { action: { command: 'insert', value } })
}

function handleTabClick(tab: string) {
  if (tab === selectedSymbolKey.value) {
    selectedSymbolKey.value = ''
    return
  }
  selectedSymbolKey.value = tab
}
</script>

<style lang="scss" scoped>
.symbol-panel {
  height: 100%;
  display: flex;
  flex-direction: column;

  .tabs {
    display: flex;
    justify-content: space-around;
    align-items: center;
    border-bottom: 1px solid $borderColor;
    margin-bottom: 8px;
  }

  .tab {
    padding: 6px 0;
    border-bottom: 2px solid transparent;
    cursor: pointer;

    &.active {
      border-bottom: 2px solid $themeColor;
    }
  }

  .pool {
    padding: 5px 12px;
    margin: 0 -12px;
    flex: 1;
    font-size: 18px;

    @include overflow-overlay();
    @include flex-grid-layout();
  }

  .symbol-item {
    @include flex-grid-layout-children(5, 18%);

    height: 0;
    padding-bottom: 18%;
    position: relative;
    cursor: pointer;
    border: 1px solid $borderColor;

    &:hover {
      color: $themeColor;
    }

    .symbol {
      @include absolute-0();

      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #fff;
    }
  }
}
</style>
