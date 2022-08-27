<template>
  <div class="editor-header-v2">
    <div class="flex-row" :style="{ flex: '1' }">
      <div class="logo-bar">
        <img class="logo" src="https://static.aside.fun/upload/logo-no-text.svg" :draggable="false" />
        <div class="team-info">
          <div @click="handleTitleBlur">
            <div v-if="!isTitleInputVisible" class="title">{{ title }}</div>
            <input ref="inputRef" v-else class="title edit-title" v-model="title" v-on:keyup="(e) => {
              if (e.keyCode === 13) {
                handleTitleChange()
              }
            }" @focusout="handleTitleChange" />
          </div>
          <div class="flex-row">
            <div class="second-link flex-row">
              <LeftOutlined :style="{ fontSize: '12px' }" />
              <span>猴子无限</span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="clientWidth >= 1600" class="switch-mode flex-row">
        <span class="switch-link" :data-active="mode === SlidesDisplayMode.PPT"
          @click="mode = SlidesDisplayMode.PPT">幻灯片模式</span>
        <Switch :checked="mode === SlidesDisplayMode.STORYBOARD" @change="(e) => {
          mode = e ? SlidesDisplayMode.STORYBOARD : SlidesDisplayMode.PPT
        }" />
        <span class="switch-link" :data-active="mode === SlidesDisplayMode.STORYBOARD"
          @click="mode = SlidesDisplayMode.STORYBOARD">纷镜模式</span>
      </div>
    </div>

    <ToolBarV2 />

    <div class="right-side">
      <ScaleSelector class="scale-bar-container" />
      <CoUsers class="co-users-container" />
      <img src="https://static.aside.fun/upload/metrics.svg" class="right-icon" :draggable="false" />
      <img src="https://static.aside.fun/upload/member.svg" class="right-icon" :draggable="false" />
      <img src="https://static.aside.fun/upload/share.svg" class="right-icon" :draggable="false" />
      <img src="https://static.aside.fun/upload/play.svg" class="right-icon" :draggable="false" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { nextTick, ref } from 'vue'
import { useScreenStore, useSlidesStore } from '@/store'
import { LeftOutlined } from '@ant-design/icons-vue'
import { storeToRefs } from 'pinia'
import { SlidesDisplayMode } from '@/types/slides'
import ToolBarV2 from '../CanvasTool/ToolBarV2.vue'
import CoUsers from './CoUsers.vue'
import ScaleSelector from './ScaleSelector.vue'

const slidesStore = useSlidesStore()
const { mode } = storeToRefs(slidesStore)
const { clientWidth } = storeToRefs(useScreenStore())

const isTitleInputVisible = ref(false)
const title = ref('核桃编程客户案例20220222')
const inputRef = ref<HTMLInputElement>()

function handleTitleChange() {
  if (!title.value.trim()) {
    title.value = '未命名文档'
  }
  isTitleInputVisible.value = false
}

function handleTitleBlur() {
  if (!isTitleInputVisible.value) {
    isTitleInputVisible.value = true
    nextTick(() => {
      inputRef.value?.select()
    })
  }
}

</script>
<style lang="scss" scoped>
.editor-header-v2 {
  width: 100vw;
  height: 84px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid $borderColor;
  padding: 0 24px;

  .right-side {
    flex: 1;
    height: 54px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;

    .co-users-container {
      margin-right: 24px;
    }

    .right-icon {
      width: 38px;
      height: 38px;
      user-select: none;
      cursor: pointer;
      padding: 8px;
      border-radius: 4px;
      transition: all .3s;

      &:hover {
        background-color: #f9f9f9;
      }

      &:last-child {
        margin-left: calc(24px + 16px);
      }
    }
  }

  .logo-bar {
    display: flex;
    align-items: center;
    gap: 16px;
    user-select: none;
    width: 216px;
    border-right: 1px solid $borderColor;

    .logo {
      height: 48px;
    }

    .team-info {
      font-size: 13px;
      line-height: 24px;
      font-weight: 500;
      overflow: hidden;

      .title {
        font-weight: bold;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        width: 140px;
        border: 1px solid transparent;
        border-radius: 2px;
        padding: 0 4px;

        &:hover {
          border-color: $borderColor;
          background-color: $borderColor;
        }
      }

      .second-link {
        color: $grayColor;
        gap: 4px;
        transition: opacity 0.3s;
        cursor: pointer;
        padding: 0 4px;
        font-size: 12px;
        transition: all .3s;

        &:hover {
          color: unset;
        }
      }

      .devider {
        color: $borderColor;
        margin: 0 8px;
        font-size: 13px;
        font-weight: normal;
      }
    }
  }

  .switch-mode {
    gap: 12px;
    padding: 0 32px;
    font-size: 12px;
    font-weight: bold;
    color: $grayColor;
    user-select: none;
    border-right: 1px solid $borderColor;
    width: 250px;
    height: 54px;

    .switch-link {
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: #333 !important;
      }
    }

    span[data-active="true"] {
      color: $themeColor;

      &:hover {
        color: $themeColor  !important;
      }
    }
  }
}

.edit-title {
  border: unset;
  outline: unset;
  background-color: $borderColor;
  overflow: visible;
  text-overflow: unset;
}
</style>