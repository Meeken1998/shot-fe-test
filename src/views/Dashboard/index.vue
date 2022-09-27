<template>
  <SkeletonTheme color="#eef5ee" highlight="#f7fcf7" :duration="2">
    <DashboardHeaderBar />
    <div class="dashboard">
      <Sidebar />
      <div class="right-side">
        <router-view></router-view>
      </div>
    </div>
  </SkeletonTheme>
</template>
<script lang="ts" setup>
import Sidebar from '@/views/components/dashboard/Sidebar/index.vue'
import DashboardHeaderBar from '../components/dashboard/DashboardHeaderBar.vue'
import { onBeforeMount } from 'vue'

onBeforeMount(() => {
  if (window.history.state?.token) {
    localStorage.setItem('token', window.history.state.token)
  }
})

</script>
<style lang="scss" scoped>
.dashboard {
  width: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;

  .right-side {
    flex: 1;
    height: calc(100vh - 92px - 1px);
    overflow-y: auto;
  }
}
</style>