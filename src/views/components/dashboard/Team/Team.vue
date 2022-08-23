<template>
  <div class="team-page page-container">
    <GuideBar />

    <div v-if="!loading" class="docs-container">
      <Empty v-if="!docs?.length" :style="{ marginTop: '200px' }" />
      <ProjectWrapper :items="docs || []" :team="teamInfo" />
    </div>

    <div v-else class="loading-wrapper docs-container">
      <div v-for="(_, key) in Array(8).fill(null)" :key="key" class="item">
        <Skeleton width="100%" height="240px"></Skeleton>
        <Skeleton width="60%" class="title" height="16px"></Skeleton>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useDashboardStore } from '@/store'
import { storeToRefs } from 'pinia'
import { onMounted, ref, watch } from 'vue'
import { getTeamDetail, getTeamDocs, Team } from '@/apis/team'
import { useRoute } from 'vue-router'
import { getActiveMenuItem } from '@/store/dashboard'
import { setTitle } from '@/utils/title'
import ProjectWrapper from '../../project/ProjectWrapper.vue'
import GuideBar from '../GuideBar/GuideBar.vue'
import { Docs } from '@/apis/docs'

const dashboardStore = useDashboardStore()
const { activeMenuItem, sidebarKey, menuItems, currentTeam } = storeToRefs(dashboardStore)
const docs = ref<Docs[]>()
const route = useRoute()
const teamInfo = ref<Team>()
const loading = ref(true)

async function getData() {
  loading.value = true
  const { teamId } = route.params as Record<string, string>
  // 刷新左侧菜单
  sidebarKey.value = teamId
  activeMenuItem.value = getActiveMenuItem(teamId, menuItems.value) || null
  docs.value = await getTeamDocs(teamId)
  const team = await getTeamDetail(teamId)
  teamInfo.value = team
  currentTeam.value = team
  setTitle(team.name)
  loading.value = false
}

watch(() => route.params?.teamId, getData)

onMounted(() => {
  void getData()
  dashboardStore.setActiveHeaderBarMenuKey('team')
})
</script>
<style lang="scss">
.team-page {
  width: 100%;

  .tabs {
    margin-top: 24px;

    .ant-tabs-tab {
      padding: 8px 0 !important;
    }
  }

  .docs-container {
    margin-top: 24px;
    width: 100%;
  }

  .loading-wrapper {
    width: 100%;
    display: grid;
    gap: 16px;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));

    .item {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
  }
}
</style>