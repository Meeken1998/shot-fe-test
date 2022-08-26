<template>
  <div class="toolbar-v2">
    <div class="tool-btn" v-for="(item) in slideEditorTools" :key="item.key">
      <img :src="item.iconUrl" class="icon" :draggable="false" />
      <span>{{ item.name }}</span>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { slideEditorTools } from '@/types/toolbar'

</script>
<style lang="scss" scoped>
.toolbar-v2 {
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;

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

    .icon {
      width: 18px;
      height: 18px;
    }

    &:nth-child(2) {
      // 重做
      margin-right: 24px;
    }
  }

}
</style>