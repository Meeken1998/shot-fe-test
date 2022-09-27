<template>
  <SkeletonTheme color="#eef5ee" highlight="#f7fcf7" :duration="2">
    <ConfigProvider :autoInsertSpaceInButton="false">
      <router-view></router-view>
    </ConfigProvider>
  </SkeletonTheme>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { useScreenStore } from '@/store/screen'
import { storeToRefs } from 'pinia'

const { clientWidth } = storeToRefs(useScreenStore())
onMounted(() => {
  clientWidth.value = document.body.clientWidth
  window.addEventListener('resize', () => {
    clientWidth.value = document.body.clientWidth
  })
})
</script>

<style lang="scss">
#app {
  height: 100%;
}
</style>