<template>
  <div class="project" @click="handleOpenDocs()">
    <div class="cover-container">
      <img :src="previewImageUrl || defaultJpg" class="cover" draggable="false" />
    </div>

    <div class="docs-info">
      <div class="title">{{ name }}</div>
      <div class="extra">{{ props.team ? `${props.team.name} ·` : '' }} 更新于 {{ getDateDiff(updatedTimestamp || 0) }}
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { defineProps, PropType } from 'vue'
import { getDateDiff } from '@/utils/time'
import { Docs } from '@/apis/docs'
import { Team } from '@/apis/team'

const defaultJpg = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPYAAACmCAYAAADpnHI/AAACDElEQVR4nO3TMQqEUBAFwZ29/41/oLmIGChCUxW+SSbpWWttM/M7Otuu9rt34H3/rx8AnidsCBI2BAkbgoQNQcKGIGFDkLAhSNgQJGwIEjYECRuChA1BwoYgYUOQsCFI2BAkbAgSNgQJG4KEDUHChiBhQ5CwIUjYECRsCBI2BAkbgoQNQcKGIGFDkLAhSNgQJGwIEjYECRuChA1BwoYgYUOQsCFI2BAkbAgSNgQJG4KEDUHChiBhQ5CwIUjYECRsCBI2BAkbgoQNQcKGIGFDkLAhSNgQJGwIEjYECRuChA1BwoYgYUOQsCFI2BAkbAgSNgQJG4KEDUHChiBhQ5CwIUjYECRsCBI2BAkbgoQNQcKGIGFDkLAhSNgQJGwIEjYECRuChA1BwoYgYUOQsCFI2BAkbAgSNgQJG4KEDUHChiBhQ5CwIUjYECRsCBI2BAkbgoQNQcKGIGFDkLAhSNgQJGwIEjYECRuChA1BwoYgYUOQsCFI2BAkbAgSNgQJG4KEDUHChiBhQ5CwIUjYECRsCBI2BAkbgoQNQcKGIGFDkLAhSNgQJGwIEjYECRuChA1BwoYgYUOQsCFI2BAkbAgSNgQJG4KEDUHChiBhQ5CwIUjYECRsCBI2BAkbgoQNQcKGIGFDkLAhSNgQJGwIEjYECRuChA1BwoYgYUOQsCFI2BAkbAgSNgQJG4KEDUE7J6YFSL2yVpMAAAAASUVORK5CYII='

const props = defineProps({
  item: {
    type: Object as PropType<Docs>,
    require: true,
  },
  team: {
    type: Object as PropType<Team>,
    required: false
  }
})

const { _id, name, previewImageUrl, updatedTimestamp } = props.item || {}

function handleOpenDocs() {
  window.open(`/editor/${_id}`, '_blank')
}
</script>
<style lang="scss" scoped>
.project {
  width: 100%;
  border-radius: $borderRadius;
  overflow: hidden;
  padding: $borderRadius;
  user-select: none;
  transition: background-color 0.3s;
  border: 2px solid #ffffff00;
  transition: border 0.3s;

  &:hover {
    background-color: #f7fcf7;
    border: 2px solid $themeColor;
  }

  .cover {
    width: calc(100% + 2px);
    height: 200px;
    border-radius: $borderRadius;
    object-fit: cover;
  }

  .cover-container {
    width: 100%;
    height: 200px;
    overflow: hidden;
  }

  .docs-info {
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