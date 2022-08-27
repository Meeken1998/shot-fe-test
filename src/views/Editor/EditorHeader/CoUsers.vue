<template>
  <div class="co-users flex-row">
    <div class="co-user" v-for="(user, id) in coopUserInfo" :key="id">
      <Avatar :src="user.avatar" :size="32" :draggable="false"></Avatar>
      <div class="dot" :style="{ backgroundColor: user?.dotColor }" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useSlidesStore } from '@/store'
const slidesStore = useSlidesStore()
const { coopUserInfo } = storeToRefs(slidesStore)
</script>
<style lang="scss" scoped>
.co-users {
  .co-user {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: flex-end;
    flex-shrink: 0;

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
}
</style>