<template>
  <div v-if="activeMenuItem?.title" class="guide-bar">
    <div class="left">
      <div class="title">{{ getName(user) }}，你好！</div>

      <div class="content">
        <div>你正在 <strong>{{ activeMenuItem?.title }}</strong> 团队。</div>
        <div>你可以在左侧切换不同的团队或内容；也可以在这个分组下查看或创建内容，并在上方切换不同的功能。</div>
      </div>
    </div>

    <img src="https://static.aside.fun/upload/guide-team.png" class="cover" :draggable="false" />
  </div>

  <Skeleton v-else width="100%" height="148px" />
</template>
<script lang="ts" setup>
import { useDashboardStore } from '@/store'
import { getName } from '@/utils/authing'
import { storeToRefs } from 'pinia'

const { user, activeMenuItem } = storeToRefs(useDashboardStore())
</script>
<style lang="scss" scoped>
.guide-bar {
  width: 100%;
  border: 2px solid $themeColor;
  border-radius: $border-radius-base;
  color: $themeColor;
  height: 148px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  .left {
    padding: 0 24px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;

    .title {
      font-size: 20px;
      font-weight: bolder;
    }

    .content {
      margin-top: 16px;
      line-height: 1.8;
    }
  }

  .cover {
    height: 165px;
    transform: translate(-24px, -19px);
  }
}
</style>