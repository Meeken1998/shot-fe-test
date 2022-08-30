<template>
  <div class="thumbnail-slide" :style="{
    width: size + 'px',
    height: size * viewportRatio + 'px',
    outlineColor: selected ? '#6B9056' : '#d8d8d880',
    borderRadius: '3px'
  }" style="position: relative">
    <div class="elements" :style="{
      width: VIEWPORT_SIZE + 'px',
      height: VIEWPORT_SIZE * viewportRatio + 'px',
      transform: `scale(${scale})`,
    }" v-if="visible">
      <div class="background" :style="backgroundStyle"></div>
      <ThumbnailElement v-for="(element, index) in slide.elements" :key="element.id" :elementInfo="element"
        :elementIndex="index + 1" />
    </div>
    <div class="placeholder" v-else>加载中 ...</div>
  </div>
  <div v-if="coopUser" class="co-user">
    <Avatar :src="coopUser.avatar" :size="32" :draggable="false"></Avatar>
    <div class="dot" :style="{ backgroundColor: coopUser.dotColor }" />
  </div>

</template>

<script lang="ts" setup>
import { computed, PropType, provide, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useSlidesStore } from '@/store'
import { Slide } from '@/types/slides'
import { injectKeySlideScale } from '@/types/injectKey'
import { VIEWPORT_SIZE } from '@/configs/canvas'
import useSlideBackgroundStyle from '@/hooks/useSlideBackgroundStyle'

import ThumbnailElement from './ThumbnailElement.vue'
import { ICoopUserInfo } from '@/store/slides'

const props = defineProps({
  slide: {
    type: Object as PropType<Slide>,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  visible: {
    type: Boolean,
    default: true,
  },
  coopUser: {
    type: Object as PropType<ICoopUserInfo>,
    required: false,
  },
  selected: {
    type: Boolean,
    required: false,
    default: false
  }
})

const slidesStore = useSlidesStore()
const { viewportRatio } = storeToRefs(slidesStore)

const background = computed(() => props.slide.background)
const { backgroundStyle } = useSlideBackgroundStyle(background)

const scale = computed(() => props.size / VIEWPORT_SIZE)
provide(injectKeySlideScale, scale)

onMounted(() => slidesStore.cloudSlidesLoadedCallback())
</script>

<style lang="scss" scoped>
.thumbnail-slide {
  background-color: #fff;
  overflow: hidden;
  outline: 2px solid #d8d8d880;
}

.elements {
  transform-origin: 0 0;
}

.background {
  width: 100%;
  height: 100%;
  background-position: center;
  position: absolute;
}

.placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.co-user {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: flex-end;
  flex-shrink: 0;
  position: absolute;
  align-self: flex-end;
  transform: scale(0.8) translateX(24px);

  .dot {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    position: absolute;
    background-color: green;
    border: 3px solid #fff;
    transform: translate(4px, 4px);
  }
}
</style>
