<template>
  <div class="editor-header-v2">
    <div class="flex-row" :style="{ flex: '1' }">
      <div class="logo-bar">
        <img class="logo" src="https://static.aside.fun/upload/logo-no-text.svg" :draggable="false"
          @click="router.replace({ path: '/' })" />
        <div class="team-info" v-if="docsMeta.name && docsMeta?.team?.id">
          <div @click="handleTitleBlur">
            <div v-if="!isTitleInputVisible" class="title">{{  docsMeta.name  }}</div>
            <input ref="inputRef" v-else class="title edit-title" v-model="docsMeta.name" v-on:keyup="(e) => {
              if (e.keyCode === 13) {
                handleTitleChange()
              }
            }" @focusout="handleTitleChange" />
          </div>
          <div class="flex-row">
            <Tooltip :title="`返回到「${docsMeta?.team?.name}」团队首页`" :mouseEnterDelay="1">
              <div class="second-link flex-row" @click="handleBack2Team()">
                <LeftOutlined :style="{ fontSize: '12px' }" />
                <span>{{  docsMeta?.team?.name  }}</span>
              </div>
            </Tooltip>
          </div>
        </div>

        <div v-else class="team-info skeleton-wrapper">
          <Skeleton width="120px" height="20px" class="title skeleton" />
          <Skeleton width="100px" height="20px" class="second-link" />
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

    <ToolBarV2 :narrow-screen="clientWidth < 1600" />

    <div :class="{
      'right-side': true,
      'small-screen': clientWidth < 1600
    }">
      <ScaleSelector class="scale-bar-container" />
      <CoUsers class="co-users-container" />
      <img src="https://static.aside.fun/upload/metrics.svg" class="right-icon" :draggable="false" />
      <img src="https://static.aside.fun/upload/member.svg" class="right-icon" :draggable="false" />
      <img src="https://static.aside.fun/upload/share.svg" class="right-icon" :draggable="false" />
      <Tooltip title="全屏演示 (F5)">
        <img src="https://static.aside.fun/upload/play.svg" class="right-icon" :draggable="false"
          @click="enterScreening()" />
      </Tooltip>
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
import { updateDocsMeta } from '@/apis/docs'
import { message } from 'ant-design-vue'
import { debounce } from 'lodash'
import router from '@/views/router'
import { setTitle } from '@/utils/title'
// import { enterFullscreen } from '@/utils/fullscreen'
import useScreening from '@/hooks/useScreening'
const { enterScreening } = useScreening()

const slidesStore = useSlidesStore()
const { mode, docsMeta, docs } = storeToRefs(slidesStore)
const { clientWidth } = storeToRefs(useScreenStore())

const isTitleInputVisible = ref(false)
const inputRef = ref<HTMLInputElement>()

const handleUpdateDocsMeta = debounce(async () => {
  const res = await updateDocsMeta(docs.value?._id || '', docsMeta.value.name)
  if (!res) {
    void message.warning('修改文档名称失败')
  }
  else {
    setTitle(`${docsMeta.value.name} - ${docsMeta.value.team.name}`)
  }
})


function handleTitleChange() {
  if (!docsMeta.value.name.trim()) {
    docsMeta.value.name = '未命名文档'
  }
  void handleUpdateDocsMeta()
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

function handleBack2Team() {
  router.push({
    path: `/team/${docs.value?.teamId}`
  })
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
        margin-left: calc(24px + 12px);
      }
    }

    &.small-screen {
      gap: 0;
      .co-users-container {
        margin-right: 12px !important;
      }

      .right-icon:last-child {
        margin-left: 12px;
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
      width: 32px;
      height: 48px;
      cursor: pointer;
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

        &.skeleton {
          transform: translateX(-4px);
        }

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