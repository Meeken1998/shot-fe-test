<template>
  <div class="project" @click="handleOpenDocs()">
    <div class="cover-container">
      <img :src="previewImageUrl || defaultJpg" class="cover" draggable="false" />
    </div>

    <div class="docs-info">
      <div class="left">
        <div class="title">{{ name }}</div>
        <div class="extra">{{ props.team ? `${props.team.name} ·` : '' }} 更新于 {{ getDateDiff(updatedTimestamp || 0) }}
        </div>
      </div>

      <div class="right">
        <Dropdown>
          <MoreOutlined />
          <template #overlay>
            <Menu>
              <MenuItem @click="handleDeteteDocs(props.item!)">
                <div style="color: red;">删除</div>
              </MenuItem>
            </Menu>
          </template>
        </Dropdown>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { defineProps, PropType } from 'vue'
import { getDateDiff } from '@/utils/time'
import { Docs, deleteDocs } from '@/apis/docs'
import { Team } from '@/apis/team'
import { MoreOutlined } from '@ant-design/icons-vue'
import { message, Modal } from 'ant-design-vue'

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

const { _id, name, previewImageUrl, updatedTimestamp, type } = props.item || {}

const emit = defineEmits<{
  (event: 'delete'): void
}>()

function handleOpenDocs() {
  let url: string
  switch (type) {
    case 'ppt':
      url = `/editor/${_id}`
      break
    case 'pdf':
      url = `/viewer/${_id}`
      break
    default:
      url = 'about:blank'
  }
  if (type === 'ppt') {
    url = `/editor/${_id}`
  }
  window.open(url, '_blank')
}

function handleDeteteDocs(docs: Docs) {
  const docsId = docs._id
  Modal.confirm({
    title: '删除前确认',
    centered: true,
    okText: '确认删除',
    cancelText: '取消',
    content: `确定要删除文档「${docs.name}」吗，该操作不可恢复？`,
    onOk: async () => {
      const res = await deleteDocs(docsId)
      if (res) {
        void message.success('删除成功')
        emit('delete')
      }
    }
  })
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
    display: flex;
    justify-content: space-between;
    align-items: flex-end;

    .right {
      visibility: hidden;
      cursor: pointer;
    }

    &:hover {
      .right {
        visibility: visible;
      }
    }

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