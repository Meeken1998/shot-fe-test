<template>
  <div class="team-page page-container">
    <GuideBar v-if="teamInfo" :team-info="teamInfo" />

    <div class="docs-container">
      <Empty v-if="!docs?.length" :style="{ marginTop: '200px' }" />
      <ProjectWrapper :items="docs || []" :team="teamInfo" />
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
const { activeMenuItem, sidebarKey, menuItems } = storeToRefs(dashboardStore)
const docs = ref<Docs[]>()
const route = useRoute()
const teamInfo = ref<Team>()

async function getData() {
  const { teamId } = route.params as Record<string, string>
  // 刷新左侧菜单
  sidebarKey.value = teamId
  activeMenuItem.value = getActiveMenuItem(teamId, menuItems.value) || null
  docs.value = await getTeamDocs(teamId)
  const team = await getTeamDetail(teamId)
  teamInfo.value = team
  dashboardStore.setCurrentTeam(team)
  setTitle(team.name)
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
}
</style>