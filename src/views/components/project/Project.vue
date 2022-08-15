<template>
  <div class="project">
    <img :src="cover" class="cover" draggable="false" />

    <div class="info">
      <div class="title">{{ title }}</div>
      <div class="extra">2022年会演讲 · 更新于{{ getDateDiff(updateTimestamp || 0) }}</div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ProjectItem } from '@/types/project'
import { defineProps, PropType } from 'vue'
import { getDateDiff } from '@/utils/time'

const props = defineProps({
  item: {
    type: Object as PropType<ProjectItem>,
    require: true,
  },
})

const { id, title, cover, updateTimestamp, type } = props.item || {}
</script>
<style lang="scss" scoped>
.project {
  width: 100%;
  border-radius: $borderRadius;
  overflow: hidden;
  padding: $borderRadius;
  user-select: none;
  transition: background-color 0.3s;

  &:hover {
    background-color: #ebebeb;
  }

  .cover {
    width: 100%;
    height: 200px;
    border-radius: $borderRadius;
    overflow: hidden;
  }

  .info {
    line-height: 2;
    padding: 6px;

    .title {
      font-size: 14px;
      font-weight: bold;
    }

    .extra {
      font-size: 13px;
      color: #666;
    }
  }
}
</style>