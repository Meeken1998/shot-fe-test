<template>
  <SkeletonTheme color="#eef5ee" highlight="#f7fcf7" :duration="2">
    <DashboardHeaderBar :show-menu="false">
      <div class="headerbar-menu-item">
        <span class="icon">
          <ArrowLeftOutlined />
        </span>
        <span>返回首页</span>
      </div>
    </DashboardHeaderBar>
    <div class="dashboard">
      <Sidebar :is-out-of-team="true" />
      <div class="right-side">
        <div class="page-container">
          <div class="profile-page">
            TBD
          </div>
        </div>
      </div>
    </div>
  </SkeletonTheme>
</template>
<script lang="ts" setup>
import Sidebar from '@/views/components/dashboard/Sidebar/index.vue'
import DashboardHeaderBar from '@/views/components/dashboard/DashboardHeaderBar.vue'
import { ArrowLeftOutlined } from '@ant-design/icons-vue'
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
    min-height: calc(100vh - 92px - 1px);
    overflow-y: auto;
  }
}

.profile-page {
  width: 100%;
  padding: 8px 64px;
}
</style>